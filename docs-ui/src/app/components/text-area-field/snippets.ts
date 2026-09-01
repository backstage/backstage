export const textAreaFieldUsageSnippet = `import { TextAreaField } from '@backstage/ui';

<TextAreaField label="Message" />`;

export const withLabelSnippet = `<TextAreaField
  name="message"
  placeholder="Enter a message"
  label="Message"
/>`;

export const sizesSnippet = `<Flex direction="column" gap="4">
  <TextAreaField size="small" label="Small" placeholder="Enter a message" />
  <TextAreaField size="medium" label="Medium" placeholder="Enter a message" />
</Flex>`;

export const withDescriptionSnippet = `<TextAreaField
  name="message"
  placeholder="Enter a message"
  label="Message"
  description="Share as much detail as you like."
/>`;
