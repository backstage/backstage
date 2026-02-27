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
  ComboBox as AriaComboBox,
  Input,
  Popover,
  ListBox,
  ListBoxItem,
  Button,
} from 'react-aria-components';
import type { ComboBoxProps as AriaComboBoxProps } from 'react-aria-components';
import { RiArrowDownSLine } from '@remixicon/react';
import { FieldLabel } from '@backstage/ui';
import styles from './Autocomplete.module.css';

export interface AutocompleteProps<T extends object = object>
  extends Omit<AriaComboBoxProps<T>, 'children'> {
  /**
   * Visible label for the autocomplete field.
   * When used inside a field extension, the FieldTemplate handles this.
   * When used as a sub-component of a field extension, pass this directly.
   */
  label?: string | null;

  /**
   * Description text shown below the label
   */
  description?: string | null;

  /**
   * The size of the autocomplete field
   * @defaultValue 'small'
   */
  size?: 'small' | 'medium';

  /**
   * The options of the autocomplete field
   */
  options?: Array<{ value: string; label: string; disabled?: boolean }>;

  /**
   * Text to display in the input when it has no value
   */
  placeholder?: string;

  /**
   * Whether the autocomplete is currently loading options.
   * When true, displays a loading indicator in the dropdown.
   */
  isLoading?: boolean;
}

/**
 * An Autocomplete component that supports free-form text entry with suggestions.
 * Built with react-aria-components and BUI design tokens.
 *
 * Labels and descriptions are handled by the FieldTemplate, so this component
 * only renders the combobox input and dropdown.
 *
 * @public
 */
export const Autocomplete = forwardRef<HTMLDivElement, AutocompleteProps>(
  (props, ref) => {
    const {
      label,
      description,
      options = [],
      placeholder,
      size = 'small',
      isLoading = false,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    } = props;

    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledBy) {
        // eslint-disable-next-line no-console
        console.warn(
          'Autocomplete requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, ariaLabel, ariaLabelledBy]);

    const hasSuggestions = !isLoading && options.length > 0;

    return (
      <AriaComboBox
        className={styles.textField}
        allowsCustomValue
        menuTrigger="focus"
        data-size={size}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        ref={ref}
        {...rest}
      >
        {label && (
          <FieldLabel
            label={label}
            secondaryLabel={rest.isRequired ? 'Required' : undefined}
            description={description ?? undefined}
          />
        )}
        <div className={styles.inputWrapper} data-size={size}>
          <Input
            className={`${styles.input} ${styles.comboBoxInput}`}
            placeholder={placeholder}
          />

          {hasSuggestions && (
            <Button className={styles.dropdownButton}>
              <RiArrowDownSLine aria-hidden="true" />
            </Button>
          )}
        </div>
        <Popover className={styles.popover}>
          <ListBox className={styles.listBox}>
            {isLoading && (
              <ListBoxItem
                key="loading"
                id="loading"
                textValue="Loading..."
                className={styles.selectItem}
                isDisabled
              >
                <span className={styles.selectItemLabel}>Loading...</span>
              </ListBoxItem>
            )}
            {hasSuggestions &&
              options.map(option => (
                <ListBoxItem
                  key={option.value}
                  id={option.value}
                  textValue={option.label}
                  className={styles.selectItem}
                  isDisabled={option.disabled}
                >
                  <span className={styles.selectItemLabel}>{option.label}</span>
                </ListBoxItem>
              ))}
          </ListBox>
        </Popover>
      </AriaComboBox>
    );
  },
);

Autocomplete.displayName = 'Autocomplete';
