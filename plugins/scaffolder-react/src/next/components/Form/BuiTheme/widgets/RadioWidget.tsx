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
  enumOptionsIndexForValue,
  enumOptionsValueForIndex,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils';
import { RadioGroup, Radio } from '@backstage/ui';

export default function RadioWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  id,
  options,
  required,
  value,
  disabled,
  readonly,
  label,
  onChange: onFieldChange,
  rawErrors = [],
}: WidgetProps<T, S, F>) {
  const { enumOptions, enumDisabled, emptyValue } = options;

  const handleChange = (newValue: string) => {
    const actualValue = enumOptionsValueForIndex<S>(
      newValue,
      enumOptions,
      emptyValue,
    );
    onFieldChange(actualValue);
  };

  const selectedIndex =
    enumOptionsIndexForValue<S>(value, enumOptions) ?? undefined;
  const hasError = rawErrors.length > 0;

  return (
    <RadioGroup
      name={id}
      label={label}
      secondaryLabel={required ? 'Required' : undefined}
      value={selectedIndex !== undefined ? String(selectedIndex) : ''}
      onChange={handleChange}
      isRequired={required}
      isDisabled={disabled || readonly}
      isInvalid={hasError}
      aria-describedby={ariaDescribedByIds<T>(id)}
    >
      {enumOptions?.map(({ value: optionValue, label: optionLabel }, index) => {
        const itemDisabled =
          Array.isArray(enumDisabled) &&
          enumDisabled.indexOf(optionValue) !== -1;

        return (
          <Radio key={index} value={String(index)} isDisabled={itemDisabled}>
            {optionLabel}
          </Radio>
        );
      })}
    </RadioGroup>
  );
}
