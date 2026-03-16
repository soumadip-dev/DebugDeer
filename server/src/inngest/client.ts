import { Inngest } from 'inngest';
import { db } from '../db';
import { and, eq } from 'drizzle-orm';
import { account, repository, review } from '../db/schema';
import { getPullRequestDiff, getRepoFileContents, postReviewComment } from '../lib/github';
import { indexCodebase, retrieveContext } from '../lib/rag';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export const inngest = new Inngest({ id: 'debug-deer' });

//* Indexes a repository.
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

//* Generates a review for a pull request.
const generateReview = inngest.createFunction(
  { id: 'generate-review', concurrency: 5 },
  { event: 'pr.review.requested' },
  async ({ event, step }) => {
    const { owner, repo, prNumber, userId } = event.data;

    const { diff, title, description, token } = await step.run('fetch-pr-data', async () => {
      const accountData = await db.query.account.findFirst({
        where: and(eq(account.userId, userId), eq(account.providerId, 'github')),
      });
      if (!accountData?.accessToken) {
        throw new Error('No GitHub access token found');
      }
      const data = await getPullRequestDiff(accountData.accessToken, owner, repo, prNumber);
      return { ...data, token: accountData.accessToken };
    });

    const context = await step.run('retrieve-context', async () => {
      const query = `${title}\n${description}`;
      return await retrieveContext(query, `${owner}/${repo}`);
    });

    const reviewText = await step.run('generate-ai-review', async () => {
      const prompt = `You are an expert code reviewer with deep expertise across multiple programming languages, frameworks, and architectural patterns. Your reviews are thorough, constructive, and actionable - balancing technical precision with clear communication.

## Pull Request Context
**Title:** ${title}
**Description:** ${description || '_No description provided_'}

## Repository Context
The following files provide context about the codebase structure and related code:
${context.join('\n\n')}

## Changes to Review
\`\`\`diff
${diff}
\`\`\`

## Review Guidelines
Analyze this PR as if you're conducting a professional code review for a team. Your response must follow this structure exactly:

### 1. 🧭 Overview
Begin with a high-level summary (2-3 sentences) explaining what this PR accomplishes and its significance to the codebase.

### 2. 📁 File-by-File Analysis
For each modified file:
- **File:** \`path/to/file.ext\`
- **Changes:** What changed and why it matters
- **Key observations:** Design patterns, potential impacts, or notable implementation details
- **Concerns:** Any issues specific to this file (if none, state "No issues detected")

### 3. 🔄 Visual Architecture
**Analyze the changes and select the MOST appropriate diagram type based on what the PR modifies:**

#### Choose ONE diagram type that best represents the changes:

| If changes involve... | Use this diagram |
|----------------------|------------------|
| API calls, event handlers, service interactions, function chains | **Sequence Diagram** - Show interaction flow between components |
| Business logic, validation flows, conditional branches, decision trees | **Flowchart** - Illustrate logic paths and decisions |
| Class hierarchies, interfaces, OOP design patterns | **Class Diagram** - Show relationships, inheritance, composition |
| State machines, status transitions, workflow stages | **State Diagram** - Visualize state changes and transitions |
| Database schemas, models, relationships | **Entity Relationship Diagram** - Show data structure and relations |
| Component architecture, module dependencies | **Component Diagram** - Illustrate system structure and dependencies |

**For the selected diagram type:**
- Use **Mermaid.js** syntax inside \`\`\`mermaid\`\`\` blocks
- Keep participant/entity names alphanumeric (no spaces, quotes, or special chars)
- Focus ONLY on the new/modified flow - avoid showing unchanged parts
- Limit to 5-7 key elements for clarity
- Add brief notes only when necessary, using plain text

\`\`\`mermaid
[Your diagram here - choose the appropriate type based on changes]
\`\`\`

If the changes are trivial, purely cosmetic, or don't involve any logical flow: *"No diagram needed for these changes."*

### 4. ✅ What's Working Well
List specific strengths (3-5 bullet points) about this PR:
- Clean code practices
- Good architectural decisions
- Proper error handling
- Test coverage
- Performance considerations
- Security measures implemented
Be specific with examples from the code.

### 5. 🔍 Issues & Concerns
For each issue found, provide:

**Issue #[N]: [Brief Title]**
- **Severity:** 🔴 Critical / 🟠 High / 🟡 Medium / 🔵 Low
- **Location:** File:line (if applicable)
- **Problem:** Clear description of the issue
- **Why it matters:** Potential impact on functionality, security, or maintainability
- **Suggested fix:** Brief guidance on how to address it

Cover these aspects:
- Logic errors and edge cases
- Security vulnerabilities (OWASP Top 10, input validation, auth issues)
- Performance bottlenecks
- Error handling gaps
- Type safety issues
- Code maintainability and readability
- Testing gaps
- Documentation needs
- Accessibility concerns (for UI changes)

### 6. 💡 Improvement Opportunities
For non-critical enhancements, provide:

**Suggestion: [Improvement Description]**
- **Current code:**
  \`\`\`[language]
  [existing code snippet]
  \`\`\`
- **Improved version:**
  \`\`\`[language]
  [refactored code]
  \`\`\`
- **Benefit:** How this improves readability, performance, maintainability, etc.

### 7. 📚 Testing & Documentation
- **Test coverage assessment:** Are changes adequately tested? Missing test cases?
- **Documentation review:** Are comments, README, or API docs updated appropriately?

### 8. 🎭 Final Verse
End with a creative, relevant poem (4-6 lines) that playfully summarizes the changes or offers encouragement.

---
**Review Guidelines:**
- Be specific and reference actual code
- Prioritize issues (critical/high first)
- Maintain a constructive, educational tone
- Focus on the code, not the author
- Suggest solutions, not just problems
- Consider the broader system impact
- Acknowledge good work genuinely
- **Choose diagrams intelligently** - match the type to what the PR changes

Remember: Your review should help the author improve both this code and their future contributions.`;

      const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        prompt,
      });
      return text;
    });

    await step.run('post-comment', async () => {
      await postReviewComment(token, owner, repo, prNumber, reviewText);
    });

    await step.run('save-review', async () => {
      const repoData = await db.query.repository.findFirst({
        where: eq(repository.fullName, `${owner}/${repo}`),
      });

      if (!repoData) {
        throw new Error(`Repository ${owner}/${repo} not found in database.`);
      }

      await db.insert(review).values({
        repositoryId: repoData.id,
        prNumber,
        prTitle: title,
        prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
        review: reviewText,
        status: 'completed',
      });
    });

    return { success: true };
  }
);
export const functions = [indexRepo, generateReview];
