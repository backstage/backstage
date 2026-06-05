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

import { Breakpoint } from '../..';
import type { ReactElement, ReactNode } from 'react';
import type {
  ListBoxItemProps,
  ListBoxItemRenderProps,
  SelectProps as AriaSelectProps,
} from 'react-aria-components';
import type { FieldLabelProps } from '../FieldLabel/types';
import type {
  AsyncListSource,
  ClientSearch,
  CollectionItem,
  DerivedServerSearch,
  IdentifiedOption,
  LoadingConfig,
  ManualServerSearch,
  NormalizedOption,
  Option,
  OptionSection,
  StaticCompositionSearch,
} from '../../types/selectableCollection';
import type { Key } from 'react-aria-components';

export type { Option, OptionSection };

type SelectSearchAppearance = {
  placeholder?: string;
};

/** @public */
export type SelectSearch<T> =
  | true
  | ClientSearch<T, SelectSearchAppearance>
  | (ManualServerSearch & SelectSearchAppearance);

/** @public */
export type SelectAsyncSearch<T> =
  | true
  | ClientSearch<T, SelectSearchAppearance>
  | (DerivedServerSearch & SelectSearchAppearance);

/** @public */
export type SelectOwnProps = {
  /**
   * An icon to render before the input
   */
  icon?: ReactNode;

  /**
   * The size of the select field
   * @defaultValue 'small'
   */
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;

  /**
   * The options of the select field. Pass flat options, option sections for
   * grouped display, or a mix of both in the same array.
   */
  options?:
    | ReadonlyArray<Option | OptionSection>
    | AsyncListSource<IdentifiedOption>;

  /**
   * Items to render using the child render function.
   */
  items?: Iterable<{ id: Key }> | AsyncListSource<{ id: Key }>;

  /**
   * Static item components or a render function for items.
   */
  children?:
    | ReactElement
    | ReactElement[]
    | ((item: { id: Key }) => ReactElement);

  /**
   * Values that invalidate cached dynamic item rendering when changed.
   */
  dependencies?: ReadonlyArray<unknown>;

  /**
   * Configure optional search behavior in the dropdown.
   */
  search?: SelectSearch<{ id: Key }> | SelectAsyncSearch<{ id: Key }>;

  /**
   * Enable search/filter functionality in the dropdown
   * @defaultValue false
   * @deprecated Use search instead.
   */
  searchable?: boolean;

  /**
   * placeholder text for the search input
   * only used when searchable is true
   * @defaultvalue 'search...'
   * @deprecated Use search.placeholder instead.
   */
  searchPlaceholder?: string;

  /**
   * Configure manual loading state for non-async collection sources.
   */
  loading?: LoadingConfig;

  label?: FieldLabelProps['label'];
  secondaryLabel?: FieldLabelProps['secondaryLabel'];
  description?: FieldLabelProps['description'];
  isRequired?: boolean;
  className?: string;
};

type SelectNestedSearchProps<T> = {
  search?: SelectSearch<T>;
  searchable?: never;
  searchPlaceholder?: never;
};

type SelectAsyncNestedSearchProps<T> = {
  search?: SelectAsyncSearch<T>;
  searchable?: never;
  searchPlaceholder?: never;
};

type SelectDeprecatedSearchProps = {
  search?: never;
  /** @deprecated Use search instead. */
  searchable?: boolean;
  /** @deprecated Use search.placeholder instead. */
  searchPlaceholder?: string;
};

type SelectPlainOptionsProps = {
  options?: ReadonlyArray<Option | OptionSection>;
  items?: never;
  children?: never;
  dependencies?: never;
  loading?: LoadingConfig;
} & (SelectNestedSearchProps<NormalizedOption> | SelectDeprecatedSearchProps);

type SelectAsyncOptionsProps = {
  options: AsyncListSource<IdentifiedOption>;
  items?: never;
  children?: never;
  dependencies?: never;
  loading?: never;
} & SelectAsyncNestedSearchProps<NormalizedOption>;

type SelectDynamicItemsProps<T extends { id: Key }> = {
  options?: never;
  items: Iterable<T>;
  children: (item: T) => ReactElement;
  dependencies?: ReadonlyArray<unknown>;
  loading?: LoadingConfig;
} & SelectNestedSearchProps<T>;

