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

import { forwardRef, useEffect, useState } from 'react';
import {
  Input,
  TextField as AriaTextField,
  Button as RAButton,
} from 'react-aria-components';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';

import type { PasswordFieldProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { PasswordFieldDefinition } from './definition';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';

/** @public */
export const PasswordField = forwardRef<HTMLDivElement, PasswordFieldProps>(
  (props, ref) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      PasswordFieldDefinition,
      props,
    );
    const { classes, label, icon, secondaryLabel, placeholder, description } =
      ownProps;

    useEffect(() => {
      if (!label && !restProps['aria-label'] && !restProps['aria-labelledby']) {
        console.warn(
          'PasswordField requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, restProps['aria-label'], restProps['aria-labelledby']]);

    // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
    const secondaryLabelText =
      secondaryLabel || (restProps.isRequired ? 'Required' : null);

    // Manage secret visibility toggle
    const [isVisible, setIsVisible] = useState(false);

    return (
      <AriaTextField
        className={classes.root}
        {...dataAttributes}
        type="password"
        {...restProps}
        ref={ref}
      >
        <FieldLabel
          label={label}
          secondaryLabel={secondaryLabelText}
          description={description}
        />
        <div
          className={classes.inputWrapper}
          data-size={dataAttributes['data-size']}
        >
          {icon && (
            <div
              className={classes.inputIcon}
              data-size={dataAttributes['data-size']}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <Input
            className={classes.input}
            {...(icon && { 'data-icon': true })}
            placeholder={placeholder}
            type={isVisible ? 'text' : 'password'}
          />
          <RAButton
            data-size={dataAttributes['data-size']}
            data-variant={'tertiary'}
            aria-label={isVisible ? 'Hide value' : 'Show value'}
            aria-controls={isVisible ? 'text' : 'password'}
            aria-expanded={isVisible}
            onPress={() => setIsVisible(v => !v)}
            className={classes.inputVisibility}
          >
            {isVisible ? <RiEyeLine /> : <RiEyeOffLine />}
          </RAButton>
        </div>
        <FieldError />
      </AriaTextField>
    );
  },
);

PasswordField.displayName = 'PasswordField';
