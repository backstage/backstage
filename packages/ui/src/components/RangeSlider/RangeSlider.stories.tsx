/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import preview from '../../../../../.storybook/preview';
import { RangeSlider } from './RangeSlider';

const meta = preview.meta({
  title: 'Backstage UI/RangeSlider',
  component: RangeSlider,
});

export const Default = meta.story({
  args: {
    label: 'Price Range',
    defaultValue: [25, 75],
    showValueLabel: true,
  },
});

export const WithCustomRange = meta.story({
  args: {
    label: 'Temperature (°C)',
    minValue: -20,
    maxValue: 40,
    defaultValue: [0, 20],
    step: 5,
    showValueLabel: true,
  },
});

export const WithFormattedValues = meta.story({
  args: {
    label: 'Budget',
    minValue: 0,
    maxValue: 10000,
    defaultValue: [2000, 8000],
    step: 100,
    showValueLabel: true,
    formatValue: (value: number) => `$${value.toLocaleString()}`,
  },
});

export const WithDescription = meta.story({
  args: {
    label: 'Age Range',
    description: 'Select the age range for your target audience',
    minValue: 0,
    maxValue: 100,
    defaultValue: [18, 65],
    showValueLabel: true,
  },
});

export const Required = meta.story({
  args: {
    label: 'Score Range',
    defaultValue: [20, 80],
    isRequired: true,
    showValueLabel: true,
  },
});

export const Disabled = meta.story({
  args: {
    label: 'Disabled Range',
    defaultValue: [30, 70],
    isDisabled: true,
    showValueLabel: true,
  },
});

export const WithSteps = meta.story({
  args: {
    label: 'Rating Range',
    minValue: 0,
    maxValue: 5,
    step: 0.5,
    defaultValue: [1.5, 4],
    showValueLabel: true,
    formatValue: (value: number) => `${value} ★`,
  },
});

export const SmallRange = meta.story({
  args: {
    label: 'Month Range',
    minValue: 1,
    maxValue: 12,
    defaultValue: [3, 9],
    step: 1,
    showValueLabel: true,
    formatValue: (value: number) => {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return months[value - 1] || '';
    },
  },
});
