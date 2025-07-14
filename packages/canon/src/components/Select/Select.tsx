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
import './Select.styles.css';
import { SelectProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { FieldLabel } from '../FieldLabel';
import { Icon } from '../Icon';
import { FieldError } from '../FieldError';

/** @public */
export const Select = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
  const {
    className,
    label,
    description,
    options,
    placeholder = 'Select an option',
    size = 'small',
    icon,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    isRequired,
    secondaryLabel,
    style,
    ...rest
  } = props;

  const { classNames: popoverClassNames } = useStyles('Popover');
  const { classNames, dataAttributes } = useStyles('Select', {
    size,
  });

  useEffect(() => {
    if (!label && !ariaLabel && !ariaLabelledBy) {
      console.warn(
        'TextField requires either a visible label, aria-label, or aria-labelledby for accessibility',
      );
    }
  }, [label, ariaLabel, ariaLabelledBy]);

  // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
  const secondaryLabelText = secondaryLabel || (isRequired ? 'Required' : null);

  return (
    <AriaSelect
      className={clsx(classNames.root, className)}
      {...dataAttributes}
      ref={ref}
      {...rest}
    >
      <FieldLabel
        label={label}
        secondaryLabel={secondaryLabelText}
        description={description}
      />
      <Button
        className={classNames.trigger}
        data-size={dataAttributes['data-size']}
      >
        {icon}
        <SelectValue className={classNames.value} />
        <Icon aria-hidden="true" name="chevron-down" />
      </Button>
      <FieldError />
      <Popover className={popoverClassNames.root}>
        <ListBox className={classNames.list}>
          {options?.map(option => (
            <ListBoxItem
              key={option.value}
              id={option.value}
              className={classNames.item}
            >
              <div className={classNames.itemIndicator}>
                <Icon name="check" />
              </div>
              <Text slot="label" className={classNames.itemLabel}>
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
