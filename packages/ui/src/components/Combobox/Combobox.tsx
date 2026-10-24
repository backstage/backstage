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

import { forwardRef, useEffect, useState } from 'react';
import { ComboBox as AriaComboBox } from 'react-aria-components';
import { useFilter } from 'react-aria';
import type {
  ComboboxAsyncItemsProps,
  ComboboxAsyncOptionsProps,
  ComboboxItemsProps,
  ComboboxListBoxOwnProps,
  ComboboxOptionsProps,
  ComboboxProps,
  ComboboxServerItem,
  ComboboxServerItemsProps,
  ComboboxServerOptionsProps,
  ComboboxStaticProps,
} from './types';
import type {
  ComboBoxProps as AriaComboBoxProps,
  Key,
} from 'react-aria-components';
import type {
  AsyncListSource,
  CollectionItem,
  NormalizedOption,
} from '../../types/selectableCollection';
import { useDefinition } from '../../hooks/useDefinition';
import { ComboboxDefinition } from './definition';
import { Popover } from '../Popover';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import { ComboboxInput } from './ComboboxInput';
import { ComboboxListBox } from './ComboboxListBox';
import {
  useCollectionAdapter,
  type CollectionAdapterResult,
} from '../../hooks/useCollectionAdapter';
import {
  filterOptionSections,
  isAsyncListSource,
  normalizeOptions,
  resolveCollectionSource,
} from '../../utils/selectableCollection';
import {
  getAsyncComboboxItemTextValue,
  useAsyncComboboxState,
} from './useAsyncComboboxState';

type ComboboxRuntimeStateProps<T extends CollectionItem> = {
  value?: Key | T | null;
  defaultValue?: Key | T | null;
  onChange?: ((value: Key | null) => void) | ((value: T | null) => void);
  inputValue?: string;
  defaultInputValue?: string;
  onInputChange?: (value: string) => void;
};

type ComboboxAriaStateProps = {
  value?: Key | null;
  defaultValue?: Key | null;
  onChange?: (value: Key | null) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputChange?: (value: string) => void;
};

type AsyncComboboxState = {
  value: Key | null;
  inputValue: string;
  onChange: (value: Key | null) => void;
  onInputChange: (value: string) => void;
};

function resolveComboboxStateProps<T extends CollectionItem>({
  runtimeState,
  asyncState,
  collection,
  hasSearch,
}: {
  runtimeState: ComboboxRuntimeStateProps<T>;
  asyncState?: AsyncComboboxState;
  collection: CollectionAdapterResult<T>;
  hasSearch: boolean;
}): ComboboxAriaStateProps {
  if (asyncState) {
    return asyncState;
  }

  const selectionProps = {
    value: runtimeState.value as Key | null | undefined,
    defaultValue: runtimeState.defaultValue as Key | null | undefined,
    onChange: runtimeState.onChange as
      | ((value: Key | null) => void)
      | undefined,
  };

  if (hasSearch) {
    return {
      ...selectionProps,
      inputValue: collection.inputValue,
      defaultInputValue: collection.defaultInputValue,
      onInputChange: collection.onInputChange,
    };
  }

  return {
    ...selectionProps,
    inputValue: runtimeState.inputValue,
    defaultInputValue: runtimeState.defaultInputValue,
    onInputChange: runtimeState.onInputChange,
  };
}

/**
 * A text input combined with a dropdown list of options. The user can type to filter
 * suggestions, navigate with the keyboard, and pick a value. With
 * `allowsCustomValue`, unmatched typed text can remain in the input without
 * selecting an option. The suggestions open when the input receives focus by
 * default. Use `menuTrigger` to customize this behavior.
 *
 * @public
 */
