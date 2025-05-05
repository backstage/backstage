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

import { useId, forwardRef } from 'react';
import { Input } from '@base-ui-components/react/input';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';
import clsx from 'clsx';

import type { TextFieldProps } from './types';

/** @public */
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  (props: TextFieldProps, ref) => {
    const {
      className,
      size = 'medium',
      label,
      description,
      error,
      required,
      style,
      disabled,
      ...rest
    } = props;

    // Get the responsive value for the variant
    const responsiveSize = useResponsiveValue(size);

    // Generate unique IDs for accessibility
    const inputId = useId();
    const descriptionId = useId();
    const errorId = useId();

    return (
      <div
        className={clsx('canon-TextField', className)}
        style={style}
        ref={ref}
      >
        {label && (
          <label
            className="canon-TextFieldLabel"
            htmlFor={inputId}
            data-disabled={disabled}
          >
            {label}
            {required && (
              <span aria-hidden="true" className="canon-TextFieldRequired">
                (Required)
              </span>
            )}
          </label>
        )}
        <Input
          id={inputId}
          className="canon-TextFieldInput"
          data-size={responsiveSize}
          aria-labelledby={label ? inputId : undefined}
          aria-describedby={clsx({
            [descriptionId]: description,
            [errorId]: error,
          })}
          data-invalid={error}
          required={required}
          disabled={disabled}
          {...rest}
        />
        {description && (
          <p className="canon-TextFieldDescription" id={descriptionId}>
            {description}
          </p>
        )}
        {error && (
          <p className="canon-TextFieldError" id={errorId} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
