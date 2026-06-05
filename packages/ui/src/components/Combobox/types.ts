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
import type {
  ComboBoxProps as AriaComboBoxProps,
  ListBoxItemProps as AriaListBoxItemProps,
  ListBoxItemRenderProps,
} from 'react-aria-components';
import type { Breakpoint } from '../..';
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

/** @public */
export type ComboboxServerItem = {
  id: Key;
  textValue: string;
};

/** @public */
export type ComboboxSearch<T> = true | ClientSearch<T> | ManualServerSearch;

/** @public */
export type ComboboxAsyncSearch<T> =
  | true
  | ClientSearch<T>
  | DerivedServerSearch;

/** @public */
export type ComboboxBaseOwnProps = {
  /**
   * An icon to render before the input
   */
  icon?: ReactNode;

  /**
   * The size of the combobox field
   * @defaultValue 'small'
   */
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;

  /**
   * Placeholder text for the input.
   */
  placeholder?: string;

  label?: FieldLabelProps['label'];
  secondaryLabel?: FieldLabelProps['secondaryLabel'];
  description?: FieldLabelProps['description'];
  isRequired?: boolean;
  className?: string;
};

/** @public */
export type ComboboxOwnProps<T extends { id: Key } = NormalizedOption> =
  ComboboxBaseOwnProps & {
    options?:
      | ReadonlyArray<Option | OptionSection>
      | AsyncListSource<IdentifiedOption>;
    items?: Iterable<T> | AsyncListSource<T>;
    children?: ReactElement | ReactElement[] | ((item: T) => ReactElement);
    dependencies?: ReadonlyArray<unknown>;
    search?: ComboboxSearch<T> | ComboboxAsyncSearch<T>;
    loading?: LoadingConfig;
  };

type ComboboxNestedSearchProps<T> = {
  search?: ComboboxSearch<T>;
  inputValue?: never;
  defaultInputValue?: never;
  onInputChange?: never;
  defaultFilter?: never;
};

type ComboboxAsyncClientNestedSearchProps<T> = {
  search?: Exclude<ComboboxAsyncSearch<T>, { mode: 'server' }>;
  inputValue?: never;
  defaultInputValue?: never;
  onInputChange?: never;
  defaultFilter?: never;
};

type ComboboxDerivedServerSearchProps = {
  search: Extract<ComboboxAsyncSearch<never>, { mode: 'server' }>;
  inputValue?: never;
  defaultInputValue?: never;
  onInputChange?: never;
  defaultFilter?: never;
};

type ComboboxStaticSearchProps = {
  search?: StaticCompositionSearch;
  inputValue?: never;
  defaultInputValue?: never;
  onInputChange?: never;
  defaultFilter?: never;
};

type ComboboxDeprecatedInputProps = {
  search?: never;
  /** @deprecated Use search.inputValue instead. */
  inputValue?: string;
  /** @deprecated Use search.defaultInputValue instead. */
  defaultInputValue?: string;
  /** @deprecated Use search.onInputChange instead. */
  onInputChange?: (value: string) => void;
  /** @deprecated Use search.filter instead. */
  defaultFilter?: (textValue: string, inputValue: string) => boolean;
};

type ComboboxKeySelectionProps<T extends { id: Key }> = Pick<
  AriaComboBoxProps<T>,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'selectedKey'
  | 'defaultSelectedKey'
  | 'onSelectionChange'
>;

type ComboboxItemSelectionProps<T extends { id: Key }> = {
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T | null) => void;
  selectedKey?: never;
  defaultSelectedKey?: never;
  onSelectionChange?: never;
};

type ComboboxPlainOptionsProps = {
  options?: ReadonlyArray<Option | OptionSection>;
  items?: never;
  children?: never;
  dependencies?: never;
  loading?: LoadingConfig;
} & (
  | ComboboxNestedSearchProps<NormalizedOption>
  | ComboboxDeprecatedInputProps
) &
  ComboboxKeySelectionProps<NormalizedOption>;

type ComboboxAsyncClientOptionsProps = {
  options: AsyncListSource<IdentifiedOption>;
  items?: never;
  children?: never;
  dependencies?: never;
  loading?: never;
} & ComboboxAsyncClientNestedSearchProps<NormalizedOption> &
  ComboboxKeySelectionProps<NormalizedOption>;

/** @internal */
export type ComboboxAsyncServerOptionsProps = {
  options: AsyncListSource<IdentifiedOption>;
  items?: never;
  children?: never;
  dependencies?: never;
  loading?: never;
} & ComboboxDerivedServerSearchProps &
  ComboboxItemSelectionProps<IdentifiedOption>;

type ComboboxDynamicItemsProps<T extends { id: Key }> = {
  options?: never;
  items: Iterable<T>;
  children: (item: T) => ReactElement;
  dependencies?: ReadonlyArray<unknown>;
  loading?: LoadingConfig;
} & ComboboxNestedSearchProps<T> &
  ComboboxKeySelectionProps<T>;

