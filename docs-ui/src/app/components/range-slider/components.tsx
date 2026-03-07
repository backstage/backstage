'use client';

import { RangeSlider } from '../../../../../packages/ui/src/components/RangeSlider/RangeSlider';

export const Default = () => {
  return (
    <RangeSlider
      label="Price Range"
      minValue={0}
      maxValue={1000}
      defaultValue={[200, 800]}
      showValueLabel
    />
  );
};

export const WithCustomRange = () => {
  return (
    <RangeSlider
      label="Temperature (°C)"
      minValue={-20}
      maxValue={40}
      defaultValue={[0, 20]}
      step={5}
      showValueLabel
    />
  );
};

export const WithFormattedValues = () => {
  return (
    <RangeSlider
      label="Budget"
      minValue={0}
      maxValue={10000}
      defaultValue={[2000, 8000]}
      step={100}
      showValueLabel
      formatValue={(value: number) => `$${value.toLocaleString()}`}
    />
  );
};

export const WithDescription = () => {
  return (
    <RangeSlider
      label="Age Range"
      description="Select the age range for your target audience"
      minValue={0}
      maxValue={100}
      defaultValue={[18, 65]}
      showValueLabel
    />
  );
};

export const Required = () => {
  return (
    <RangeSlider
      label="Score Range"
      minValue={0}
      maxValue={100}
      defaultValue={[20, 80]}
      isRequired
      showValueLabel
    />
  );
};

export const Disabled = () => {
  return (
    <RangeSlider
      label="Disabled Range"
      minValue={0}
      maxValue={100}
      defaultValue={[30, 70]}
      isDisabled
      showValueLabel
    />
  );
};
