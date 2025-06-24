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
  Input,
  SearchField as AriaSearchField,
  Button,
} from 'react-aria-components';
import clsx from 'clsx';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import { RiSearch2Line, RiCloseCircleLine } from '@remixicon/react';
import { useStyles } from '../../hooks/useStyles';

import type { SearchFieldProps } from './types';

/** @public */
export const SearchField = forwardRef<HTMLDivElement, SearchFieldProps>(
  (props, ref) => {
    const {
      className,
      icon,
      size = 'small',
      label,
      secondaryLabel,
      description,
      isRequired,
      placeholder = 'Search',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    } = props;

    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          'SearchField requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, ariaLabel, ariaLabelledBy]);

    const { classNames: textFieldClassNames, dataAttributes } = useStyles(
      'TextField',
      {
        size,
      },
    );

    const { classNames: searchFieldClassNames } = useStyles('SearchField', {
      size,
    });

    // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
    const secondaryLabelText =
      secondaryLabel || (isRequired ? 'Required' : null);

    return (
      <AriaSearchField
        className={clsx(
          textFieldClassNames.root,
          searchFieldClassNames.root,
          className,
        )}
        {...dataAttributes}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...rest}
        ref={ref}
      >
        <FieldLabel
          label={label}
          secondaryLabel={secondaryLabelText}
          description={description}
        />
        <div
          className={textFieldClassNames.inputWrapper}
          data-size={dataAttributes['data-size']}
        >
          {icon !== false && (
            <div
              className={textFieldClassNames.inputIcon}
              data-size={dataAttributes['data-size']}
              aria-hidden="true"
            >
              {icon || <RiSearch2Line />}
            </div>
          )}
          <Input
            className={textFieldClassNames.input}
            {...(icon !== false && { 'data-icon': true })}
            placeholder={placeholder}
          />
          <Button
            className={searchFieldClassNames.clear}
            data-size={dataAttributes['data-size']}
          >
            <RiCloseCircleLine />
          </Button>
        </div>
        <FieldError />
      </AriaSearchField>
    );
  },
);

SearchField.displayName = 'searchField';
