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
  FormContextType,
  labelValue,
  RJSFSchema,
  schemaRequiresTrueValue,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils';
import { Checkbox } from '@backstage/ui';

export default function CheckboxWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    value,
    disabled,
    readonly,
    label,
    hideLabel,
    schema,
    onChange: onFieldChange,
  } = props;

  const required = schemaRequiresTrueValue<S>(schema);

  const handleChange = (checked: boolean) => {
    onFieldChange(checked);
  };

  return (
    <Checkbox
      name={id}
      isSelected={typeof value === 'undefined' ? false : Boolean(value)}
      isRequired={required}
      isDisabled={disabled || readonly}
      onChange={handleChange}
    >
      {labelValue(label, hideLabel || !label)}
    </Checkbox>
  );
}
