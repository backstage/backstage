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

import type { Breakpoint } from '../..';
import type { ReactElement, ReactNode } from 'react';
import type {
  ListBoxItemProps,
  ListBoxItemRenderProps,
  SelectProps as AriaSelectProps,
} from 'react-aria-components';
import type { FieldLabelProps } from '../FieldLabel/types';
import type {
  AsyncListSource,
  CollectionItem,
  IdentifiedOption,
  LoadingConfig,
  NormalizedOption,
  Option,
  OptionSection,
} from '../../types/selectableCollection';
import type { Key } from 'react-aria-components';

export type { Option, OptionSection };

/** @public */
export type SelectSearch<T> =
  | true
  | {
      mode?: 'client';
      inputValue?: never;
      defaultInputValue?: string;
      onInputChange?: (value: string) => void;
      filter?: (item: T, query: string) => boolean;
      placeholder?: string;
    }
  | {
      mode?: 'client';
      inputValue: string;
      defaultInputValue?: never;
      onInputChange: (value: string) => void;
      filter?: (item: T, query: string) => boolean;
      placeholder?: string;
    }
  | {
      mode: 'server';
      inputValue: string;
      defaultInputValue?: never;
      onInputChange: (value: string) => void;
      filter?: never;
      placeholder?: string;
    };

/** @public */
export type SelectAsyncSearch<T> =
  | true
  | {
      mode?: 'client';
      inputValue?: never;
      defaultInputValue?: string;
      onInputChange?: (value: string) => void;
      filter?: (item: T, query: string) => boolean;
      placeholder?: string;
    }
  | {
      mode?: 'client';
      inputValue: string;
      defaultInputValue?: never;
      onInputChange: (value: string) => void;
      filter?: (item: T, query: string) => boolean;
      placeholder?: string;
    }
  | {
      mode: 'server';
      inputValue?: never;
      defaultInputValue?: never;
      onInputChange?: never;
      filter?: never;
      placeholder?: string;
    };

/** @public */
export type SelectStaticSearch =
  | true
  | {
      mode?: 'client';
      inputValue?: never;
      defaultInputValue?: string;
      onInputChange?: (value: string) => void;
      filter?: never;
      placeholder?: string;
    }
  | {
      mode?: 'client';
      inputValue: string;
      defaultInputValue?: never;
      onInputChange: (value: string) => void;
      filter?: never;
      placeholder?: string;
    };

/** @public */
export type SelectBaseOwnProps = {
  /**
   * An icon to render before the input
   */
  icon?: ReactNode;

  /**
   * The size of the select field
   * @defaultValue 'small'
   */
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;

  label?: FieldLabelProps['label'];
  secondaryLabel?: FieldLabelProps['secondaryLabel'];
  description?: FieldLabelProps['description'];
  isRequired?: boolean;
  className?: string;
};

/** @public */
export type SelectOwnProps = SelectBaseOwnProps & {
  options?:
    | ReadonlyArray<Option | OptionSection>
    | AsyncListSource<IdentifiedOption>;
  items?: Iterable<{ id: Key }> | AsyncListSource<{ id: Key }>;
  children?:
    | ReactElement
    | ReactElement[]
    | ((item: { id: Key }) => ReactElement);
  dependencies?: ReadonlyArray<unknown>;
  search?: SelectSearch<{ id: Key }> | SelectAsyncSearch<{ id: Key }>;
  searchable?: boolean;
  searchPlaceholder?: string;
  loading?: LoadingConfig;
};

/** @public */
export type SelectCommonProps<
  T extends { id: Key },
  M extends 'single' | 'multiple' = 'single' | 'multiple',
> = SelectBaseOwnProps &
  Omit<AriaSelectProps<T, M>, keyof SelectOwnProps | 'defaultItems'> & {
    /**
     * Selection mode, single or multiple
     * @defaultvalue 'single'
     */
    selectionMode?: M;
  };

/** @public */
export type SelectOptionsProps<
  M extends 'single' | 'multiple' = 'single' | 'multiple',
> = SelectCommonProps<NormalizedOption, M> & {
  options?: ReadonlyArray<Option | OptionSection>;
  items?: never;
  children?: never;
  dependencies?: never;
  loading?: LoadingConfig;
} & (
    | {
        search?: SelectSearch<NormalizedOption>;
        searchable?: never;
        searchPlaceholder?: never;
      }
    | {
        search?: never;
        /** @deprecated Use search instead. */
        searchable?: boolean;
        /** @deprecated Use search.placeholder instead. */
        searchPlaceholder?: string;
      }
  );

/** @public */
export type SelectAsyncOptionsProps<
  M extends 'single' | 'multiple' = 'single' | 'multiple',
> = SelectCommonProps<NormalizedOption, M> & {
  options: AsyncListSource<IdentifiedOption>;
  items?: never;
  children?: never;
  dependencies?: never;
  loading?: never;
  search?: SelectAsyncSearch<NormalizedOption>;
  searchable?: never;
  searchPlaceholder?: never;
};

/** @public */
export type SelectItemsProps<
  T extends { id: Key },
  M extends 'single' | 'multiple' = 'single' | 'multiple',
> = SelectCommonProps<T, M> & {
  options?: never;
  items: Iterable<T>;
  children: (item: T) => ReactElement;
  dependencies?: ReadonlyArray<unknown>;
  loading?: LoadingConfig;
  search?: SelectSearch<T>;
  searchable?: never;
  searchPlaceholder?: never;
};

/** @public */
export type SelectAsyncItemsProps<
  T extends { id: Key },
  M extends 'single' | 'multiple' = 'single' | 'multiple',
> = SelectCommonProps<T, M> & {
  options?: never;
  items: AsyncListSource<T>;
  children: (item: T) => ReactElement;
  dependencies?: ReadonlyArray<unknown>;
  loading?: never;
  search?: SelectAsyncSearch<T>;
  searchable?: never;
  searchPlaceholder?: never;
};

/** @public */
export type SelectStaticProps<
  M extends 'single' | 'multiple' = 'single' | 'multiple',
> = SelectCommonProps<NormalizedOption, M> & {
  options?: never;
  items?: never;
  children: ReactElement | ReactElement[];
  dependencies?: never;
  search?: SelectStaticSearch;
  searchable?: never;
  searchPlaceholder?: never;
  loading?: never;
};

/** @public */
export type SelectProps<
  M extends 'single' | 'multiple' = 'single' | 'multiple',
  T extends { id: Key } = NormalizedOption,
> =
  | SelectOptionsProps<M>
  | SelectAsyncOptionsProps<M>
  | SelectItemsProps<T, M>
  | SelectAsyncItemsProps<T, M>
  | SelectStaticProps<M>;

/** @internal */
export interface SelectTriggerOwnProps {
  icon?: SelectOwnProps['icon'];
}

/** @internal */
export interface SelectContentOwnProps<
  T extends CollectionItem = NormalizedOption,
> {
  search?: SelectSearch<T> | SelectAsyncSearch<T> | SelectStaticSearch;
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
