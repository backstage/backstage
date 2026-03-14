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

import { forwardRef, useEffect } from 'react';
import { ComboBox, Input, Popover, Button } from 'react-aria-components';
import { RiArrowDownSLine } from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import { AutocompleteDefinition } from './definition';
import { PopoverDefinition } from '../Popover/definition';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import { AutocompleteContent } from './AutocompleteContent';
import clsx from 'clsx';
import type { AutocompleteProps } from './types';

/** @public */
export const Autocomplete = forwardRef<HTMLDivElement, AutocompleteProps>(
  (props, ref) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      AutocompleteDefinition,
      {
        placeholder: 'Type to search...',
        ...props,
      },
    );
    const { ownProps: popoverOwnProps } = useDefinition(PopoverDefinition, {});

    const {
      classes,
      label,
      description,
      options = [],
      icon,
      isRequired,
      secondaryLabel,
      placeholder,
      displayMode,
      gridConfig,
      tableColumns,
      renderOption,
    } = ownProps;

    const ariaLabel = restProps['aria-label'];
    const ariaLabelledBy = restProps['aria-labelledby'];

    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          'Autocomplete requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, ariaLabel, ariaLabelledBy]);

    const secondaryLabelText =
      secondaryLabel || (isRequired ? 'Required' : null);

    return (
      <ComboBox
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
        <div className={classes.trigger}>
          <div
            className={classes.inputWrapper}
            data-size={dataAttributes['data-size']}
          >
            {icon && (
              <div
                className={classes.inputIcon}
                data-size={dataAttributes['data-size']}
                aria-hidden="true"
              >
                {icon}
              </div>
            )}
            <Input
              className={classes.input}
              placeholder={placeholder}
              {...(icon && { 'data-icon': true })}
            />
            <Button className={classes.chevron}>
              <RiArrowDownSLine aria-hidden="true" />
            </Button>
          </div>
        </div>
        <FieldError />
        <Popover
          className={clsx(popoverOwnProps.classes.root, classes.popover)}
          {...dataAttributes}
        >
          <AutocompleteContent
            options={options}
            displayMode={displayMode}
            gridConfig={gridConfig}
            tableColumns={tableColumns}
            renderOption={renderOption}
          />
        </Popover>
      </ComboBox>
    );
  },
);

Autocomplete.displayName = 'Autocomplete';
