export const config = {
  storybookUrl: process.env.STORYBOOK_URL ?? 'http://localhost:6006',
  mcpUrl: `${process.env.STORYBOOK_URL ?? 'http://localhost:6006'}/mcp`,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
  anthropicModel: process.env.ANTHROPIC_MODEL ?? 'claude-3-5-sonnet-20241022',
  resultsDir: new URL('./results', import.meta.url).pathname,
};

export function requireApiKey(): void {
  if (!config.anthropicApiKey) {
    console.error(
      'Error: ANTHROPIC_API_KEY environment variable is required.\n' +
        'Usage: ANTHROPIC_API_KEY=sk-ant-... yarn eval:ui',
    );
    process.exit(1);
  }
}
