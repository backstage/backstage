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
import { Slider } from './Slider';

const meta = preview.meta({
  title: 'Backstage UI/Slider',
  component: Slider,
});

export const SingleThumb = meta.story({
  args: {
    label: 'Volume',
    defaultValue: 50,
  },
});

export const SingleThumbWithRange = meta.story({
  args: {
    label: 'Brightness',
    minValue: 0,
    maxValue: 100,
    defaultValue: 75,
    step: 5,
  },
});

export const RangeSlider = meta.story({
  args: {
    label: 'Price Range',
    defaultValue: [25, 75],
  },
});

export const WithCustomRange = meta.story({
  args: {
    label: 'Temperature (°C)',
    minValue: -20,
    maxValue: 40,
    defaultValue: [0, 20],
    step: 5,
  },
});

export const WithFormattedValues = meta.story({
  args: {
    label: 'Budget',
    minValue: 0,
    maxValue: 10000,
    defaultValue: [2000, 8000],
    step: 100,
    formatOptions: {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    },
  },
});

export const WithDescription = meta.story({
  args: {
    label: 'Age Range',
    description: 'Select the age range for your target audience',
    minValue: 0,
    maxValue: 100,
    defaultValue: [18, 65],
  },
});

export const Required = meta.story({
  args: {
    label: 'Score Range',
    defaultValue: [20, 80],
    isRequired: true,
  },
});

export const Disabled = meta.story({
  args: {
    label: 'Disabled Range',
    defaultValue: [30, 70],
    isDisabled: true,
  },
});

export const WithSteps = meta.story({
  args: {
    label: 'Rating',
    minValue: 0,
    maxValue: 5,
    step: 0.5,
    defaultValue: 3.5,
  },
});

export const Percentage = meta.story({
  args: {
    label: 'Completion',
    minValue: 0,
    maxValue: 1,
    step: 0.01,
    defaultValue: 0.65,
    formatOptions: {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  },
});
