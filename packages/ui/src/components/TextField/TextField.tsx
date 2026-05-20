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

import { forwardRef, useEffect, useState, useCallback } from 'react';
import { Input, TextField as AriaTextField } from 'react-aria-components';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import type { TextFieldProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { TextFieldDefinition } from './definition';

/**
 * A single-line text input with an integrated label, optional icon, and inline error display.
 *
 * @public
 */
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  (props, ref) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      TextFieldDefinition,
      props,
    );
    const {
      classes,
      label,
      icon,
      secondaryLabel,
      placeholder,
      description,
      floatingLabel,
    } = ownProps;

    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
      if (!label && !restProps['aria-label'] && !restProps['aria-labelledby']) {
        console.warn(
          'TextField requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, restProps['aria-label'], restProps['aria-labelledby']]);

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        if (restProps.onFocus) {
          restProps.onFocus(e);
        }
      },
      [restProps],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(e.target.value !== '');
        if (restProps.onBlur) {
          restProps.onBlur(e);
        }
      },
      [restProps],
    );

    const handleChange = useCallback(
      (value: string) => {
        setInputValue(value);
        if (restProps.onChange) {
          restProps.onChange(value);
        }
      },
      [restProps],
    );

    // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
    const secondaryLabelText =
      secondaryLabel || (restProps.isRequired ? 'Required' : null);

    return (
      <AriaTextField
        className={classes.root}
        {...dataAttributes}
        {...restProps}
        onFocus={floatingLabel ? handleFocus : restProps.onFocus}
        onBlur={floatingLabel ? handleBlur : restProps.onBlur}
        onChange={floatingLabel ? handleChange : restProps.onChange}
        ref={ref}
      >
        {!floatingLabel && (
          <FieldLabel
            label={label}
            secondaryLabel={secondaryLabelText}
            description={description}
            descriptionSlot="description"
          />
        )}
        <div
          className={classes.inputWrapper}
          data-size={dataAttributes['data-size']}
          style={
            floatingLabel
              ? {
                  position: 'relative',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }
              : undefined
          }
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
            placeholder={
              floatingLabel
                ? isFocused && !inputValue
                  ? placeholder
                  : ''
                : placeholder
            }
            style={
              floatingLabel
                ? {
                    paddingTop: isFocused || inputValue ? '2px' : '0px',
                    border: 'none !important' as any,
                    boxShadow: 'none !important' as any,
                    backgroundColor: 'transparent !important' as any,
                    width: '100%',
                  }
                : undefined
            }
          />
          {floatingLabel && label && (
            <label
              style={{
                position: 'absolute',
                left: icon ? '40px' : '12px',
                top: isFocused || inputValue ? '-8px' : '50%',
                transform:
                  isFocused || inputValue
                    ? 'translateY(0)'
                    : 'translateY(-50%)',
                fontSize: isFocused || inputValue ? '12px' : '14px',
                color: isFocused ? '#2563eb' : '#6b7280',
                pointerEvents: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                padding: '0 6px',
              }}
            >
              {label}
            </label>
          )}
        </div>
        {!floatingLabel && <FieldError />}
      </AriaTextField>
    );
  },
);

TextField.displayName = 'TextField';
