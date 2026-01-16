export const textFieldUsageSnippet = `import { TextField } from '@backstage/ui';

<TextField />`;

export const withLabelSnippet = `<TextField
  name="url"
  placeholder="Enter a URL"
  label="Label"
/>`;

export const sizesSnippet = `<Flex direction="row" gap="4">
  <TextField
    name="url"
    placeholder="Enter a URL"
    size="small"
    icon={<RiSparklingLine />}
  />
  <TextField
    name="url"
    placeholder="Enter a URL"
    size="medium"
    icon={<RiSparklingLine />}
  />
</Flex>`;

export const withDescriptionSnippet = `<TextField
  name="url"
  placeholder="Enter a URL"
  label="Label"
  description="Description"
/>`;
