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

import { forwardRef, useEffect } from 'react';
import { DateRangePicker as AriaDateRangePicker } from 'react-aria-components';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import { Popover } from '../Popover';
import { DateRangePickerGroup } from './DateRangePickerGroup';
import { DateRangePickerCalendar } from './DateRangePickerCalendar';
import { useDefinition } from '../../hooks/useDefinition';
import { DateRangePickerDefinition } from './definition';
import type { DateRangePickerProps } from './types';

/**
 * A date range picker that combines two date fields and a calendar popover,
 * allowing users to enter or select a date range with full keyboard and
 * screen reader accessibility.
 *
 * @public
 */
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  (props, ref) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      DateRangePickerDefinition,
      props,
    );

    const { classes, label, description, secondaryLabel } = ownProps;

    const ariaLabel = restProps['aria-label'];
    const ariaLabelledBy = restProps['aria-labelledby'];

    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          'DateRangePicker requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, ariaLabel, ariaLabelledBy]);

    const secondaryLabelText =
      secondaryLabel || (restProps.isRequired ? 'Required' : null);

    return (
      <AriaDateRangePicker
        className={classes.root}
        {...dataAttributes}
        {...restProps}
        ref={ref}
      >
        <FieldLabel
          label={label}
          secondaryLabel={secondaryLabelText}
          description={description}
          descriptionSlot="description"
        />
        <DateRangePickerGroup dataSize={dataAttributes['data-size']} />
        <FieldError />
        <Popover hideArrow>
          <DateRangePickerCalendar />
        </Popover>
      </AriaDateRangePicker>
    );
  },
);

DateRangePicker.displayName = 'DateRangePicker';
