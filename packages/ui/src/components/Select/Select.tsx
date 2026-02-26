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
import { useDefinition } from '../../hooks/useDefinition';
import { SelectDefinition } from './definition';
import { PopoverDefinition } from '../Popover/definition';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import { SelectTrigger } from './SelectTrigger';
import { SelectContent } from './SelectContent';

/** @public */
export const Select = forwardRef<
  HTMLDivElement,
  SelectProps<'single' | 'multiple'>
>((props, ref) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    SelectDefinition,
    {
      placeholder: 'Select an option',
      ...props,
    },
  );

  const {
    classes,
    label,
    description,
    options,
    icon,
    searchable,
    searchPlaceholder,
    isRequired,
    secondaryLabel,
  } = ownProps;

  const ariaLabel = restProps['aria-label'];
  const ariaLabelledBy = restProps['aria-labelledby'];

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
      className={classes.root}
      {...dataAttributes}
      ref={ref}
      {...restProps}
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
          PopoverDefinition.classNames.root,
          PopoverDefinition.styles[PopoverDefinition.classNames.root],
          classes.popover,
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
