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
import { Select as AriaSelect } from 'react-aria-components';
import type {
  CollectionItem,
  NormalizedOption,
} from '../../types/selectableCollection';
import type { Key } from 'react-aria-components';
import type { ChangeValueType } from 'react-stately/useSelectState';
import type { SelectContentOwnProps, SelectProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { SelectDefinition } from './definition';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import { Popover } from '../Popover';
import { SelectTrigger } from './SelectTrigger';
import { SelectContent } from './SelectContent';
import {
  useCollectionAdapter,
  type CollectionAdapterResult,
} from '../../hooks/useCollectionAdapter';
import { useTrackedSelectionKeys } from '../../hooks/useTrackedSelectionKeys';
import {
  getItemKeys,
  resolveCollectionSource,
  toSelection,
} from '../../utils/selectableCollection';

function resolveSelectSearch<T extends CollectionItem>({
  search,
  searchable,
  searchPlaceholder,
}: {
  search?: SelectContentOwnProps<T>['search'];
  searchable?: boolean;
  searchPlaceholder?: string;
}): SelectContentOwnProps<T>['search'] {
  if (search !== undefined) {
    return search;
  }

  if (searchable) {
    return { placeholder: searchPlaceholder };
  }

  return undefined;
}

function resolveContentSearch<T extends CollectionItem>(
  search: SelectContentOwnProps<T>['search'],
  collection: CollectionAdapterResult<T>,
): SelectContentOwnProps<T>['search'] {
  if (typeof search !== 'object') {
    return search;
  }

  return {
    ...search,
    inputValue: collection.inputValue,
    defaultInputValue: collection.defaultInputValue,
    onInputChange: collection.onInputChange,
  } as SelectContentOwnProps<T>['search'];
}

function getRetainedOptions<T extends CollectionItem>(
  flatOptions: NormalizedOption[] | undefined,
  canonicalItems: T[],
) {
  if (!flatOptions) {
    return undefined;
  }

  const sourceIds = getItemKeys(flatOptions);
  return canonicalItems.filter(item => !sourceIds.has(item.id));
}

/**
 * A dropdown picker for selecting one or multiple options from a list, with optional search filtering and inline error display.
 *
 * @public
 */
function SelectImpl<
  M extends 'single' | 'multiple' = 'single' | 'multiple',
  T extends CollectionItem = NormalizedOption,
>(props: SelectProps<M, T>, ref: React.ForwardedRef<HTMLDivElement>) {
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
    search,
    loading,
    items,
    children,
    dependencies,
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
  const resolvedSearch = resolveSelectSearch<T>({
    search: search as SelectContentOwnProps<T>['search'],
    searchable,
    searchPlaceholder,
  });
  const collectionSource = resolveCollectionSource<T>({ options, items });
  const controlledValue =
    restProps.value !== undefined ? restProps.value : restProps.selectedKey;
  const defaultValue =
    restProps.defaultValue !== undefined
      ? restProps.defaultValue
      : restProps.defaultSelectedKey;
  const trackedSelection = useTrackedSelectionKeys({
    selectedKeys:
      controlledValue === undefined ? undefined : toSelection(controlledValue),
    defaultSelectedKeys: toSelection(defaultValue),
  });
  const collection = useCollectionAdapter({
    items: collectionSource.source,
    selectedKeys: trackedSelection.selectedKeys,
    search: resolvedSearch,
    loading,
  });
  const retainedOptions = getRetainedOptions(
    collectionSource.flatOptions,
    collection.canonicalItems,
  );
  const renderedItems = collectionSource.rendersItems
    ? collection.canonicalItems
    : undefined;
  const contentSearch = resolveContentSearch(resolvedSearch, collection);
  const handleChange = (value: ChangeValueType<M>) => {
    trackedSelection.onSelectionChange(toSelection(value));
    restProps.onChange?.(value);
  };

  return (
    <AriaSelect
      className={classes.root}
      {...dataAttributes}
      ref={ref}
      {...restProps}
      onChange={handleChange}
      allowsEmptyCollection
    >
      <FieldLabel
        label={label}
        secondaryLabel={secondaryLabelText}
        description={description}
        descriptionSlot="description"
      />
      <SelectTrigger icon={icon} />
      <FieldError />
      <Popover className={classes.popover} hideArrow {...dataAttributes}>
        <SelectContent
          search={contentSearch}
          options={collectionSource.options}
          items={renderedItems}
          dependencies={dependencies}
          loading={collection.loading}
          isStale={collection.isStale}
          visibleIds={collection.visibleIds}
          retainedOptions={
            retainedOptions as unknown as ReadonlyArray<NormalizedOption>
          }
        >
          {children}
        </SelectContent>
      </Popover>
    </AriaSelect>
  );
}

/** @public */
export const Select = forwardRef(SelectImpl) as {
  <
    M extends 'single' | 'multiple' = 'single' | 'multiple',
    T extends { id: Key } = NormalizedOption,
  >(
    props: SelectProps<M, T> & React.RefAttributes<HTMLDivElement>,
  ): React.ReactElement | null;
  displayName?: string;
};

Select.displayName = 'Select';
