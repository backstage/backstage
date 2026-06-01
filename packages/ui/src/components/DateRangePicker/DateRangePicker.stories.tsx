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
import { DateRangePicker } from './DateRangePicker';
import {
  parseDate,
  today,
  getLocalTimeZone,
  isWeekend,
} from '@internationalized/date';
import { useLocale, Form } from 'react-aria-components';
import { Button } from '../Button';

const meta = preview.meta({
  title: 'Backstage UI/DateRangePicker',
  component: DateRangePicker,
  args: {
    style: { width: 360 },
  },
});

export const Default = meta.story({
  args: {},
});

export const WithLabel = meta.story({
  args: {
    label: 'Date range',
  },
});

export const WithDescription = meta.story({
  args: {
    label: 'Date range',
    description: 'Select a start and end date for your event.',
  },
});

export const WithDefaultValue = meta.story({
  args: {
    label: 'Booking period',
    defaultValue: {
      start: parseDate('2025-02-03'),
      end: parseDate('2025-02-14'),
    },
  },
});

export const Sizes = meta.story({
  args: {
    label: 'Date range',
  },
  render: args => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: 360,
      }}
    >
      <DateRangePicker {...args} size="small" label="Small" />
      <DateRangePicker {...args} size="medium" label="Medium" />
    </div>
  ),
});

export const Required = meta.story({
  args: {
    label: 'Trip dates',
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
        width: 360,
      }}
    >
      <DateRangePicker {...args} />
      <Button type="submit">Submit</Button>
    </Form>
  ),
});

export const Disabled = meta.story({
  args: {
    label: 'Date range',
    isDisabled: true,
    defaultValue: {
      start: parseDate('2025-03-01'),
      end: parseDate('2025-03-15'),
    },
  },
});

export const Invalid = meta.story({
  args: {
    label: 'Date range',
    isInvalid: true,
    errorMessage: 'The selected range is not available.',
    defaultValue: {
      start: parseDate('2025-04-01'),
      end: parseDate('2025-04-10'),
    },
  },
});

export const WithMinMaxValue = meta.story({
  args: {
    label: 'Date range',
    description: 'You can only select dates within the next 30 days.',
    minValue: today(getLocalTimeZone()),
    maxValue: today(getLocalTimeZone()).add({ days: 30 }),
  },
});

/**
 * Weekends are marked unavailable. Because `allowsNonContiguousRanges` is not
 * set (defaults to false), the picker prevents the user from selecting any
 * range that spans across an unavailable date — the selection snaps to avoid
 * crossing a weekend.
 */
export const WithUnavailableDates = meta.story({
  render: args => {
    const { locale } = useLocale();
    return (
      <DateRangePicker
        {...args}
        label="Working days only"
        description="Weekends are unavailable. You cannot select a range that spans across them."
        isDateUnavailable={date => isWeekend(date, locale)}
      />
    );
  },
});
