/*
 * Copyright 2025 The Backstage Authors
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

import {
  Collection,
  Header,
  ListBox,
  ListBoxLoadMoreItem,
  ListBoxSection,
  Text,
} from 'react-aria-components';
import clsx from 'clsx';
import { useDefinition } from '../../hooks/useDefinition';
import {
  SelectItemTextDefinition,
  SelectListBoxDefinition,
  SelectListBoxItemDefinition,
  SelectSectionDefinition,
} from './definition';
import { normalizeOptions } from '../../utils/selectableCollection';
import type {
  CollectionItem,
  LoadingConfig,
  NormalizedOption,
  NormalizedOptionSection,
} from '../../types/selectableCollection';
import type { SelectListBoxOwnProps } from './types';
import { SelectItem } from './SelectItem';
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
  const { ownProps } = useDefinition(SelectListBoxDefinition, {});
  const { classes } = ownProps;

  return <div className={classes.noResults}>No results found.</div>;
};

function PlainOptionItem({ option }: { option: NormalizedOption }) {
  const { ownProps } = useDefinition(SelectItemTextDefinition, {
    title: option.label,
    description: option.description,
    leadingIcon: option.leadingIcon,
  });
  const { classes } = ownProps;
  // Keep the original plain-option label class available for existing themes.
  const {
    ownProps: { classes: legacyOptionClasses },
  } = useDefinition(SelectListBoxItemDefinition, {});

  return (
    <SelectItem
      id={option.id}
      value={option}
      className={classes.root}
      textValue={option.label}
      isDisabled={option.disabled}
      showSelectionIndicator
    >
      <div className={classes.content}>
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
      </div>
    </SelectItem>
  );
}

function SelectSectionItems({ section }: { section: NormalizedOptionSection }) {
  const { ownProps } = useDefinition(SelectSectionDefinition, {});
  const { classes } = ownProps;

  return (
    <ListBoxSection className={classes.root}>
      <Header className={classes.header}>{section.title}</Header>
      {section.options.map(option => (
        <PlainOptionItem key={option.id} option={option} />
      ))}
    </ListBoxSection>
  );
}

function renderSelectOption(item: NormalizedOption | NormalizedOptionSection) {
  if ('options' in item) {
    return <SelectSectionItems key={item.title} section={item} />;
  }

  return <PlainOptionItem key={item.id} option={item} />;
}

function SelectCollection<T extends CollectionItem>({
  normalizedOptions,
  retainedOptions,
  items,
  children,
  dependencies,
}: {
  normalizedOptions?: Array<NormalizedOption | NormalizedOptionSection>;
  retainedOptions?: ReadonlyArray<NormalizedOption>;
  items?: Iterable<T>;
  children?: React.ReactNode | ((item: T) => React.ReactElement);
  dependencies?: ReadonlyArray<unknown>;
}) {
  if (normalizedOptions) {
    return (
      <>
        {normalizedOptions.map(renderSelectOption)}
        {Array.from(retainedOptions ?? [], option => (
          <PlainOptionItem key={option.id} option={option} />
        ))}
      </>
    );
  }

  if (items) {
    const renderItem = (item: T) => {
      if (typeof children === 'function') {
        return children(item);
      }

      return <PlainOptionItem option={item as unknown as NormalizedOption} />;
    };

    return (
      <Collection items={items} dependencies={dependencies}>
        {renderItem}
      </Collection>
    );
  }

  return children as React.ReactNode;
}

function SelectEmptyState({
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

function SelectLoadMoreIndicator({
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

export function SelectListBox<T extends CollectionItem = NormalizedOption>(
  props: SelectListBoxOwnProps<T>,
) {
  const { ownProps } = useDefinition(SelectListBoxDefinition, props);
  const {
    classes,
    options,
    items,
    children,
    dependencies,
    loading,
    isStale,
    retainedOptions,
  } = ownProps;
  const normalizedOptions = options && normalizeOptions(options);
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
        <SelectEmptyState
          isLoading={isCollectionLoading}
          className={classes.loading}
          rowClassName={classes.loadingRow}
        />
      )}
    >
      <SelectCollection
        normalizedOptions={normalizedOptions}
        retainedOptions={retainedOptions}
        items={items}
        dependencies={dependencies}
      >
        {children}
      </SelectCollection>
      <SelectLoadMoreIndicator
        loading={loading}
        isCollectionLoading={isCollectionLoading}
        isIndicatorVisible={showLoadMoreIndicator}
        className={classes.loading}
        rowClassName={classes.loadingRow}
      />
    </ListBox>
  );

  return <div aria-busy={isBusy || undefined}>{listBox}</div>;
}
