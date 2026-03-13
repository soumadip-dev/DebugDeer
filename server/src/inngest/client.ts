import { Inngest } from 'inngest';
import { db } from '../db';
import { and, eq } from 'drizzle-orm';
import { account } from '../db/schema';
import { getRepoFileContents } from '../lib/github';
import { indexCodebase } from '../lib/rag';

export const inngest = new Inngest({ id: 'debug-deer' });

const indexRepo = inngest.createFunction(
  { id: 'index-repo' },
  { event: 'repository.connected' },
  async ({ event, step }) => {
    const { owner, repo, userId } = event.data;
    // step 1: fetch all the files from the repository
    const files = await step.run('fetch-files', async () => {
      const findAccount = await db.query.account.findFirst({
        where: and(eq(account.userId, userId), eq(account.providerId, 'github')),
      });
      if (!findAccount?.accessToken) {
        throw new Error('No GitHub access token found');
      }

      return await getRepoFileContents(findAccount.accessToken, owner, repo);
    });
    // step 2:
    await step.run('index-codebase', async () => {
      await indexCodebase(`${owner}/${repo}`, files);
    });
    return { success: true, indexedFiles: files.length };
  }
);

export const functions = [indexRepo];
