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

import React, { forwardRef } from 'react';
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
      name,
      error,
      required,
      disabled,
      ...rest
    } = props;

    // Get the responsive value for the variant
    const responsiveSize = useResponsiveValue(size);

    // Generate unique IDs for accessibility
    const inputId = `textfield-${name}`;
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;

    return (
      <div
        className={clsx('canon-TextField', className)}
        ref={ref}
        role="group"
        aria-labelledby={label ? inputId : undefined}
        aria-describedby={clsx({
          [descriptionId]: description,
          [errorId]: error,
        })}
      >
        {label && (
          <label
            className="canon-TextField--label"
            htmlFor={inputId}
            id={inputId}
          >
            {label}
            {required && (
              <span aria-hidden="true" className="canon-TextField--required">
                *
              </span>
            )}
          </label>
        )}
        <Input
          id={inputId}
          type={name}
          className={clsx('canon-TextField--input', {
            'canon-TextField--input-size-small': responsiveSize === 'small',
            'canon-TextField--input-size-medium': responsiveSize === 'medium',
          })}
          data-invalid={error}
          {...rest}
        />
        {description && (
          <p className="canon-TextField--description" id={descriptionId}>
            {description}
          </p>
        )}
        {error && (
          <p className="canon-TextField--error" id={errorId} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
