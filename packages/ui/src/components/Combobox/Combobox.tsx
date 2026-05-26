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

import { forwardRef, useEffect, useMemo } from 'react';
import { ComboBox as AriaComboBox } from 'react-aria-components';
import { useFilter } from 'react-aria';
import { ComboboxProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { ComboboxDefinition } from './definition';
import { Popover } from '../Popover';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import { ComboboxInput } from './ComboboxInput';
import { ComboboxListBox } from './ComboboxListBox';
import type {
  Option,
  OptionSection,
  OptionWithId,
  OptionSectionWithId,
} from '../Select/types';

function addIds(
  options: Array<Option | OptionSection> | undefined,
): Array<OptionWithId | OptionSectionWithId> | undefined {
  return (
    options?.map(item => {
      if ('options' in item) {
        return {
          ...item,
          id: item.title,
          options: item.options.map(o => ({ ...o, id: o.value })),
        };
      }
      return { ...item, id: item.value };
    }) ?? []
  );
}

function disabledKeysFromOptions(
  options: Array<Option | OptionSection> | undefined,
): Iterable<string> | undefined {
  return options?.flatMap(o =>
    'options' in o
      ? o.options.filter(o => o.disabled).map(o => o.value)
      : o.disabled
      ? [o.value]
      : [],
  );
}

/**
 * A text input combined with a dropdown list of options. The user can type to filter
 * suggestions, navigate with the keyboard, and pick a value. With `allowsCustomValue`
 * the typed text can be committed even if no option matches.
 *
 * @public
 */
export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (props, ref) => {
    const { contains } = useFilter({ sensitivity: 'base' });
    const { ownProps, restProps, dataAttributes } = useDefinition(
      ComboboxDefinition,
      props,
    );
    const {
      classes,
      label,
      description,
      options,
      icon,
      placeholder,
      isRequired,
      secondaryLabel,
      isLoading,
    } = ownProps;

    const ariaLabel = restProps['aria-label'];
    const ariaLabelledBy = restProps['aria-labelledby'];

    const isControlled = restProps.inputValue !== undefined;
    const itemsWithIds = useMemo(() => addIds(options), [options]);
    const disabledKeys = useMemo(
      () => disabledKeysFromOptions(options),
      [options],
    );

    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          'Combobox requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, ariaLabel, ariaLabelledBy]);

    const secondaryLabelText =
      secondaryLabel || (isRequired ? 'Required' : null);

    return (
      <AriaComboBox<OptionWithId | OptionSectionWithId>
        className={classes.root}
        defaultFilter={contains}
        allowsEmptyCollection
        items={isControlled ? itemsWithIds : undefined}
        defaultItems={!isControlled ? itemsWithIds : undefined}
        disabledKeys={disabledKeys}
        {...dataAttributes}
        ref={ref}
        {...restProps}
      >
        <FieldLabel
          label={label}
          secondaryLabel={secondaryLabelText}
          description={description}
          descriptionSlot="description"
        />
        <ComboboxInput icon={icon} placeholder={placeholder} />
        <FieldError />
        <Popover className={classes.popover} hideArrow {...dataAttributes}>
          <ComboboxListBox isLoading={isLoading} />
        </Popover>
      </AriaComboBox>
    );
  },
);

Combobox.displayName = 'Combobox';
