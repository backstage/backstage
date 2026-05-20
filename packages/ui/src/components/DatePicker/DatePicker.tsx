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
import { DatePicker as AriaDatePicker } from 'react-aria-components';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import { Popover } from '../Popover';
import { DatePickerGroup } from './DatePickerGroup';
import { DatePickerCalendar } from './DatePickerCalendar';
import { useDefinition } from '../../hooks/useDefinition';
import { DatePickerDefinition } from './definition';
import type { DatePickerProps } from './types';

/**
 * A date picker that combines a date field and a calendar popover, allowing
 * users to enter or select a date with full keyboard and screen reader
 * accessibility.
 *
 * @public
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (props, ref) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      DatePickerDefinition,
      props,
    );

    const { classes, label, description, secondaryLabel } = ownProps;

    const ariaLabel = restProps['aria-label'];
    const ariaLabelledBy = restProps['aria-labelledby'];

    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          'DatePicker requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, ariaLabel, ariaLabelledBy]);

    const secondaryLabelText =
      secondaryLabel || (restProps.isRequired ? 'Required' : null);

    return (
      <AriaDatePicker
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
        <DatePickerGroup dataSize={dataAttributes['data-size']} />
        <FieldError />
        <Popover hideArrow>
          <DatePickerCalendar />
        </Popover>
      </AriaDatePicker>
    );
  },
);

DatePicker.displayName = 'DatePicker';
