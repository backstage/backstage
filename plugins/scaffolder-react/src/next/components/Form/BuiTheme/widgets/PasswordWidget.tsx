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
import {
  ariaDescribedByIds,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils';
import { PasswordField } from '@backstage/ui';

export default function PasswordWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  id,
  placeholder,
  required,
  readonly,
  disabled,
  label,
  value,
  onChange: onFieldChange,
  onBlur: onFieldBlur,
  onFocus: onFieldFocus,
  autofocus,
  options,
  schema,
  rawErrors = [],
}: WidgetProps<T, S, F>) {
  const handleChange = (val: string) =>
    onFieldChange(val === '' ? options.emptyValue : val);
  const handleBlur = () => onFieldBlur(id, value);
  const handleFocus = () => onFieldFocus(id, value);

  const hasError = rawErrors.length > 0;

  return (
    <PasswordField
      id={id}
      name={id}
      label={label || schema.title}
      secondaryLabel={required ? 'Required' : undefined}
      placeholder={placeholder}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autofocus}
      isRequired={required}
      isDisabled={disabled}
      isReadOnly={readonly}
      isInvalid={hasError}
      value={value || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      aria-describedby={ariaDescribedByIds<T>(id)}
    />
  );
}
