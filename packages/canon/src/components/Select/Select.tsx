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

import { forwardRef, useCallback, useId, useRef, MouseEvent } from 'react';
import { Select as SelectPrimitive } from '@base-ui-components/react/select';
import { Icon } from '../Icon';
import clsx from 'clsx';
import './Select.styles.css';
import { SelectProps } from './types';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';
import { useStyles } from '../../hooks/useStyles';

/** @public */
export const Select = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
  const {
    className,
    label,
    description,
    options,
    placeholder = 'Select an option',
    size = 'medium',
    required,
    error,
    style,
    ...rest
  } = props;

  const { classNames, dataAttributes } = useStyles('Select');

  // Generate unique IDs for accessibility
  const selectId = useId();
  const descriptionId = useId();
  const errorId = useId();

  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleLabelClick = useCallback(
    (e: MouseEvent<HTMLLabelElement>) => {
      if (!props.disabled && triggerRef.current) {
        e.preventDefault();
        triggerRef.current.focus();
      }
    },
    [props.disabled],
  );

  return (
    <div className={clsx(classNames.root, className)} style={style} ref={ref}>
      {label && (
        <label
          className="canon-SelectLabel"
          htmlFor={selectId}
          onClick={handleLabelClick}
          data-disabled={props.disabled ? true : undefined}
        >
          {label}
          {required && (
            <span aria-hidden="true" className={classNames.required}>
              (Required)
            </span>
          )}
        </label>
      )}
      <SelectPrimitive.Root {...rest}>
        <SelectPrimitive.Trigger
          ref={triggerRef}
          id={selectId}
          className={classNames.trigger}
          data-size={dataAttributes.size}
          data-invalid={error}
        >
          <SelectPrimitive.Value
            className={classNames.value}
            placeholder={placeholder}
          />
          <SelectPrimitive.Icon className={classNames.icon}>
            <Icon name="chevron-down" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Backdrop />
          <SelectPrimitive.Positioner>
            <SelectPrimitive.Popup className={classNames.popup}>
              {options?.map(option => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={classNames.item}
                >
                  <SelectPrimitive.ItemIndicator
                    className={classNames.itemIndicator}
                  >
                    <Icon name="check" />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText className={classNames.itemText}>
                    {option.label}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {description && (
        <p className={classNames.description} id={descriptionId}>
          {description}
        </p>
      )}
      {error && (
        <p className={classNames.error} id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
