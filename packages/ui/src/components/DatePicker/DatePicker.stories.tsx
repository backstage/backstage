/*
 * Copyright 2025 The Backstage Authors
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
import { DatePicker } from './DatePicker';
import {
  parseDate,
  today,
  getLocalTimeZone,
  isWeekend,
} from '@internationalized/date';
import { useLocale, Form } from 'react-aria-components';
import { Button } from '../Button';

const meta = preview.meta({
  title: 'Backstage UI/DatePicker',
  component: DatePicker,
  args: {
    style: { width: 280 },
  },
});

export const Default = meta.story({
  args: {},
});

export const WithLabel = meta.story({
  args: {
    label: 'Date',
  },
});

export const WithDescription = meta.story({
  args: {
    label: 'Date',
    description: 'Select the date of your event.',
  },
});

export const WithDefaultValue = meta.story({
  args: {
    label: 'Booking date',
    defaultValue: parseDate('2025-02-03'),
  },
});

export const Sizes = meta.story({
  args: {
    label: 'Date',
  },
  render: args => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: 280,
      }}
    >
      <DatePicker {...args} size="small" label="Small" />
      <DatePicker {...args} size="medium" label="Medium" />
    </div>
  ),
});

export const Required = meta.story({
  args: {
    label: 'Trip date',
    isRequired: true,
  },
  render: args => (
    <Form
      onSubmit={e => {
        e.preventDefault();
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: 280,
      }}
    >
      <DatePicker {...args} />
      <Button type="submit">Submit</Button>
    </Form>
  ),
});

export const Disabled = meta.story({
  args: {
    label: 'Date',
    isDisabled: true,
    defaultValue: parseDate('2025-03-01'),
  },
});

export const Invalid = meta.story({
  args: {
    label: 'Date',
    isInvalid: true,
    errorMessage: 'The selected date is not available.',
    defaultValue: parseDate('2025-04-01'),
  },
});

export const WithMinMaxValue = meta.story({
  args: {
    label: 'Date',
    description: 'You can only select dates within the next 30 days.',
    minValue: today(getLocalTimeZone()),
    maxValue: today(getLocalTimeZone()).add({ days: 30 }),
  },
});

/**
 * Weekends are marked unavailable and cannot be selected.
 */
export const WithUnavailableDates = meta.story({
  render: args => {
    const { locale } = useLocale();
    return (
      <DatePicker
        {...args}
        label="Working days only"
        description="Weekends are unavailable."
        isDateUnavailable={date => isWeekend(date, locale)}
      />
    );
  },
});
