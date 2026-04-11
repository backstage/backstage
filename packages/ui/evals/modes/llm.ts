import { config } from '../config';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
}

/**
 * Calls the Anthropic Messages API via native fetch.
 * Extracts the first code block from the response (TSX generated code).
 */
export async function callLlm(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const messages: Message[] = [{ role: 'user', content: userPrompt }];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.anthropicApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.anthropicModel,
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${body}`);
  }

  const data = (await response.json()) as AnthropicResponse;
  const text = data.content.find(c => c.type === 'text')?.text ?? '';

  // Extract the first TSX/TypeScript code block if present
  const codeMatch = text.match(/```(?:tsx?|jsx?|typescript)?\n([\s\S]*?)```/);
  return codeMatch ? codeMatch[1].trim() : text.trim();
}
