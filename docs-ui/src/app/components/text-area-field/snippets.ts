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

export const scrollingSnippet = `<TextAreaField
  name="message"
  label="Message"
  rows={3}
  defaultValue={Array.from(
    { length: 12 },
    (_, i) => \`Line \${i + 1}: this content scrolls within a fixed height.\`,
  ).join('\\n')}
/>`;

export const showErrorSnippet = `<Form validationErrors={{ message: 'Message is required' }}>
  <TextAreaField
    name="message"
    placeholder="Enter a message"
    label="Message"
  />
</Form>`;