type SelectAsyncItemsProps<T extends { id: Key }> = {
  options?: never;
  items: AsyncListSource<T>;
  children: (item: T) => ReactElement;
  dependencies?: ReadonlyArray<unknown>;
  loading?: never;
} & SelectAsyncNestedSearchProps<T>;

type SelectStaticCompositionProps = {
  options?: never;
  items?: never;
  children: ReactElement | ReactElement[];
  dependencies?: never;
  search?: StaticCompositionSearch<{ placeholder?: string }>;
  searchable?: never;
  searchPlaceholder?: never;
  loading?: never;
};

type SelectCollectionProps<T extends { id: Key }> =
  | SelectPlainOptionsProps
  | SelectAsyncOptionsProps
  | SelectDynamicItemsProps<T>
  | SelectAsyncItemsProps<T>
  | SelectStaticCompositionProps;

/** @public */
export type SelectProps<
  M extends 'single' | 'multiple' = 'single' | 'multiple',
  T extends { id: Key } = NormalizedOption,
> = Omit<
  SelectOwnProps,
  | 'options'
  | 'items'
  | 'children'
  | 'dependencies'
  | 'search'
  | 'searchable'
  | 'searchPlaceholder'
  | 'loading'
> &
  SelectCollectionProps<T> &
  Omit<
    AriaSelectProps<T, M>,
    keyof SelectOwnProps | 'children' | 'dependencies'
  > & {
    /**
     * Selection mode, single or multiple
     * @defaultvalue 'single'
     */
    selectionMode?: M;
  };

/** @internal */
export interface SelectTriggerOwnProps {
  icon?: SelectOwnProps['icon'];
}

/** @internal */
export interface SelectContentOwnProps<
  T extends CollectionItem = NormalizedOption,
> {
  search?:
    | SelectSearch<T>
    | SelectAsyncSearch<T>
    | StaticCompositionSearch<{ placeholder?: string }>;
  options?: ReadonlyArray<Option | OptionSection>;
  items?: Iterable<T>;
  children?: ReactElement | ReactElement[] | ((item: T) => ReactElement);
  dependencies?: ReadonlyArray<unknown>;
  loading?: LoadingConfig;
  isStale?: boolean;
  visibleIds?: Set<Key>;
  retainedOptions?: ReadonlyArray<NormalizedOption>;
}

/** @internal */
export interface SelectListBoxOwnProps<
  T extends CollectionItem = NormalizedOption,
> {
  options?: ReadonlyArray<Option | OptionSection>;
  items?: Iterable<T>;
  children?: ReactElement | ReactElement[] | ((item: T) => ReactElement);
  dependencies?: ReadonlyArray<unknown>;
  loading?: LoadingConfig;
  isStale?: boolean;
  retainedOptions?: ReadonlyArray<NormalizedOption>;
}

/** @internal */
export type SelectListBoxItemOwnProps = {};

/** @public */
export type SelectItemOwnProps = {
  children: ReactNode | ((values: ListBoxItemRenderProps) => ReactNode);
  /**
   * Show the built-in selection indicator and standard item content layout.
   */
  showSelectionIndicator?: boolean;
  className?: string;
};

/** @public */
export type SelectItemProps<T extends object = object> = SelectItemOwnProps &
  Omit<ListBoxItemProps<T>, keyof SelectItemOwnProps | 'textValue'> & {
    textValue: string;
  };

/** @public */
export type SelectItemTextOwnProps = {
  title: string;
  description?: string;
  leadingIcon?: ReactNode;
  className?: string;
};

/** @public */
export type SelectItemTextProps<T extends object = object> =
  SelectItemTextOwnProps &
    Omit<
      SelectItemProps<T>,
      | keyof SelectItemTextOwnProps
      | 'children'
      | 'textValue'
      | 'showSelectionIndicator'
    >;

/** @public */
export type SelectItemProfileOwnProps = {
  name: string;
  src?: string;
  className?: string;
};

/** @public */
export type SelectItemProfileProps<T extends object = object> =
  SelectItemProfileOwnProps &
    Omit<
      SelectItemProps<T>,
      | keyof SelectItemProfileOwnProps
      | 'children'
      | 'textValue'
      | 'showSelectionIndicator'
    >;

/** @internal */
export type SelectSectionOwnProps = {};
