export const numberFieldUsageSnippet = `import { NumberField } from '@backstage/ui';

<NumberField label="Minutes" minValue={0} maxValue={59} step={1} />`;

export const withLabelSnippet = `<NumberField
  name="quantity"
  placeholder="Enter a number"
  label="Label"
/>`;

export const sizesSnippet = `<Flex direction="column" gap="4">
  <NumberField
    size="small"
    name="quantity"
    placeholder="Enter a number"
    icon={<RiTimeLine />}
  />
  <NumberField
    size="medium"
    name="quantity"
    placeholder="Enter a number"
    icon={<RiTimeLine />}
  />
</Flex>`;

export const withDescriptionSnippet = `<NumberField
  name="quantity"
  placeholder="Enter a number"
  label="Label"
  description="Description"
/>`;
