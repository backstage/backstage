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
export type ComboboxServerItem = {
  id: Key;
  textValue: string;
};

/** @public */
export type ComboboxSearch<T> =
  | true
  | {
      mode?: 'client';
      inputValue?: never;
      defaultInputValue?: string;
      onInputChange?: (value: string) => void;
      filter?: (item: T, query: string) => boolean;
    }
  | {
      mode?: 'client';
      inputValue: string;
      defaultInputValue?: never;
      onInputChange: (value: string) => void;
      filter?: (item: T, query: string) => boolean;
    }
  | {
      mode: 'server';
      inputValue: string;
      defaultInputValue?: never;
      onInputChange: (value: string) => void;
      filter?: never;
    };

/** @public */
export type ComboboxAsyncSearch<T> =
  | true
  | {
      mode?: 'client';
      inputValue?: never;
      defaultInputValue?: string;
      onInputChange?: (value: string) => void;
      filter?: (item: T, query: string) => boolean;
    }
  | {
      mode?: 'client';
      inputValue: string;
      defaultInputValue?: never;
      onInputChange: (value: string) => void;
      filter?: (item: T, query: string) => boolean;
    }
  | {
      mode: 'server';
      inputValue?: never;
      defaultInputValue?: never;
      onInputChange?: never;
      filter?: never;
    };

/** @public */
export type ComboboxStaticSearch =
  | true
  | {
      mode?: 'client';
      inputValue?: never;
      defaultInputValue?: string;
      onInputChange?: (value: string) => void;
      filter?: never;
    }
  | {
      mode?: 'client';
      inputValue: string;
      defaultInputValue?: never;
      onInputChange: (value: string) => void;
      filter?: never;
    };

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

/** @public */
export type ComboboxCommonProps<T extends { id: Key }> = ComboboxBaseOwnProps &
  Omit<
    AriaComboBoxProps<T>,
    | keyof ComboboxOwnProps<T>
    | 'defaultItems'
    | 'inputValue'
    | 'defaultInputValue'
    | 'onInputChange'
    | 'defaultFilter'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'selectedKey'
    | 'defaultSelectedKey'
    | 'onSelectionChange'
  >;

/** @public */
export type ComboboxKeySelectionProps<T extends { id: Key }> = Pick<
  AriaComboBoxProps<T>,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'selectedKey'
  | 'defaultSelectedKey'
  | 'onSelectionChange'
>;

/** @public */
export type ComboboxItemSelectionProps<T extends { id: Key }> = {
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T | null) => void;
  selectedKey?: never;
  defaultSelectedKey?: never;
  onSelectionChange?: never;
};

/** @public */
export type ComboboxOptionsProps = ComboboxCommonProps<NormalizedOption> & {
  options?: ReadonlyArray<Option | OptionSection>;
  items?: never;
  children?: never;
  dependencies?: never;
  loading?: LoadingConfig;
} & (
    | {
        search?: ComboboxSearch<NormalizedOption>;
        inputValue?: never;
        defaultInputValue?: never;
        onInputChange?: never;
        defaultFilter?: never;
      }
    | {
        search?: never;
        /** @deprecated Use search.inputValue instead. */
        inputValue?: string;
        /** @deprecated Use search.defaultInputValue instead. */
        defaultInputValue?: string;
        /** @deprecated Use search.onInputChange instead. */
        onInputChange?: (value: string) => void;
        /** @deprecated Use search.filter instead. */
        defaultFilter?: (textValue: string, inputValue: string) => boolean;
      }
  ) &
  ComboboxKeySelectionProps<NormalizedOption>;

/** @public */
export type ComboboxAsyncOptionsProps =
  ComboboxCommonProps<NormalizedOption> & {
    options: AsyncListSource<IdentifiedOption>;
    items?: never;
    children?: never;
    dependencies?: never;
    loading?: never;
    search?: Exclude<ComboboxAsyncSearch<NormalizedOption>, { mode: 'server' }>;
    inputValue?: never;
    defaultInputValue?: never;
    onInputChange?: never;
    defaultFilter?: never;
  } & ComboboxKeySelectionProps<NormalizedOption>;

