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
  Input,
  SearchField,
  Autocomplete,
  Button,
  type Key,
} from 'react-aria-components';
import { useFilter } from 'react-aria';
import { RiCloseCircleLine } from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import { SelectContentDefinition } from './definition';
import { SelectListBox } from './SelectListBox';
import type {
  CollectionItem,
  NormalizedOption,
} from '../../types/selectableCollection';
import type { SelectContentOwnProps } from './types';
import type { Node } from '@react-types/shared';

type SearchFilter<T extends CollectionItem> = (
  textValue: string,
  inputValue: string,
  node: Node<T>,
) => boolean;

function getSearchFilter<T extends CollectionItem>({
  visibleIds,
  filter,
  contains,
}: {
  visibleIds?: Set<Key>;
  filter?: (item: T, query: string) => boolean;
  contains: (textValue: string, inputValue: string) => boolean;
}): SearchFilter<T> {
  if (visibleIds) {
    return (_textValue, _inputValue, node) => visibleIds.has(node.key);
  }

  if (filter) {
    return (_textValue, inputValue, node) =>
      filter(node.value as T, inputValue);
  }

  return (textValue, inputValue) => contains(textValue, inputValue);
}

export function SelectContent<T extends CollectionItem = NormalizedOption>(
  props: SelectContentOwnProps<T>,
) {
  const { contains } = useFilter({ sensitivity: 'base' });
  const { ownProps } = useDefinition(SelectContentDefinition, props);
  const {
    classes,
    search,
    options,
    items,
    children,
    dependencies,
    loading,
    isStale,
    visibleIds,
    retainedOptions,
  } = ownProps;

  const listBox = (
    <div className={classes.results}>
      <SelectListBox
        options={options}
        items={items}
        dependencies={dependencies}
        loading={loading}
        isStale={isStale}
        retainedOptions={retainedOptions}
      >
        {children}
      </SelectListBox>
    </div>
  );

  if (!search) {
    return <div className={classes.root}>{listBox}</div>;
  }

  const searchProps = typeof search === 'object' ? search : undefined;
  const placeholder = searchProps?.placeholder ?? 'Search...';
  const filter = getSearchFilter({
    visibleIds,
    filter: searchProps?.filter,
    contains,
  });

  return (
    <Autocomplete
      inputValue={searchProps?.inputValue}
      defaultInputValue={searchProps?.defaultInputValue}
      onInputChange={searchProps?.onInputChange}
      filter={filter}
    >
      <div className={classes.root}>
        <SearchField
          autoFocus
          className={classes.searchWrapper}
          aria-label={placeholder}
        >
          <Input placeholder={placeholder} className={classes.search} />
          <Button className={classes.searchClear}>
            <RiCloseCircleLine />
          </Button>
        </SearchField>
        {listBox}
      </div>
    </Autocomplete>
  );
}
