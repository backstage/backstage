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
import type { DatePickerOwnProps } from './types';
import styles from './DatePicker.module.css';

/**
 * Component definition for DatePicker
 * @public
 */
export const DatePickerDefinition = defineComponent<DatePickerOwnProps>()({
  styles,
  classNames: {
    root: 'bui-DatePicker',
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
 * Component definition for DatePickerGroup
 * @public
 */
export const DatePickerGroupDefinition = defineComponent<
  Record<string, never>
>()({
  styles,
  classNames: {
    root: 'bui-DatePickerGroup',
    dateInput: 'bui-DatePickerDateInput',
    segment: 'bui-DatePickerSegment',
    button: 'bui-DatePickerButton',
  },
  bg: 'consumer',
  propDefs: {},
});

/**
 * Component definition for DatePickerCalendar
 * @public
 */
export const DatePickerCalendarDefinition = defineComponent<
  Record<string, never>
>()({
  styles,
  classNames: {
    root: 'bui-DatePickerCalendar',
    header: 'bui-DatePickerCalendarHeader',
    heading: 'bui-DatePickerCalendarHeading',
    navButton: 'bui-DatePickerCalendarNavButton',
    grid: 'bui-DatePickerCalendarGrid',
    gridHeader: 'bui-DatePickerCalendarGridHeader',
    headerCell: 'bui-DatePickerCalendarHeaderCell',
    gridBody: 'bui-DatePickerCalendarGridBody',
    cell: 'bui-DatePickerCalendarCell',
  },
  propDefs: {},
});
