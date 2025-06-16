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
  Label,
  FieldError,
} from 'react-aria-components';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';
import clsx from 'clsx';

import type { FormInputProps } from './types';

/** @public */
export const TextField = forwardRef<HTMLDivElement, FormInputProps>(
  (props: FormInputProps, ref) => {
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
          'If you do not provide a visible label, you must specify an aria-label or aria-labelledby attribute for accessibility',
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
        {...rest}
        ref={ref}
      >
        {label && (
          <div className="canon-TextFieldLabelWrapper">
            {label && (
              <Label className="canon-TextFieldLabel">
                {label}
                {secondaryLabelText && (
                  <span
                    aria-hidden="true"
                    className="canon-TextFieldSecondaryLabel"
                  >
                    ({secondaryLabelText})
                  </span>
                )}
              </Label>
            )}
            {description && (
              <div className="canon-TextFieldDescription">{description}</div>
            )}
          </div>
        )}
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
