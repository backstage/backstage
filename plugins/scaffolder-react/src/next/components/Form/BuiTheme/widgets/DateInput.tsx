/*
 * Copyright 2026 The Backstage Authors
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
import { CSSProperties, ChangeEvent } from 'react';
import {
  ariaDescribedByIds,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils';
import { FieldLabel } from '@backstage/ui';

// Native fallback until BUI ships DatePicker/TimePicker components.
const baseStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  height: '2rem',
  padding: '0 var(--bui-space-3)',
  borderRadius: 'var(--bui-radius-2)',
  border: '1px solid var(--bui-border-2)',
  backgroundColor: 'var(--bui-bg-neutral-1)',
  fontSize: 'var(--bui-font-size-3)',
  fontFamily: 'var(--bui-font-regular)',
  fontWeight: 400,
  color: 'var(--bui-fg-primary)',
  transition: 'border-color 0.2s ease-in-out',
  width: '100%',
  boxSizing: 'border-box' as const,
  outline: 'none',
  WebkitAppearance: 'none' as const,
  MozAppearance: 'none' as const,
  appearance: 'none' as const,
};

interface DateInputProps<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
> extends WidgetProps<T, S, F> {
  inputType: 'date' | 'datetime-local' | 'time';
}

export default function DateInput<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  id,
  label,
  required,
  disabled,
  readonly,
  value,
  autofocus,
  schema,
  options = {},
  onChange: onFieldChange,
  onBlur: onFieldBlur,
  onFocus: onFieldFocus,
  rawErrors = [],
  inputType,
}: DateInputProps<T, S, F>) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onFieldChange(
      event.target.value === '' ? options.emptyValue : event.target.value,
    );
  const handleBlur = () => onFieldBlur(id, value);
  const handleFocus = () => onFieldFocus(id, value);

  const hasError = rawErrors.length > 0;
  const stringValue = String(value ?? '');

  return (
    <>
      {(label || schema.title) && (
        <FieldLabel
          label={label || schema.title}
          secondaryLabel={required ? 'Required' : undefined}
          htmlFor={id}
        />
      )}
      <input
        id={id}
        name={id}
        type={inputType}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autofocus}
        disabled={disabled}
        readOnly={readonly}
        value={stringValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        aria-describedby={ariaDescribedByIds<T>(id)}
        aria-invalid={hasError}
        style={{
          ...baseStyle,
          ...(disabled && {
            opacity: 0.5,
            cursor: 'not-allowed',
            borderColor: 'var(--bui-border-disabled)',
          }),
          ...(hasError && {
            borderColor: 'var(--bui-fg-danger)',
          }),
        }}
      />
    </>
  );
}
