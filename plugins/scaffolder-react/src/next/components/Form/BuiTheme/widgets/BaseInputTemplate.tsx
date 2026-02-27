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
  BaseInputTemplateProps,
  examplesId,
  FormContextType,
  getInputProps,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';
import { TextField } from '@backstage/ui';

export default function BaseInputTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  id,
  placeholder,
  required,
  readonly,
  disabled,
  type,
  label,
  value,
  onChange: onFieldChange,
  onBlur: onFieldBlur,
  onFocus: onFieldFocus,
  autofocus,
  options,
  schema,
  rawErrors = [],
  children,
  extraProps,
}: BaseInputTemplateProps<T, S, F>) {
  const { type: inputType, ...restInputProps } = {
    ...extraProps,
    ...getInputProps<T, S, F>(schema, type, options),
  };

  const list = schema.examples ? examplesId<T>(id) : undefined;

  const handleChange = (val: string) =>
    onFieldChange(val === '' ? options.emptyValue : val);
  const handleBlur = () => onFieldBlur(id, value);
  const handleFocus = () => onFieldFocus(id, value);

  const hasError = rawErrors.length > 0;
  const isNumeric = inputType === 'number' || inputType === 'integer';

  // Normalize value to string for the input
  let inputValue: string;
  if (isNumeric) {
    inputValue = value || value === 0 ? String(value) : '';
  } else {
    inputValue = value === null || value === undefined ? '' : String(value);
  }

  return (
    <>
      <TextField
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
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        aria-describedby={ariaDescribedByIds<T>(id, !!schema.examples)}
        list={list}
        {...restInputProps}
      />
      {children}
      {Array.isArray(schema.examples) ? (
        <datalist id={examplesId<T>(id)}>
          {(schema.examples as string[])
            .concat(
              schema.default && !schema.examples.includes(schema.default)
                ? ([schema.default] as string[])
                : [],
            )
            .map((example: any) => {
              return <option key={example} value={example} />;
            })}
        </datalist>
      ) : null}
    </>
  );
}
