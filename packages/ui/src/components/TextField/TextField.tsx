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

import { forwardRef, useEffect, useState, useCallback, useId } from 'react';
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

    const autoId = useId();
    const inputId = restProps.id || autoId;

    const getInputValue = (value: unknown) =>
      value == null ? '' : String(value);
    const [isFocused, setIsFocused] = useState(false);
    // const [inputValue, setInputValue] = useState('');
    const [inputValue, setInputValue] = useState(() =>
      getInputValue(restProps.value ?? restProps.defaultValue),
    );

    useEffect(() => {
      setInputValue(getInputValue(restProps.value ?? restProps.defaultValue));
    }, [restProps.value, restProps.defaultValue]);

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
      [restProps.onFocus],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (restProps.onBlur) {
          restProps.onBlur(e);
        }
      },
      [restProps.onBlur],
    );

    const handleChange = useCallback(
      (value: string) => {
        setInputValue(value);
        if (restProps.onChange) {
          restProps.onChange(value);
        }
      },
      [restProps.onChange],
    );

    // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
    const secondaryLabelText =
      secondaryLabel || (restProps.isRequired ? 'Required' : null);

    // Determine if the label should float based on focus or input value
    const shouldFloat = isFocused || inputValue !== '';

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
            className={`${classes.input}${
              floatingLabel ? ` ${classes.inputFloating}` : ''
            }`}
            {...(icon && { 'data-icon': true })}
            {...(floatingLabel && {
              'data-should-float': shouldFloat ? 'true' : 'false',
            })}
            id={inputId}
            placeholder={
              floatingLabel
                ? isFocused && !inputValue
                  ? placeholder
                  : ''
                : placeholder
            }
          />
          {floatingLabel && label && (
            <label
              htmlFor={inputId}
              style={{
                position: 'absolute',
                left: icon ? '40px' : '12px',
                top: shouldFloat ? '-8px' : '50%',
                transform: shouldFloat ? 'translateY(0)' : 'translateY(-50%)',
                fontSize: shouldFloat ? '12px' : '14px',
                color: isFocused ? '#2563eb' : '#6b7280',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                padding: '0 6px',
                cursor: 'text',
                zIndex: 1,
              }}
            >
              {label}
            </label>
          )}
        </div>
        <FieldError />
      </AriaTextField>
    );
  },
);

TextField.displayName = 'TextField';
