import { pineconeIndex } from './pinecone';
import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import logger from '../utils/logger.utils';

//* Generates embeddings for the given text.
async function generateEmbeddings(text: string) {
  const { embedding } = await embed({
    model: google.embedding('gemini-embedding-001'),
    value: text,
    providerOptions: {
      google: {
        outputDimensionality: 1024,
      },
    },
  });
  return embedding;
}

//* Generates embeddings for the codebase and indexes them in Pinecone.
async function indexCodebase(repoId: string, files: { path: string; content: string }[]) {
  const vectors = [];

  for (const file of files) {
    const content = `File: ${file.path}\n\n${file.content}`;

    const truncatedContent = content.slice(0, 10000);

    try {
      const embedding = await generateEmbeddings(truncatedContent);

      vectors.push({
        id: `${repoId}-${file.path.replace(/\//g, '-')}`,
        values: embedding,
        metadata: {
          repoId,
          path: file.path,
          content: truncatedContent,
        },
      });
    } catch (error) {
      logger.error(`Failed to embed ${file.path}:`, error);
    }
  }

  if (vectors.length > 0) {
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await pineconeIndex.upsert({
        records: batch,
      });
    }
  }
  logger.info('Indexed codebase');
}

//* Retrieves context from the codebase based on the query.
async function retrieveContext(query: string, repoId: string, topK: number = 5) {
  const embedding = await generateEmbeddings(query);

  const results = await pineconeIndex.query({
    vector: embedding,
    filter: { repoId },
    topK,
    includeMetadata: true,
  });

  return results.matches.map(match => match.metadata?.content as string).filter(Boolean);
}

export { generateEmbeddings, indexCodebase, retrieveContext };
