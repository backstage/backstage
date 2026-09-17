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

import type {
  AsyncListSource,
  CollectionItem,
  IdentifiedOption,
  NormalizedOption,
  NormalizedOptionSection,
  Option,
  OptionSection,
} from '../types/selectableCollection';
import type { Key, Selection } from 'react-aria-components';

/** @internal */
export function normalizeOption(option: Option): NormalizedOption {
  if (option.id !== undefined) {
    return option;
  }

  return {
    id: option.value,
    label: option.label,
    disabled: option.disabled,
  };
}

/** @internal */
export function normalizeOptions(
  options: ReadonlyArray<Option | OptionSection>,
): Array<NormalizedOption | NormalizedOptionSection> {
  return options.map(option => {
    if ('options' in option) {
      return {
        title: option.title,
        options: option.options.map(normalizeOption),
      };
    }

    return normalizeOption(option);
  });
}

/** @internal */
export function isAsyncListSource<T>(
  source: Iterable<T> | AsyncListSource<T>,
): source is AsyncListSource<T> {
  return (
    typeof source === 'object' &&
    source !== null &&
    'items' in source &&
    'filterText' in source &&
    'setFilterText' in source &&
    'loadingState' in source &&
    'loadMore' in source
  );
}

/** @internal */
export function flattenOptions(
  options: ReadonlyArray<NormalizedOption | NormalizedOptionSection>,
): NormalizedOption[] {
  return options.flatMap(option => {
    if ('options' in option) {
      return option.options;
    }

    return option;
  });
}

/** @internal */
export function getItemKeys(items: Iterable<CollectionItem>) {
  return new Set(Array.from(items, item => item.id));
}

/** @internal */
export function resolveCollectionSource<T extends CollectionItem>({
  options,
  items,
}: {
  options?:
    | ReadonlyArray<Option | OptionSection>
    | AsyncListSource<IdentifiedOption>;
  items?: Iterable<T> | AsyncListSource<T>;
}) {
  const plainOptions = Array.isArray(options) ? options : undefined;
  const normalizedOptions = plainOptions
    ? normalizeOptions(plainOptions)
    : undefined;
  const flatOptions = normalizedOptions
    ? flattenOptions(normalizedOptions)
    : undefined;
  const asyncOptions = options && !Array.isArray(options) ? options : undefined;

  if (items !== undefined) {
    return {
      options: plainOptions,
      flatOptions,
      source: items,
      rendersItems: true,
    };
  }

  if (asyncOptions !== undefined) {
    return {
      options: plainOptions,
      flatOptions,
      source: asyncOptions as unknown as AsyncListSource<T>,
      rendersItems: true,
    };
  }

  return {
    options: plainOptions,
    flatOptions,
    source: (flatOptions as T[] | undefined) ?? [],
    rendersItems: false,
  };
}

/** @internal */
export function toSelection(
  value: Key | ReadonlyArray<Key> | null | undefined,
): Selection {
  if (value == null) {
    return new Set();
  }

  return new Set(Array.isArray(value) ? value : [value]);
}

/** @internal */
export function filterOptionSections(
  options: ReadonlyArray<NormalizedOption | NormalizedOptionSection>,
  query: string,
  filter: (option: NormalizedOption, query: string) => boolean,
): Array<NormalizedOption | NormalizedOptionSection> {
  return options.flatMap(option => {
    if (!('options' in option)) {
      return filter(option, query) ? option : [];
    }

    const filteredOptions = option.options.filter(item => filter(item, query));
    if (filteredOptions.length === 0) {
      return [];
    }

    return { title: option.title, options: filteredOptions };
  });
}
