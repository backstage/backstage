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

import { Field } from '@base-ui-components/react/field';
import { forwardRef } from 'react';
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
      leftElementProps,
      rightElementProps,
      ...rest
    } = props;

    // Get the responsive value for the variant
    const responsiveSize = useResponsiveValue(size);

    return (
      <Field.Root
        className={clsx('canon-TextField', className)}
        disabled={disabled}
        invalid={!!error}
        style={style}
        ref={ref}
      >
        {label && (
          <Field.Label className="canon-TextFieldLabel">
            {label}
            {required && (
              <span aria-hidden="true" className="canon-TextFieldRequired">
                (Required)
              </span>
            )}
          </Field.Label>
        )}
        <div className="canon-TextFieldInputWrapper" data-size={responsiveSize}>
          {leftElementProps ? (
            <div
              {...leftElementProps}
              className={clsx(
                'canon-TextFieldInputLeftElement',
                leftElementProps.className,
              )}
            />
          ) : null}
          <Field.Control
            className="canon-TextFieldInput"
            required={required}
            {...rest}
          />
          {rightElementProps ? (
            <div
              {...rightElementProps}
              className={clsx(
                'canon-TextFieldInputRightElement',
                rightElementProps.className,
              )}
            />
          ) : null}
        </div>
        {description && (
          <Field.Description className="canon-TextFieldDescription">
            {description}
          </Field.Description>
        )}
        {error && (
          <Field.Error className="canon-TextFieldError" role="alert" forceShow>
            {error}
          </Field.Error>
        )}
      </Field.Root>
    );
  },
);

TextField.displayName = 'TextField';
