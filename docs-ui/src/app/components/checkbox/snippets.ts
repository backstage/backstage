export const checkboxUsageSnippet = `import { Checkbox } from '@backstage/ui';

<Checkbox>Accept terms</Checkbox>`;

export const defaultSnippet = `<Checkbox>Accept terms and conditions</Checkbox>`;

export const allVariantsSnippet = `<Flex direction="column" gap="2">
  <Checkbox>Unchecked</Checkbox>
  <Checkbox isSelected>Checked</Checkbox>
  <Checkbox isDisabled>Disabled</Checkbox>
  <Checkbox isSelected isDisabled>Checked & Disabled</Checkbox>
</Flex>`;
