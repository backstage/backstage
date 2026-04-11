import type { EvalTask } from '../types';
import { callLlm } from './llm';
import { getDocumentation } from './mcp-client';

/**
 * MCP mode: before calling the LLM, fetches real component documentation
 * from the Storybook MCP server and injects it into the system prompt.
 * This simulates an agent that has access to the backstage-ui-mcp MCP server.
 *
 * Returns both the generated code and the list of component docs fetched.
 */
export async function runWithMcp(
  task: EvalTask,
): Promise<{ code: string; docsUsed: string[] }> {
  // Fetch documentation for each relevant component in parallel
  const docEntries = await Promise.allSettled(
    task.relevantComponents.map(async component => {
      const doc = await getDocumentation(component);
      return { component, doc };
    }),
  );

  const successfulDocs: Array<{ component: string; doc: string }> = [];
  for (const entry of docEntries) {
    if (entry.status === 'fulfilled') {
      successfulDocs.push(entry.value);
    }
  }

  const docsUsed = successfulDocs.map(d => d.component);

  const componentDocsSection = successfulDocs
    .map(({ component, doc }) => `## ${component}\n\n${doc}`)
    .join('\n\n---\n\n');

  const systemPrompt = `You are an expert React developer working on a Backstage developer portal.
Your job is to generate clean, idiomatic TypeScript React (TSX) components.
Always import components from "@backstage/ui".
Return only the TSX code block, no explanation or markdown outside the code fence.

You have access to the following @backstage/ui component documentation fetched from the Storybook MCP server.
Use ONLY the props and patterns documented below — never invent or assume undocumented props.

<component-documentation>
${componentDocsSection}
</component-documentation>`;

  const code = await callLlm(systemPrompt, task.prompt);
  return { code, docsUsed };
}
