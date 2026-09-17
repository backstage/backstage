export const snippetUsage = `import { Slider } from '@backstage/ui';

<Slider
  label="My Range"
  minValue={0}
  maxValue={100}
  defaultValue={[25, 75]}
/>`;

export const singleValueSnippet = `<Slider
  label="Volume"
  minValue={0}
  maxValue={100}
  defaultValue={50}
/>`;

export const defaultSnippet = `<Slider
  label="Price Range"
  minValue={0}
  maxValue={1000}
  defaultValue={[200, 800]}
/>`;

export const withCustomRangeSnippet = `<Slider
  label="Temperature (°C)"
  minValue={-20}
  maxValue={40}
  defaultValue={[0, 20]}
  step={5}
/>`;

export const withFormattedValuesSnippet = `<Slider
  label="Budget"
  minValue={0}
  maxValue={10000}
  defaultValue={[2000, 8000]}
  step={100}
  formatOptions={{
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }}
/>`;

export const withDescriptionSnippet = `<Slider
  label="Age Range"
  description="Select the age range for your target audience"
  minValue={0}
  maxValue={100}
  defaultValue={[18, 65]}
/>`;

export const requiredSnippet = `<Slider
  label="Score Range"
  minValue={0}
  maxValue={100}
  defaultValue={[20, 80]}
  isRequired
/>`;

export const disabledSnippet = `<Slider
  label="Disabled Range"
  minValue={0}
  maxValue={100}
  defaultValue={[30, 70]}
  isDisabled
/>`;
