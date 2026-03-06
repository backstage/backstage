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
import { Checkbox, FieldLabel, Flex } from '@backstage/ui';

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

  const handleChange = (optionValue: any) => (checked: boolean) => {
    const currentValue = Array.isArray(value) ? value : [];
    if (checked) {
      onFieldChange([...currentValue, optionValue]);
    } else {
      onFieldChange(currentValue.filter((v: any) => v !== optionValue));
    }
  };

  const hasError = rawErrors.length > 0;

  return (
    <Flex
      direction="column"
      gap="2"
      aria-describedby={ariaDescribedByIds<T>(id)}
    >
      {label && (
        <FieldLabel
          label={label}
          secondaryLabel={required ? 'Required' : undefined}
        />
      )}
      {enumOptions?.map((option, index) => {
        const checked = Array.isArray(value) && value.includes(option.value);
        const itemDisabled =
          Array.isArray(enumDisabled) &&
          enumDisabled.indexOf(option.value) !== -1;
        const checkboxId = optionId(id, index);

        return (
          <Checkbox
            key={checkboxId}
            name={checkboxId}
            isSelected={checked}
            isDisabled={disabled || readonly || itemDisabled}
            isInvalid={hasError}
            onChange={handleChange(option.value)}
          >
            {option.label}
          </Checkbox>
        );
      })}
    </Flex>
  );
}
