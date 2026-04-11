import { config } from '../config';

let mcpRequestId = 1;

interface McpResponse<T = unknown> {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: { code: number; message: string };
}

async function mcpCall<T>(method: string, params: object = {}): Promise<T> {
  const id = mcpRequestId++;
  const response = await fetch(config.mcpUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  });

  if (!response.ok) {
    throw new Error(`MCP HTTP error ${response.status} calling ${method}`);
  }

  const data = (await response.json()) as McpResponse<T>;
  if (data.error) {
    throw new Error(`MCP error ${data.error.code}: ${data.error.message}`);
  }
  return data.result as T;
}

interface ToolCallResult {
  content: Array<{ type: string; text: string }>;
}

async function callTool(
  name: string,
  toolArguments: Record<string, unknown> = {},
): Promise<string> {
  const result = await mcpCall<ToolCallResult>('tools/call', {
    name,
    arguments: toolArguments,
  });
  return result.content
    .filter(c => c.type === 'text')
    .map(c => c.text)
    .join('\n');
}

/** Fetches the documentation index from the MCP server. */
export async function listAllDocumentation(): Promise<string> {
  return callTool('list-all-documentation');
}

/** Fetches detailed documentation for a specific component by name. */
export async function getDocumentation(componentName: string): Promise<string> {
  return callTool('get-documentation', { component: componentName });
}

/** Checks whether the Storybook MCP server is reachable. */
export async function isMcpReachable(): Promise<boolean> {
  try {
    await mcpCall('tools/list');
    return true;
  } catch {
    return false;
  }
}
