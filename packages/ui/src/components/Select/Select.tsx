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

import { forwardRef, useEffect } from 'react';
import {
  Select as AriaSelect,
  SelectValue,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
  Text,
} from 'react-aria-components';
import clsx from 'clsx';
import { SelectProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { FieldLabel } from '../FieldLabel';
import { Icon } from '../Icon';
import { FieldError } from '../FieldError';
import styles from './Select.module.css';
import stylesPopover from '../Popover/Popover.module.css';

/** @public */
export const Select = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
  const { classNames: popoverClassNames } = useStyles('Popover');
  const { classNames, dataAttributes, cleanedProps } = useStyles('Select', {
    size: 'small',
    placeholder: 'Select an option',
    ...props,
  });

  const {
    className,
    label,
    description,
    options,
    placeholder,
    size,
    icon,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    isRequired,
    secondaryLabel,
    style,
    ...rest
  } = cleanedProps;

  useEffect(() => {
    if (!label && !ariaLabel && !ariaLabelledBy) {
      console.warn(
        'Select requires either a visible label, aria-label, or aria-labelledby for accessibility',
      );
    }
  }, [label, ariaLabel, ariaLabelledBy]);

  // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
  const secondaryLabelText = secondaryLabel || (isRequired ? 'Required' : null);

  return (
    <AriaSelect
      className={clsx(classNames.root, styles[classNames.root], className)}
      {...dataAttributes}
      ref={ref}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      {...rest}
    >
      <FieldLabel
        label={label}
        secondaryLabel={secondaryLabelText}
        description={description}
      />
      <Button
        className={clsx(classNames.trigger, styles[classNames.trigger])}
        data-size={dataAttributes['data-size']}
      >
        {icon}
        <SelectValue
          className={clsx(classNames.value, styles[classNames.value])}
        />
        <Icon aria-hidden="true" name="chevron-down" />
      </Button>
      <FieldError />
      <Popover
        className={clsx(
          popoverClassNames.root,
          stylesPopover[popoverClassNames.root],
        )}
      >
        <ListBox className={clsx(classNames.list, styles[classNames.list])}>
          {options?.map(option => (
            <ListBoxItem
              key={option.value}
              id={option.value}
              className={clsx(classNames.item, styles[classNames.item])}
            >
              <div
                className={clsx(
                  classNames.itemIndicator,
                  styles[classNames.itemIndicator],
                )}
              >
                <Icon name="check" />
              </div>
              <Text
                slot="label"
                className={clsx(
                  classNames.itemLabel,
                  styles[classNames.itemLabel],
                )}
              >
                {option.label}
              </Text>
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
});

Select.displayName = 'Select';
