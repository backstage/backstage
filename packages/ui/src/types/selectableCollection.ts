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

import type { ReactElement, ReactNode } from 'react';
import type { Key } from 'react-aria-components';
import type { AsyncListData } from 'react-stately/useAsyncList';

/** @public */
export type LoadingState = AsyncListData<unknown>['loadingState'];

/** @public */
export type AsyncListSource<T> = Pick<
  AsyncListData<T>,
  'items' | 'filterText' | 'setFilterText' | 'loadingState' | 'loadMore'
>;

/** @internal */
export type CollectionItem = { id: Key };

/** @public */
export type LoadingConfig = {
  state: LoadingState;
  onLoadMore?: () => void;
};

/** @internal */
export type ClientSearch<T, TExtra extends object = object> =
  | ({
      mode?: 'client';
      inputValue?: never;
      defaultInputValue?: string;
      onInputChange?: (value: string) => void;
      filter?: (item: T, query: string) => boolean;
    } & TExtra)
  | ({
      mode?: 'client';
      inputValue: string;
      defaultInputValue?: never;
      onInputChange: (value: string) => void;
      filter?: (item: T, query: string) => boolean;
    } & TExtra);

/** @internal */
export type StaticCompositionSearch<TExtra extends object = object> =
  | true
  | ({
      mode?: 'client';
      inputValue?: never;
      defaultInputValue?: string;
      onInputChange?: (value: string) => void;
      filter?: never;
    } & TExtra)
  | ({
      mode?: 'client';
      inputValue: string;
      defaultInputValue?: never;
      onInputChange: (value: string) => void;
      filter?: never;
    } & TExtra);

/** @internal */
export type ManualServerSearch = {
  mode: 'server';
  inputValue: string;
  defaultInputValue?: never;
  onInputChange: (value: string) => void;
  filter?: never;
};

/** @internal */
export type DerivedServerSearch = {
  mode: 'server';
  inputValue?: never;
  defaultInputValue?: never;
  onInputChange?: never;
  filter?: never;
};

/** @internal */
export type PlainStaticOptionsCollection<TOption> = {
  options?: ReadonlyArray<TOption>;
  items?: never;
  children?: never;
};

/** @internal */
export type PlainAsyncOptionsCollection<TOption> = {
  options: AsyncListSource<TOption>;
  items?: never;
  children?: never;
};

/** @internal */
export type DynamicItemsCollection<T extends CollectionItem> = {
  options?: never;
  items: Iterable<T> | AsyncListSource<T>;
  children: (item: T) => ReactElement;
};

/** @internal */
export type StaticItemsCollection = {
  options?: never;
  items?: never;
  children: ReactElement | ReactElement[];
};

/** @public */
export type IdentifiedOption = {
  id: string;
  value?: never;
  label: string;
  description?: string;
  leadingIcon?: ReactNode;
  disabled?: boolean;
};

/** @public */
export type LegacyOption = {
  /** @deprecated Use id instead. */
  value: string;
  id?: never;
  label: string;
  description?: never;
  leadingIcon?: never;
  disabled?: boolean;
};

/** @public */
export type Option = IdentifiedOption | LegacyOption;

/** @public */
export type OptionSection = {
  title: string;
  options: Option[];
};

/** @public */
export type NormalizedOption = Omit<IdentifiedOption, 'value'>;

/** @internal */
export type NormalizedOptionSection = {
  title: string;
  options: NormalizedOption[];
};
