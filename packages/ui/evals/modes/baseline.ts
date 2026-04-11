import type { EvalTask } from '../types';
import { callLlm } from './llm';

const SYSTEM_PROMPT = `You are an expert React developer working on a Backstage developer portal.
Your job is to generate clean, idiomatic TypeScript React (TSX) components.
Always import components from "@backstage/ui".
Return only the TSX code block, no explanation or markdown outside the code fence.`;

/**
 * Baseline mode: calls the LLM with only the task prompt, no component documentation.
 * This simulates an agent that does NOT have access to the Storybook MCP.
 */
export async function runBaseline(task: EvalTask): Promise<string> {
  return callLlm(SYSTEM_PROMPT, task.prompt);
}
