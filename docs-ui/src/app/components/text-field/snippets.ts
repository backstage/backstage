export const textFieldUsageSnippet = `import { TextField } from '@backstage/ui';

<TextField label="Email" type="email" />`;

export const withLabelSnippet = `<TextField
  name="url"
  placeholder="Enter a URL"
  label="Label"
/>`;

export const sizesSnippet = `<Flex direction="column" gap="4">
  <TextField
    size="small"
    name="url"
    placeholder="Enter a URL"
    icon={<RiSparklingLine />}
  />
  <TextField
    size="medium"
    name="url"
    placeholder="Enter a URL"
    icon={<RiSparklingLine />}
  />
</Flex>`;

export const withDescriptionSnippet = `<TextField
  name="url"
  placeholder="Enter a URL"
  label="Label"
  description="Description"
/>`;
