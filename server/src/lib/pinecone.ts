import { Pinecone } from '@pinecone-database/pinecone';
import { env } from '../config/env.config';

export const pinecone = new Pinecone({
  apiKey: env.PINECONE_DB_API_KEY,
});

const indexName = env.PINECONE_DB_INDEX_NAME;

export const pineconeIndex = pinecone.index(indexName);
