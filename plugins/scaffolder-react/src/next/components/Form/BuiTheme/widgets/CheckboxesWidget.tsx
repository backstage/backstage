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
  optionId,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils';
import { Checkbox, CheckboxGroup } from '@backstage/ui';

export default function CheckboxesWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  id,
  label,
  required,
  disabled,
  readonly,
  options,
  value,
  onChange: onFieldChange,
  rawErrors = [],
}: WidgetProps<T, S, F>) {
  const { enumOptions, enumDisabled } = options;

  const selectedKeys = Array.isArray(value) ? value.map(String) : [];
  const hasError = rawErrors.length > 0;

  const handleChange = (keys: string[]) => {
    const next =
      enumOptions
        ?.filter(option => keys.includes(String(option.value)))
        .map(option => option.value) ?? [];
    onFieldChange(next as T);
  };

  return (
    <CheckboxGroup
      label={label}
      isRequired={required}
      isInvalid={hasError}
      isDisabled={disabled || readonly}
      value={selectedKeys}
      onChange={handleChange}
      aria-describedby={ariaDescribedByIds<T>(id)}
    >
      {enumOptions?.map((option, index) => {
        const itemDisabled =
          Array.isArray(enumDisabled) &&
          enumDisabled.indexOf(option.value) !== -1;
        return (
          <Checkbox
            key={optionId(id, index)}
            value={String(option.value)}
            isDisabled={itemDisabled}
          >
            {option.label}
          </Checkbox>
        );
      })}
    </CheckboxGroup>
  );
}
