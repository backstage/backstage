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

import { cloneElement, useContext } from 'react';
import {
  Collection,
  ComboBoxStateContext,
  Header,
  ListBox,
  ListBoxLoadMoreItem,
  ListBoxSection,
  SelectableCollectionContext,
  Text,
} from 'react-aria-components';
import { useFilter } from 'react-aria';
import clsx from 'clsx';
import { useDefinition } from '../../hooks/useDefinition';
import { normalizeOptions } from '../../utils/selectableCollection';
import { ComboboxItem } from './ComboboxItem';
import {
  ComboboxItemTextDefinition,
  ComboboxListBoxDefinition,
  ComboboxListBoxItemDefinition,
  ComboboxSectionDefinition,
} from './definition';
import type {
  CollectionItem,
  LoadingConfig,
  NormalizedOption,
  NormalizedOptionSection,
} from '../../types/selectableCollection';
import type { ComboboxListBoxOwnProps } from './types';
import type { Node } from '@react-types/shared';
import { Skeleton } from '../Skeleton';
import { useDelayedVisibility } from '../../hooks/useDelayedVisibility';

const loadingRowWidths = ['70%', '55%', '65%'];
const loadingIndicatorDelayMs = 300;

function LoadingRows({
  count,
  className,
  rowClassName,
}: {
  count: number;
  className: string;
  rowClassName: string;
}) {
  return (
    <div className={className} aria-hidden="true">
      {loadingRowWidths.slice(0, count).map(width => (
        <div key={width} className={rowClassName}>
          <Skeleton width={width} height="0.75rem" />
        </div>
      ))}
    </div>
  );
}

const NoResults = () => {
  const { ownProps } = useDefinition(ComboboxListBoxDefinition, {});
  const { classes } = ownProps;

  return <div className={classes.noResults}>No results found.</div>;
};

function ComboboxOptionItem({ option }: { option: NormalizedOption }) {
  const { ownProps } = useDefinition(ComboboxItemTextDefinition, {
    title: option.label,
    description: option.description,
    leadingIcon: option.leadingIcon,
  });
  const { classes } = ownProps;
  const {
    ownProps: { classes: legacyOptionClasses },
  } = useDefinition(ComboboxListBoxItemDefinition, {});

  return (
    <ComboboxItem
      id={option.id}
      value={option}
      className={classes.root}
      textValue={option.label}
      isDisabled={option.disabled}
      showSelectionIndicator
    >
      {option.leadingIcon && (
        <div className={classes.leadingIcon}>{option.leadingIcon}</div>
      )}
      <div className={classes.text}>
        <Text
          slot="label"
          className={clsx(classes.title, legacyOptionClasses.label)}
        >
          {option.label}
        </Text>
        {option.description && (
          <Text slot="description" className={classes.description}>
            {option.description}
          </Text>
        )}
      </div>
    </ComboboxItem>
  );
}

function ComboboxSectionItems({
  section,
}: {
  section: NormalizedOptionSection;
}) {
  const { ownProps } = useDefinition(ComboboxSectionDefinition, {});
  const { classes } = ownProps;

  return (
    <ListBoxSection className={classes.root}>
      <Header className={classes.header}>{section.title}</Header>
      {section.options.map(option => (
        <ComboboxOptionItem key={option.id} option={option} />
      ))}
    </ListBoxSection>
  );
}

function renderComboboxOption(
  item: NormalizedOption | NormalizedOptionSection,
) {
  if ('options' in item) {
    return <ComboboxSectionItems key={item.title} section={item} />;
  }

  return <ComboboxOptionItem key={item.id} option={item} />;
}

function getCollectionFilter<T extends CollectionItem>({
  search,
  hasItems,
  inputValue,
  contains,
}: {
  search?: ComboboxListBoxOwnProps<T>['search'];
  hasItems: boolean;
  inputValue: string;
  contains: (textValue: string, inputValue: string) => boolean;
}) {
  const searchProps = typeof search === 'object' ? search : undefined;
  if (searchProps?.mode === 'server') {
    return undefined;
  }

  const customFilter = searchProps?.filter;
  if (customFilter) {
    return (_textValue: string, node: Node<T>) =>
      customFilter(node.value as T, inputValue);
  }

  if (search || hasItems) {
    return (textValue: string) => contains(textValue, inputValue);
  }

  return undefined;
}

