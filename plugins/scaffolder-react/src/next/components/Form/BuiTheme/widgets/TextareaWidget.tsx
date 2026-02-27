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

const textareaStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: 'var(--bui-space-3)',
  borderRadius: 'var(--bui-radius-3)',
  border: '1px solid var(--bui-border-1)',
  backgroundColor: 'var(--bui-bg-neutral-1)',
  fontSize: 'var(--bui-font-size-3)',
  fontFamily: 'var(--bui-font-regular)',
  fontWeight: 400,
  lineHeight: '1.5',
  color: 'var(--bui-fg-primary)',
  transition: 'border-color 0.2s ease-in-out',
  width: '100%',
  resize: 'vertical',
  boxSizing: 'border-box' as const,
  outline: 'none',
  WebkitAppearance: 'none' as const,
  MozAppearance: 'none' as const,
  appearance: 'none' as const,
};

export default function TextareaWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  id,
  options = {},
  placeholder,
  required,
  value,
  disabled,
  readonly,
  label,
  autofocus,
  onChange: onFieldChange,
  onBlur: onFieldBlur,
  onFocus: onFieldFocus,
  schema,
  rawErrors = [],
}: WidgetProps<T, S, F>) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    onFieldChange(
      event.target.value === '' ? options.emptyValue : event.target.value,
    );
  const handleBlur = () => onFieldBlur(id, value);
  const handleFocus = () => onFieldFocus(id, value);

  const hasError = rawErrors.length > 0;

  return (
    <>
      {(label || schema.title) && (
        <FieldLabel
          label={label || schema.title}
          secondaryLabel={required ? 'Required' : undefined}
          htmlFor={id}
        />
      )}
      <textarea
        id={id}
        name={id}
        placeholder={placeholder}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autofocus}
        disabled={disabled}
        readOnly={readonly}
        value={value || ''}
        rows={(options.rows as number) || 3}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        aria-describedby={ariaDescribedByIds<T>(id)}
        aria-invalid={hasError}
        style={{
          ...textareaStyle,
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