/** @public */
export type ComboboxItemsProps<T extends { id: Key }> =
  ComboboxCommonProps<T> & {
    options?: never;
    items: Iterable<T>;
    children: (item: T) => ReactElement;
    dependencies?: ReadonlyArray<unknown>;
    loading?: LoadingConfig;
    search?: ComboboxSearch<T>;
    inputValue?: never;
    defaultInputValue?: never;
    onInputChange?: never;
    defaultFilter?: never;
  } & ComboboxKeySelectionProps<T>;

/** @public */
export type ComboboxAsyncItemsProps<T extends { id: Key }> =
  ComboboxCommonProps<T> & {
    options?: never;
    items: AsyncListSource<T>;
    children: (item: T) => ReactElement;
    dependencies?: ReadonlyArray<unknown>;
    loading?: never;
    search?: Exclude<ComboboxAsyncSearch<T>, { mode: 'server' }>;
    inputValue?: never;
    defaultInputValue?: never;
    onInputChange?: never;
    defaultFilter?: never;
  } & ComboboxKeySelectionProps<T>;

/** @public */
export type ComboboxStaticProps = ComboboxCommonProps<NormalizedOption> & {
  options?: never;
  items?: never;
  children: ReactElement | ReactElement[];
  dependencies?: never;
  loading?: never;
  search?: ComboboxStaticSearch;
  inputValue?: never;
  defaultInputValue?: never;
  onInputChange?: never;
  defaultFilter?: never;
} & ComboboxKeySelectionProps<NormalizedOption>;

/** @public */
export type ComboboxServerOptionsProps =
  ComboboxCommonProps<IdentifiedOption> & {
    options: AsyncListSource<IdentifiedOption>;
    items?: never;
    children?: never;
    dependencies?: never;
    loading?: never;
    search: Extract<ComboboxAsyncSearch<never>, { mode: 'server' }>;
    inputValue?: never;
    defaultInputValue?: never;
    onInputChange?: never;
    defaultFilter?: never;
  } & ComboboxItemSelectionProps<IdentifiedOption>;

/** @public */
export type ComboboxServerItemsProps<T extends ComboboxServerItem> =
  ComboboxCommonProps<T> & {
    options?: never;
    items: AsyncListSource<T>;
    children: (item: T) => ReactElement;
    dependencies?: ReadonlyArray<unknown>;
    loading?: never;
    search: Extract<ComboboxAsyncSearch<never>, { mode: 'server' }>;
    inputValue?: never;
    defaultInputValue?: never;
    onInputChange?: never;
    defaultFilter?: never;
  } & ComboboxItemSelectionProps<T>;

/** @public */
export type ComboboxProps<T extends { id: Key } = NormalizedOption> =
  | ComboboxOptionsProps
  | ComboboxAsyncOptionsProps
  | ComboboxItemsProps<T>
  | ComboboxAsyncItemsProps<T>
  | ComboboxStaticProps
  | ComboboxServerOptionsProps
  | (T extends ComboboxServerItem ? ComboboxServerItemsProps<T> : never);

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
  search?: ComboboxSearch<T> | ComboboxAsyncSearch<T> | ComboboxStaticSearch;
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
  textValue?: string;
  className?: string;
};

/** @public */
export type ComboboxItemTextProps<T extends object = object> =
  ComboboxItemTextOwnProps &
    Omit<
      ComboboxItemProps<T>,
      keyof ComboboxItemTextOwnProps | 'children' | 'showSelectionIndicator'
    >;

/** @public */
export type ComboboxItemProfileOwnProps = {
  name: string;
  src?: string;
  textValue?: string;
  className?: string;
};

/** @public */
export type ComboboxItemProfileProps<T extends object = object> =
  ComboboxItemProfileOwnProps &
    Omit<
      ComboboxItemProps<T>,
      keyof ComboboxItemProfileOwnProps | 'children' | 'showSelectionIndicator'
    >;

/** @internal */
export type ComboboxListBoxItemOwnProps = {};

/** @internal */
export type ComboboxSectionOwnProps = {};
