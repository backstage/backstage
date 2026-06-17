export const containerUsageSnippet = `import { Container } from "@backstage/ui";

<Container>
  {/* Your plugin's main content */}
</Container>`;

export const defaultSnippet = `<Container>
  <DecorativeBox>Page content goes here</DecorativeBox>
</Container>`;

export const containerResponsiveSnippet = `<Container py={{ initial: '4', md: '8' }}>
  <DecorativeBox>Content with vertical spacing</DecorativeBox>
</Container>`;
