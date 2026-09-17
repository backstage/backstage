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

import { defineComponent } from '../../hooks/useDefinition';
import type { DateRangePickerOwnProps } from './types';
import styles from './DateRangePicker.module.css';

/**
 * Component definition for DateRangePicker
 * @public
 */
export const DateRangePickerDefinition =
  defineComponent<DateRangePickerOwnProps>()({
    styles,
    classNames: {
      root: 'bui-DateRangePicker',
    },
    propDefs: {
      size: { dataAttribute: true, default: 'small' },
      className: {},
      label: {},
      description: {},
      secondaryLabel: {},
    },
  });

/**
 * Component definition for DateRangePickerGroup
 * @internal
 */
export const DateRangePickerGroupDefinition = defineComponent<
  Record<string, never>
>()({
  styles,
  classNames: {
    root: 'bui-DateRangePickerGroup',
    dateFields: 'bui-DateRangePickerDateFields',
    dateInput: 'bui-DateRangePickerDateInput',
    segment: 'bui-DateRangePickerSegment',
    separator: 'bui-DateRangePickerSeparator',
    button: 'bui-DateRangePickerButton',
  },
  bg: 'consumer',
  propDefs: {},
});

/**
 * Component definition for DateRangePickerCalendar
 * @internal
 */
export const DateRangePickerCalendarDefinition = defineComponent<
  Record<string, never>
>()({
  styles,
  classNames: {
    root: 'bui-DateRangePickerCalendar',
    header: 'bui-DateRangePickerCalendarHeader',
    heading: 'bui-DateRangePickerCalendarHeading',
    navButton: 'bui-DateRangePickerCalendarNavButton',
    grid: 'bui-DateRangePickerCalendarGrid',
    gridHeader: 'bui-DateRangePickerCalendarGridHeader',
    headerCell: 'bui-DateRangePickerCalendarHeaderCell',
    gridBody: 'bui-DateRangePickerCalendarGridBody',
    cell: 'bui-DateRangePickerCalendarCell',
  },
  propDefs: {},
});
