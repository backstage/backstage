export const snippetUsage = `import { RangeSlider } from '@backstage/ui';

<RangeSlider
  label="My Range"
  minValue={0}
  maxValue={100}
  defaultValue={[25, 75]}
/>`;

export const defaultSnippet = `<RangeSlider
  label="Price Range"
  minValue={0}
  maxValue={1000}
  defaultValue={[200, 800]}
  showValueLabel
/>`;

export const withCustomRangeSnippet = `<RangeSlider
  label="Temperature (°C)"
  minValue={-20}
  maxValue={40}
  defaultValue={[0, 20]}
  step={5}
  showValueLabel
/>`;

export const withFormattedValuesSnippet = `<RangeSlider
  label="Budget"
  minValue={0}
  maxValue={10000}
  defaultValue={[2000, 8000]}
  step={100}
  showValueLabel
  formatValue={(value: number) => \`$\${value.toLocaleString()}\`}
/>`;

export const withDescriptionSnippet = `<RangeSlider
  label="Age Range"
  description="Select the age range for your target audience"
  minValue={0}
  maxValue={100}
  defaultValue={[18, 65]}
  showValueLabel
/>`;

export const requiredSnippet = `<RangeSlider
  label="Score Range"
  minValue={0}
  maxValue={100}
  defaultValue={[20, 80]}
  isRequired
  showValueLabel
/>`;

export const disabledSnippet = `<RangeSlider
  label="Disabled Range"
  minValue={0}
  maxValue={100}
  defaultValue={[30, 70]}
  isDisabled
  showValueLabel
/>`;
