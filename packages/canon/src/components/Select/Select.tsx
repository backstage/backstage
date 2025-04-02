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

import React from 'react';
import { Select as SelectPrimitive } from '@base-ui-components/react/select';
import { Field, Icon } from '@backstage/canon';
import clsx from 'clsx';
import './Select.styles.css';
import { SelectProps } from './types';

/** @public */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const {
      className,
      name,
      label,
      description,
      value,
      defaultValue,
      onValueChange,
      onOpenChange,
      options,
      placeholder = 'Select an option',
      size = 'medium',
      disabled = false,
      required = false,
      style,
    } = props;
    return (
      <Field.Root
        className={clsx('canon-SelectFieldRoot', className)}
        disabled={disabled}
        name={name}
        style={style}
      >
        {label && (
          <Field.Label className="canon-SelectFieldLabel">{label}</Field.Label>
        )}
        <SelectPrimitive.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          onOpenChange={onOpenChange}
          required={required}
          name={name}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            className={clsx(
              'canon-SelectTrigger',
              `canon-SelectTrigger--size-${size}`,
            )}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon className="canon-SelectIcon">
              <Icon name="chevron-down" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Backdrop />
            <SelectPrimitive.Positioner>
              <SelectPrimitive.Popup className="canon-SelectPopup">
                {options?.map(option => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className="canon-SelectItem"
                  >
                    <SelectPrimitive.ItemIndicator className="canon-SelectItemIndicator">
                      <Icon name="check" />
                    </SelectPrimitive.ItemIndicator>
                    <SelectPrimitive.ItemText className="canon-SelectItemText">
                      {option.label}
                    </SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {description && (
          <Field.Description className="canon-SelectFieldDescription">
            {description}
          </Field.Description>
        )}
        <Field.Error className="canon-SelectFieldError" />
      </Field.Root>
    );
  },
);

Select.displayName = 'Select';
