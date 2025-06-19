/*
 * Copyright 2024 The Backstage Authors
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
import {
  Input,
  TextField as AriaTextField,
  FieldError,
} from 'react-aria-components';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';
import clsx from 'clsx';
import { FieldLabel } from '../FieldLabel';

import type { TextFieldProps } from './types';

/** @public */
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  (props, ref) => {
    const {
      className,
      icon,
      size = 'small',
      label,
      secondaryLabel,
      description,
      isRequired,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    } = props;

    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          'TextField requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, ariaLabel, ariaLabelledBy]);

    // Get the responsive value for the variant
    const responsiveSize = useResponsiveValue(size);

    // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
    const secondaryLabelText =
      secondaryLabel || (isRequired ? 'Required' : null);

    return (
      <AriaTextField
        className={clsx('canon-TextField', className)}
        data-size={responsiveSize}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...rest}
        ref={ref}
      >
        <FieldLabel
          label={label}
          secondaryLabel={secondaryLabelText}
          description={description}
        />
        <div className="canon-TextFieldInputWrapper" data-size={responsiveSize}>
          {icon && (
            <div
              className="canon-TextFieldIcon"
              data-size={responsiveSize}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <Input
            className="canon-TextFieldInput"
            {...(icon && { 'data-icon': true })}
          />
        </div>
        <FieldError className="canon-TextFieldError" />
      </AriaTextField>
    );
  },
);

TextField.displayName = 'TextField';