type ComboboxAsyncClientItemsProps<T extends { id: Key }> = {
  options?: never;
  items: AsyncListSource<T>;
  children: (item: T) => ReactElement;
  dependencies?: ReadonlyArray<unknown>;
  loading?: never;
} & ComboboxAsyncClientNestedSearchProps<T> &
  ComboboxKeySelectionProps<T>;

/** @internal */
export type ComboboxAsyncServerItemsProps<T extends ComboboxServerItem> = {
  options?: never;
  items: AsyncListSource<T>;
  children: (item: T) => ReactElement;
  dependencies?: ReadonlyArray<unknown>;
  loading?: never;
} & ComboboxDerivedServerSearchProps &
  ComboboxItemSelectionProps<T>;

type ComboboxStaticCompositionProps = {
  options?: never;
  items?: never;
  children: ReactElement | ReactElement[];
  dependencies?: never;
  loading?: never;
} & ComboboxStaticSearchProps &
  ComboboxKeySelectionProps<NormalizedOption>;

type ComboboxNonDirectAsyncCollectionProps<T extends { id: Key }> =
  | ComboboxPlainOptionsProps
  | ComboboxAsyncClientOptionsProps
  | ComboboxDynamicItemsProps<T>
  | ComboboxAsyncClientItemsProps<T>
  | ComboboxStaticCompositionProps;

/** @internal */
export type ComboboxAriaProps<T extends { id: Key }> = Omit<
  AriaComboBoxProps<T>,
  | keyof ComboboxOwnProps<T>
  | 'children'
  | 'items'
  | 'defaultItems'
  | 'search'
  | 'loading'
  | 'options'
  | 'inputValue'
  | 'defaultInputValue'
  | 'onInputChange'
  | 'defaultFilter'
  | 'dependencies'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'selectedKey'
  | 'defaultSelectedKey'
  | 'onSelectionChange'
>;

/** @internal */
export type ComboboxNonDirectAsyncProps<
  T extends { id: Key } = NormalizedOption,
> = ComboboxBaseOwnProps &
  ComboboxNonDirectAsyncCollectionProps<T> &
  ComboboxAriaProps<T>;

/** @internal */
export type ComboboxDirectAsyncOptionsProps = ComboboxBaseOwnProps &
  ComboboxAsyncServerOptionsProps &
  ComboboxAriaProps<IdentifiedOption>;

/** @internal */
export type ComboboxDirectAsyncItemsProps<T extends ComboboxServerItem> =
  ComboboxBaseOwnProps &
    ComboboxAsyncServerItemsProps<T> &
    ComboboxAriaProps<T>;

/** @public */
export type ComboboxProps<T extends { id: Key } = NormalizedOption> =
  | ComboboxNonDirectAsyncProps<T>
  | ComboboxDirectAsyncOptionsProps
  | (T extends ComboboxServerItem ? ComboboxDirectAsyncItemsProps<T> : never);

/** @internal */
export interface ComboboxInputOwnProps {
  icon?: ComboboxOwnProps['icon'];
  placeholder?: string;
}

/** @internal */
export type ComboboxListBoxOwnProps<T extends CollectionItem> = {
  options?: ReadonlyArray<Option | OptionSection>;
  items?: Iterable<T>;
  children?: ReactElement | ReactElement[] | ((item: T) => ReactElement);
  dependencies?: ReadonlyArray<unknown>;
  search?: ComboboxSearch<T> | ComboboxAsyncSearch<T> | StaticCompositionSearch;
  loading?: LoadingConfig;
  isStale?: boolean;
  getItemTextValue?: (item: T) => string;
};

/** @public */
export type ComboboxItemOwnProps = {
  children: ReactNode | ((values: ListBoxItemRenderProps) => ReactNode);
  textValue: string;
  /**
   * Show the built-in selection indicator and standard item content layout.
   */
  showSelectionIndicator?: boolean;
  className?: string;
};

/** @public */
export type ComboboxItemProps<T extends object = object> =
  ComboboxItemOwnProps &
    Omit<AriaListBoxItemProps<T>, keyof ComboboxItemOwnProps>;

/** @public */
export type ComboboxItemTextOwnProps = {
  title: string;
  description?: string;
  leadingIcon?: ReactNode;
  className?: string;
};

/** @public */
export type ComboboxItemTextProps<T extends object = object> =
  ComboboxItemTextOwnProps &
    Omit<
      ComboboxItemProps<T>,
      | keyof ComboboxItemTextOwnProps
      | 'children'
      | 'textValue'
      | 'showSelectionIndicator'
    >;

/** @public */
export type ComboboxItemProfileOwnProps = {
  name: string;
  src?: string;
  className?: string;
};

/** @public */
export type ComboboxItemProfileProps<T extends object = object> =
  ComboboxItemProfileOwnProps &
    Omit<
      ComboboxItemProps<T>,
      | keyof ComboboxItemProfileOwnProps
      | 'children'
      | 'textValue'
      | 'showSelectionIndicator'
    >;

/** @internal */
export type ComboboxListBoxItemOwnProps = {};

/** @internal */
export type ComboboxSectionOwnProps = {};
