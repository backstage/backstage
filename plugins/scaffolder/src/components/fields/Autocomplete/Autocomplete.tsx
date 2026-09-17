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

import { forwardRef } from 'react';
import { Combobox } from '@backstage/ui';
import type { ComboboxProps, Option, OptionSection } from '@backstage/ui';

export type AutocompleteProps = Extract<
  ComboboxProps,
  {
    options?: ReadonlyArray<Option | OptionSection>;
    items?: never;
    children?: never;
  }
> & {
  /**
   * Whether the autocomplete is currently loading options.
   * When true, displays a loading indicator in the dropdown.
   */
  isLoading?: boolean;
};

/**
 * Thin wrapper around the BUI `Combobox` that adds an `isLoading` indicator and
 * defaults to free-form text entry with focus-triggered menu.
 *
 * @public
 */
export const Autocomplete = forwardRef<HTMLDivElement, AutocompleteProps>(
  ({ isLoading, options, ...rest }, ref) => {
    const finalOptions = isLoading
      ? [{ value: '__loading__', label: 'Loading…', disabled: true }]
      : options;

    return (
      <Combobox
        ref={ref}
        allowsCustomValue
        menuTrigger="focus"
        options={finalOptions}
        {...rest}
      />
    );
  },
);

Autocomplete.displayName = 'Autocomplete';
