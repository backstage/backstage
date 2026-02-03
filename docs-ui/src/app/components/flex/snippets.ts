export const flexUsageSnippet = `import { Flex } from '@backstage/ui';

<Flex gap="4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>`;

export const defaultSnippet = `<Flex gap="4">
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
</Flex>`;

export const flexDirectionSnippet = `<Flex direction="column" gap="2">
  <DecorativeBox>First</DecorativeBox>
  <DecorativeBox>Second</DecorativeBox>
  <DecorativeBox>Third</DecorativeBox>
</Flex>`;

export const flexResponsiveSnippet = `<Flex gap={{ initial: '2', md: '4' }}>
  <DecorativeBox>1</DecorativeBox>
  <DecorativeBox>2</DecorativeBox>
  <DecorativeBox>3</DecorativeBox>
</Flex>`;

export const flexAlignSnippet = `<Flex align="center" justify="between" gap="4">
  <DecorativeBox>Start</DecorativeBox>
  <DecorativeBox>Middle</DecorativeBox>
  <DecorativeBox>End</DecorativeBox>
</Flex>`;
