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
import { Select as AriaSelect, Popover } from 'react-aria-components';
import clsx from 'clsx';
import { SelectProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { SelectDefinition } from './definition';
import { PopoverDefinition } from '../Popover/definition';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import styles from './Select.module.css';
import stylesPopover from '../Popover/Popover.module.css';
import { SelectTrigger } from './SelectTrigger';
import { SelectContent } from './SelectContent';

/** @public */
export const Select = forwardRef<
  HTMLDivElement,
  SelectProps<'single' | 'multiple'>
>((props, ref) => {
  const { classNames: popoverClassNames } = useStyles(PopoverDefinition);
  const { classNames, dataAttributes, cleanedProps } = useStyles(
    SelectDefinition,
    {
      size: 'small',
      placeholder: 'Select an option',
      ...props,
    },
  );

  const {
    className,
    label,
    description,
    options,
    icon,
    searchable,
    searchPlaceholder,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    isRequired,
    secondaryLabel,
    ...rest
  } = cleanedProps;

  useEffect(() => {
    if (!label && !ariaLabel && !ariaLabelledBy) {
      console.warn(
        'Select requires either a visible label, aria-label, or aria-labelledby for accessibility',
      );
    }
  }, [label, ariaLabel, ariaLabelledBy]);

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
      <SelectTrigger icon={icon} />
      <FieldError />
      <Popover
        className={clsx(
          popoverClassNames.root,
          stylesPopover[popoverClassNames.root],
          classNames.popover,
          styles[classNames.popover],
        )}
        {...dataAttributes}
      >
        <SelectContent
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          options={options}
        />
      </Popover>
    </AriaSelect>
  );
});

Select.displayName = 'Select';