function ComboboxCollection<T extends CollectionItem>({
  normalizedOptions,
  items,
  children,
  dependencies,
  getItemTextValue,
}: {
  normalizedOptions?: Array<NormalizedOption | NormalizedOptionSection>;
  items?: Iterable<T>;
  children?: React.ReactNode | ((item: T) => React.ReactElement);
  dependencies?: ReadonlyArray<unknown>;
  getItemTextValue?: (item: T) => string;
}) {
  if (normalizedOptions) {
    return <>{normalizedOptions.map(renderComboboxOption)}</>;
  }

  if (items) {
    const renderItemWithTextValue = (item: T) => {
      let renderedItem: React.ReactElement;
      if (typeof children === 'function') {
        renderedItem = children(item);
      } else {
        renderedItem = (
          <ComboboxOptionItem option={item as unknown as NormalizedOption} />
        );
      }

      if (!getItemTextValue) {
        return renderedItem;
      }

      return cloneElement(renderedItem, {
        textValue: getItemTextValue(item),
      });
    };

    return (
      <Collection items={items} dependencies={dependencies}>
        {renderItemWithTextValue}
      </Collection>
    );
  }

  return children as React.ReactNode;
}

function ComboboxEmptyState({
  isLoading,
  className,
  rowClassName,
}: {
  isLoading: boolean;
  className: string;
  rowClassName: string;
}) {
  if (!isLoading) {
    return <NoResults />;
  }

  return (
    <LoadingRows count={3} className={className} rowClassName={rowClassName} />
  );
}

function ComboboxLoadMoreIndicator({
  loading,
  isCollectionLoading,
  isIndicatorVisible,
  className,
  rowClassName,
}: {
  loading?: LoadingConfig;
  isCollectionLoading: boolean;
  isIndicatorVisible: boolean;
  className: string;
  rowClassName: string;
}) {
  if (!loading?.onLoadMore || isCollectionLoading) {
    return null;
  }

  const onLoadMore =
    loading.state === 'loadingMore' ? undefined : loading.onLoadMore;

  return (
    <ListBoxLoadMoreItem
      isLoading={isIndicatorVisible}
      onLoadMore={onLoadMore}
      scrollOffset={0}
    >
      <LoadingRows
        count={1}
        className={className}
        rowClassName={rowClassName}
      />
    </ListBoxLoadMoreItem>
  );
}

export function ComboboxListBox<T extends CollectionItem>(
  props: ComboboxListBoxOwnProps<T>,
) {
  const { ownProps } = useDefinition(ComboboxListBoxDefinition, props);
  const {
    classes,
    options,
    items,
    children,
    dependencies,
    search,
    loading,
    isStale,
    getItemTextValue,
  } = ownProps;
  const normalizedOptions = options && normalizeOptions(options);
  const state = useContext(ComboBoxStateContext);
  const { contains } = useFilter({ sensitivity: 'base' });
  const inputValue = state?.inputValue ?? '';
  const filter = getCollectionFilter({
    search,
    hasItems: items !== undefined,
    inputValue,
    contains,
  });
  const isCollectionLoading =
    loading?.state === 'loading' ||
    loading?.state === 'filtering' ||
    loading?.state === 'sorting';
  const isBusy = isCollectionLoading || loading?.state === 'loadingMore';
  const showStale = useDelayedVisibility(
    isStale ?? false,
    loadingIndicatorDelayMs,
  );
  const showLoadMoreIndicator = useDelayedVisibility(
    loading?.state === 'loadingMore',
    loadingIndicatorDelayMs,
  );

  const listBox = (
    <ListBox
      className={classes.root}
      data-stale={showStale || undefined}
      renderEmptyState={() => (
        <ComboboxEmptyState
          isLoading={isCollectionLoading}
          className={classes.loading}
          rowClassName={classes.loadingRow}
        />
      )}
    >
      <ComboboxCollection
        normalizedOptions={normalizedOptions}
        items={items}
        dependencies={dependencies}
        getItemTextValue={getItemTextValue}
      >
        {children}
      </ComboboxCollection>
      <ComboboxLoadMoreIndicator
        loading={loading}
        isCollectionLoading={isCollectionLoading}
        isIndicatorVisible={showLoadMoreIndicator}
        className={classes.loading}
        rowClassName={classes.loadingRow}
      />
    </ListBox>
  );

  const busyListBox = <div aria-busy={isBusy || undefined}>{listBox}</div>;

  if (!filter) {
    return busyListBox;
  }

  return (
    <SelectableCollectionContext.Provider value={{ filter }}>
      {busyListBox}
    </SelectableCollectionContext.Provider>
  );
}
