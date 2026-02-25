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

import { forwardRef, useEffect, useState, useRef } from 'react';
import {
  Input,
  SearchField as AriaSearchField,
  Button,
} from 'react-aria-components';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import { RiSearch2Line, RiCloseCircleLine } from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import { SearchFieldDefinition } from './definition';

import type { SearchFieldProps } from './types';

/** @public */
export const SearchField = forwardRef<HTMLDivElement, SearchFieldProps>(
  (props, ref) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      SearchFieldDefinition,
      props,
    );
    const {
      classes,
      label,
      icon,
      isRequired,
      secondaryLabel,
      placeholder,
      startCollapsed,
      description,
    } = ownProps;

    useEffect(() => {
      if (!label && !restProps['aria-label'] && !restProps['aria-labelledby']) {
        console.warn(
          'SearchField requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, restProps['aria-label'], restProps['aria-labelledby']]);

    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
    const secondaryLabelText =
      secondaryLabel || (isRequired ? 'Required' : null);

    const handleFocusChange = (isFocused: boolean) => {
      restProps.onFocusChange?.(isFocused);
      setIsFocused(isFocused);
    };

    const handleContainerClick = () => {
      inputRef.current?.focus();
    };

    const hasInputRef = !!inputRef.current;
    const hasValue = !!inputRef.current?.value;

    const isCollapsed = hasInputRef
      ? startCollapsed && !hasValue && !isFocused
      : startCollapsed &&
        !restProps.value &&
        !restProps.defaultValue &&
        !isFocused;

    return (
      <AriaSearchField
        className={classes.root}
        {...dataAttributes}
        data-collapsed={isCollapsed}
        {...restProps}
        onFocusChange={handleFocusChange}
        ref={ref}
      >
        <FieldLabel
          label={label}
          secondaryLabel={secondaryLabelText}
          description={description}
        />
        <div
          className={classes.inputWrapper}
          data-size={dataAttributes['data-size']}
          onClick={handleContainerClick}
        >
          {icon !== false && (
            <div
              className={classes.inputIcon}
              data-size={dataAttributes['data-size']}
              aria-hidden="true"
            >
              {icon || <RiSearch2Line />}
            </div>
          )}
          <Input
            ref={inputRef}
            className={classes.input}
            {...(icon !== false && { 'data-icon': true })}
            placeholder={placeholder}
          />
          <Button
            className={classes.clear}
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
