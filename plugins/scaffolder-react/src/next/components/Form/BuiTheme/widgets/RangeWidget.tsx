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
import { ChangeEvent } from 'react';
import {
  ariaDescribedByIds,
  FormContextType,
  rangeSpec,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils';
import { Flex, Text } from '@backstage/ui';

export default function RangeWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  id,
  value,
  readonly,
  disabled,
  schema,
  label,
  required,
  onChange: onFieldChange,
  onBlur: onFieldBlur,
  onFocus: onFieldFocus,
}: WidgetProps<T, S, F>) {
  const { min, max, step } = rangeSpec<S>(schema);

  const handleChange = ({
    target: { value: inputValue },
  }: ChangeEvent<HTMLInputElement>) => onFieldChange(parseFloat(inputValue));
  const handleBlur = () => onFieldBlur(id, value);
  const handleFocus = () => onFieldFocus(id, value);

  return (
    <Flex align="center" gap="4">
      <input
        id={id}
        name={id}
        type="range"
        disabled={disabled || readonly}
        min={min}
        max={max}
        step={step}
        value={value ?? min}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        aria-label={label}
        aria-describedby={ariaDescribedByIds<T>(id)}
        required={required}
        style={{ flex: 1 }}
      />
      <Text
        variant="body-medium"
        style={{ minWidth: '3rem', textAlign: 'right' }}
      >
        {value ?? min}
      </Text>
    </Flex>
  );
}
