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
import { Input, TextField as AriaTextField } from 'react-aria-components';
import clsx from 'clsx';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import type { TextFieldProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { TextFieldDefinition } from './definition';
import styles from './TextField.module.css';

/** @public */
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  (props, ref) => {
    const {
      label,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    } = props;

    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          'TextField requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, ariaLabel, ariaLabelledBy]);

    const { classNames, dataAttributes, style, cleanedProps } = useStyles(
      TextFieldDefinition,
      {
        size: 'small',
        ...props,
      },
    );

    const {
      className,
      description,
      icon,
      isRequired,
      secondaryLabel,
      placeholder,
      ...rest
    } = cleanedProps;

    // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
    const secondaryLabelText =
      secondaryLabel || (isRequired ? 'Required' : null);

    return (
      <AriaTextField
        className={clsx(classNames.root, styles[classNames.root], className)}
        {...dataAttributes}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        style={style}
        {...rest}
        ref={ref}
      >
        <FieldLabel
          label={label}
          secondaryLabel={secondaryLabelText}
          description={description}
        />
        <div
          className={clsx(
            classNames.inputWrapper,
            styles[classNames.inputWrapper],
          )}
          data-size={dataAttributes['data-size']}
        >
          {icon && (
            <div
              className={clsx(
                classNames.inputIcon,
                styles[classNames.inputIcon],
              )}
              data-size={dataAttributes['data-size']}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <Input
            className={clsx(classNames.input, styles[classNames.input])}
            {...(icon && { 'data-icon': true })}
            placeholder={placeholder}
          />
        </div>
        <FieldError />
      </AriaTextField>
    );
  },
);

TextField.displayName = 'TextField';
