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
import { Input, TextField as AriaTextField } from 'react-aria-components';
import clsx from 'clsx';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';

import type { TextFieldProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { Icon } from '../Icon';
import { ButtonIcon } from '../ButtonIcon';

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
      enableVisibility,
      isClearable,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      placeholder,
      ...rest
    } = props;

    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          'TextField requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, ariaLabel, ariaLabelledBy]);

    const { classNames, dataAttributes } = useStyles('TextField', {
      size,
    });

    // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
    const secondaryLabelText =
      secondaryLabel || (isRequired ? 'Required' : null);

    // Manage value for clearable behavior, supporting both controlled and uncontrolled usage
    const {
      value: controlledValue,
      defaultValue,
      onChange,
      isDisabled,
    } = rest as any;
    const [uncontrolledValue, setUncontrolledValue] = useState<string>(
      defaultValue ?? '',
    );
    const effectiveValue =
      controlledValue !== undefined ? controlledValue : uncontrolledValue;
    const handleChange = (value: string) => {
      if (controlledValue === undefined) setUncontrolledValue(value);
      onChange?.(value);
    };

    // Manage secret visibility toggle
    const [isVisible, setIsVisible] = useState(false);
    const showClear = Boolean(
      isClearable && effectiveValue && effectiveValue.length > 0,
    );
    const showSecretToggle = Boolean(enableVisibility);

    return (
      <AriaTextField
        className={clsx(classNames.root, className)}
        {...dataAttributes}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...rest}
        value={effectiveValue}
        onChange={handleChange}
        ref={ref}
      >
        <FieldLabel
          label={label}
          secondaryLabel={secondaryLabelText}
          description={description}
        />
        <div
          className={classNames.inputWrapper}
          data-size={dataAttributes['data-size']}
        >
          {icon && (
            <div
              className={classNames.inputIcon}
              data-size={dataAttributes['data-size']}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          {(showClear || showSecretToggle) && (
            <div className={classNames.inputAction}>
              {showSecretToggle && (
                <ButtonIcon
                  data-size={dataAttributes['data-size']}
                  aria-label={isVisible ? 'Hide value' : 'Show value'}
                  variant={'tertiary'}
                  isDisabled={isDisabled}
                  onPress={() => setIsVisible(v => !v)}
                  icon={<Icon name={isVisible ? 'eye' : 'eye-off'} />}
                />
              )}
              {showClear && (
                <ButtonIcon
                  data-size={dataAttributes['data-size']}
                  aria-label="Clear input"
                  variant={'tertiary'}
                  isDisabled={isDisabled}
                  onPress={() => {
                    if (controlledValue === undefined) {
                      setUncontrolledValue('');
                    }
                    onChange?.('');
                  }}
                  icon={<Icon name="close" />}
                />
              )}
            </div>
          )}
          <Input
            className={classNames.input}
            {...(icon && { 'data-icon': true })}
            placeholder={placeholder}
            type={
              enableVisibility ? (isVisible ? 'text' : 'password') : undefined
            }
          />
        </div>
        <FieldError />
      </AriaTextField>
    );
  },
);

TextField.displayName = 'TextField';
