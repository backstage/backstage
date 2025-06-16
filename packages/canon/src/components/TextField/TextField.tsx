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
import { Icon } from '../Icon';

/** @public */
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  (props: TextFieldProps, ref) => {
    const {
      className,
      size = 'small',
      label,
      labelSize = 'small',
      secondaryLabel,
      description,
      hideLabelAndDescription,
      error,
      required,
      style,
      disabled,
      icon,
      onClear,
      ...rest
    } = props;

    // Get the responsive value for the variant
    const responsiveSize = useResponsiveValue(size);

    // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
    const secondaryLabelText = secondaryLabel || (required ? 'Required' : null);

    return (
      <Field.Root
        className={clsx('canon-TextField', className)}
        disabled={disabled}
        invalid={!!error}
        style={style}
        ref={ref}
      >
        {label && (
          <div
            className="canon-TextFieldLabelWrapper"
            data-hidden={hideLabelAndDescription}
          >
            {label && (
              <Field.Label
                className="canon-TextFieldLabel"
                data-size={labelSize}
              >
                {label}
                {secondaryLabelText && (
                  <span
                    aria-hidden="true"
                    className="canon-TextFieldSecondaryLabel"
                  >
                    ({secondaryLabelText})
                  </span>
                )}
              </Field.Label>
            )}
            {description && (
              <Field.Description
                className="canon-TextFieldDescription"
                data-size={labelSize}
              >
                {description}
              </Field.Description>
            )}
          </div>
        )}
        <div className="canon-TextFieldInputWrapper" data-size={responsiveSize}>
          {icon && (
            <div
              className="canon-TextFieldIcon"
              aria-hidden="true"
              data-size={responsiveSize}
            >
              {icon}
            </div>
          )}
          <Field.Control
            className="canon-TextFieldInput"
            required={required}
            {...rest}
          />
          {onClear && (
            <button
              className="canon-TextFieldClearButton"
              disabled={disabled}
              onClick={onClear}
            >
              <Icon className="canon-TextFieldClearButtonIcon" name="close" />
            </button>
          )}
        </div>
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