function ComboboxImpl<T extends CollectionItem = NormalizedOption>(
  props: ComboboxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
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
    items,
    children,
    dependencies,
    icon,
    placeholder,
    isRequired,
    secondaryLabel,
    search,
    loading,
  } = ownProps;

  const ariaLabel = restProps['aria-label'];
  const ariaLabelledBy = restProps['aria-labelledby'];

  useEffect(() => {
    if (!label && !ariaLabel && !ariaLabelledBy) {
      console.warn(
        'Combobox requires either a visible label, aria-label, or aria-labelledby for accessibility',
      );
    }
  }, [label, ariaLabel, ariaLabelledBy]);

  const secondaryLabelText = secondaryLabel || (isRequired ? 'Required' : null);
  const collectionSource = resolveCollectionSource<T>({
    options,
    items: items as Iterable<T> | AsyncListSource<T> | undefined,
  });
  const collection = useCollectionAdapter({
    items: collectionSource.source,
    search,
    loading,
    retainSelectedItems: false,
  });
  const renderedItems = collectionSource.rendersItems
    ? collection.canonicalItems
    : undefined;
  const searchProps = typeof search === 'object' ? search : undefined;
  const isServerSearch = searchProps?.mode === 'server';
  const isDirectAsyncServer =
    isServerSearch && isAsyncListSource(collectionSource.source);
  const hasCustomFilter = searchProps?.filter !== undefined;
  // React Aria builds the collection from the list box children and filters it
  // by text unless items are passed. Passing items turns that filter off, so
  // the server or the custom filter decides which options the list box renders.
  const rootItems =
    isServerSearch || hasCustomFilter ? collection.canonicalItems : undefined;
  const {
    value,
    defaultValue,
    onChange,
    inputValue,
    defaultInputValue,
    onInputChange,
    menuTrigger = 'focus',
    onOpenChange,
    ...ariaProps
  } = restProps as typeof restProps & ComboboxRuntimeStateProps<T>;
  const asyncComboboxProps = isDirectAsyncServer
    ? {
        source: collectionSource.source as AsyncListSource<T>,
        value: value as T | null | undefined,
        defaultValue: defaultValue as T | null | undefined,
        onChange: onChange as ((value: T | null) => void) | undefined,
        allowsCustomValue: restProps.allowsCustomValue,
      }
    : undefined;
  const asyncComboboxState = useAsyncComboboxState(asyncComboboxProps);
  const comboboxStateProps = resolveComboboxStateProps({
    runtimeState: {
      value,
      defaultValue,
      onChange,
      inputValue,
      defaultInputValue,
      onInputChange,
    },
    asyncState: asyncComboboxState,
    collection,
    hasSearch: search !== undefined,
  });
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState(
    comboboxStateProps.defaultInputValue ?? '',
  );
  const currentInputValue =
    comboboxStateProps.inputValue ?? uncontrolledInputValue;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [lastInputValue, setLastInputValue] = useState(currentInputValue);
  if (lastInputValue !== currentInputValue) {
    setLastInputValue(currentInputValue);
    setShowAllOptions(false);
  }
  // The deprecated `selectedKey` and `defaultSelectedKey` props still reach
  // React Aria, so the selection mirror honors them too.
  const keyProps = ariaProps as {
    selectedKey?: Key | null;
    defaultSelectedKey?: Key | null;
    disabledKeys?: Iterable<Key>;
  };
  const [uncontrolledSelectedKey, setUncontrolledSelectedKey] = useState(
    comboboxStateProps.defaultValue ?? keyProps.defaultSelectedKey ?? null,
  );
  let selectedKey = uncontrolledSelectedKey;
  if (comboboxStateProps.value !== undefined) {
    selectedKey = comboboxStateProps.value;
  } else if (keyProps.selectedKey !== undefined) {
    selectedKey = keyProps.selectedKey;
  }
  // Like React Aria's own filtering, the custom filter only applies once the
  // input text changes in the open menu.
  const customFilterQuery =
    hasCustomFilter && isMenuOpen && !showAllOptions
      ? currentInputValue
      : undefined;
  // `search` mixes the options and items variants, so each branch narrows the
  // filter to the type it renders.
  const optionFilter = collectionSource.rendersItems
    ? undefined
    : (searchProps?.filter as
        | ((option: NormalizedOption, query: string) => boolean)
        | undefined);
  // React Aria reads the selected option's label from the collection when it
  // restores the input on Escape or blur, and the collection only holds the
  // options the list box renders. So the selected option stays in the
  // collection even when the filter excludes it, but it is disabled so the
  // keyboard skips it, and the list box hides it.
  let hiddenKey: Key | undefined;
  const keepsSelected = (id: Key, matches: boolean) => {
    if (matches || id !== selectedKey) {
      return matches;
    }
    hiddenKey = id;
    return true;
  };
  const filteredOptions =
    optionFilter && customFilterQuery !== undefined && collectionSource.options
      ? filterOptionSections(
          normalizeOptions(collectionSource.options),
          customFilterQuery,
          (option, query) =>
            keepsSelected(option.id, optionFilter(option, query)),
        )
      : collectionSource.options;
  const itemFilter = collectionSource.rendersItems
    ? (searchProps?.filter as ((item: T, query: string) => boolean) | undefined)
    : undefined;
  const filteredItems =
    itemFilter && customFilterQuery !== undefined && renderedItems
      ? renderedItems.filter(item =>
          keepsSelected(item.id, itemFilter(item, customFilterQuery)),
        )
      : renderedItems;
  const disabledKeys =
    hiddenKey === undefined
      ? keyProps.disabledKeys
      : [...(keyProps.disabledKeys ?? []), hiddenKey];
  const handleChange = (key: Key | null) => {
    setUncontrolledSelectedKey(key);
    comboboxStateProps.onChange?.(key);
  };
  const handleInputChange = (nextInputValue: string) => {
    setUncontrolledInputValue(nextInputValue);
    // The mirror misses the label React Aria shows for a default selection, so
    // an edit back to the mirrored value must still start filtering.
    setShowAllOptions(false);
    comboboxStateProps.onInputChange?.(nextInputValue);
  };
  const handleOpenChange: NonNullable<AriaComboBoxProps<T>['onOpenChange']> = (
    isOpen,
    trigger,
  ) => {
    setIsMenuOpen(isOpen);
    if (isOpen) {
      setShowAllOptions(trigger !== 'input');
    }
    onOpenChange?.(isOpen, trigger);
  };
  const getItemTextValue =
    isDirectAsyncServer && items !== undefined
      ? getAsyncComboboxItemTextValue
      : undefined;

  return (
    <AriaComboBox<T>
      className={classes.root}
      defaultFilter={contains}
      items={rootItems}
      {...dataAttributes}
      ref={ref}
      {...ariaProps}
      {...comboboxStateProps}
      disabledKeys={disabledKeys}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onOpenChange={handleOpenChange}
      menuTrigger={menuTrigger}
      allowsEmptyCollection
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
        <ComboboxListBox
          options={filteredOptions}
          items={filteredItems}
          hiddenKey={hiddenKey}
          dependencies={dependencies}
          loading={collection.loading}
          isStale={collection.isStale}
          getItemTextValue={getItemTextValue}
        >
          {children as ComboboxListBoxOwnProps<T>['children']}
        </ComboboxListBox>
      </Popover>
    </AriaComboBox>
  );
}

/** @public */
export const Combobox = forwardRef(ComboboxImpl) as unknown as {
  (
    props: ComboboxOptionsProps & React.RefAttributes<HTMLDivElement>,
  ): React.ReactElement;
  (
    props: ComboboxAsyncOptionsProps & React.RefAttributes<HTMLDivElement>,
  ): React.ReactElement;
  <T extends { id: Key }>(
    props: ComboboxItemsProps<T> & React.RefAttributes<HTMLDivElement>,
  ): React.ReactElement;
  <T extends { id: Key }>(
    props: ComboboxAsyncItemsProps<T> & React.RefAttributes<HTMLDivElement>,
  ): React.ReactElement;
  (
    props: ComboboxStaticProps & React.RefAttributes<HTMLDivElement>,
  ): React.ReactElement;
  (
    props: ComboboxServerOptionsProps & React.RefAttributes<HTMLDivElement>,
  ): React.ReactElement;
  <T extends ComboboxServerItem>(
    props: ComboboxServerItemsProps<T> & React.RefAttributes<HTMLDivElement>,
  ): React.ReactElement;
  displayName?: string;
};

Combobox.displayName = 'Combobox';
