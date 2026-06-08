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

import { Combobox } from './Combobox';
import {
  ComboboxItem,
  ComboboxItemProfile,
  ComboboxItemText,
} from './ComboboxItem';
import type {
  AsyncListSource,
  NormalizedOption,
} from '../../types/selectableCollection';
import type {
  ComboboxAsyncItemsProps,
  ComboboxAsyncOptionsProps,
  ComboboxItemsProps,
  ComboboxOptionsProps,
  ComboboxServerItemsProps,
  ComboboxServerOptionsProps,
  ComboboxStaticProps,
} from './types';

const owners = [
  {
    id: 'ada',
    name: 'Ada Lovelace',
    avatarUrl: 'https://example.com/ada.png',
  },
];
const serverOwners = owners.map(owner => ({
  ...owner,
  textValue: owner.name,
}));

const options = [{ id: 'draft', label: 'Draft' }];
const asyncOwners: AsyncListSource<(typeof owners)[number]> = {
  items: owners,
  filterText: '',
  setFilterText() {},
  loadingState: 'idle',
  loadMore() {},
};
const asyncServerOwners: AsyncListSource<(typeof serverOwners)[number]> = {
  items: serverOwners,
  filterText: '',
  setFilterText() {},
  loadingState: 'idle',
  loadMore() {},
};
const asyncOptions: AsyncListSource<(typeof options)[number]> = {
  items: options,
  filterText: '',
  setFilterText() {},
  loadingState: 'idle',
  loadMore() {},
};
const invalidAsyncServerSearch = {
  options: asyncOptions,
  search: { mode: 'server' as const, inputValue: 'ada', onInputChange() {} },
};
const invalidStaticFilter = {
  search: {
    filter: (item: { id: string }) => item.id === 'draft',
  },
  children: <ComboboxItemText id="draft" title="Draft" />,
};
const invalidMixedSearchState = {
  options,
  inputValue: 'ada',
  search: { inputValue: 'ada', onInputChange() {} },
};
const invalidOptionsAndItems = {
  options,
  items: owners,
  children: (owner: (typeof owners)[number]) => (
    <ComboboxItemProfile name={owner.name} />
  ),
};
const invalidOptionsAndChildren = {
  options,
  children: <ComboboxItemText id="draft" title="Draft" />,
};
const invalidAsyncServerItems = {
  items: asyncOwners,
  search: { mode: 'server' as const },
  children: (owner: (typeof owners)[number]) => (
    <ComboboxItemProfile name={owner.name} />
  ),
};
const invalidServerItemSelection = {
  items: asyncServerOwners,
  search: { mode: 'server' as const },
  value: 'ada',
  children: (owner: (typeof serverOwners)[number]) => (
    <ComboboxItemProfile name={owner.name} />
  ),
};
const invalidServerOptionSelection = {
  options: asyncOptions,
  search: { mode: 'server' as const },
  value: 'draft',
};
const invalidStaticLoading = {
  loading: { state: 'loading' as const },
  children: <ComboboxItemText id="draft" title="Draft" />,
};
const invalidItemsInputValue = {
  items: owners,
  inputValue: 'ada',
  children: (owner: (typeof owners)[number]) => (
    <ComboboxItemProfile name={owner.name} />
  ),
};
const invalidItemsFilter = {
  items: owners,
  defaultFilter: () => true,
  children: (owner: (typeof owners)[number]) => (
    <ComboboxItemProfile name={owner.name} />
  ),
};
const invalidAsyncItemsDefaultInput = {
  items: asyncOwners,
  defaultInputValue: 'ada',
  children: (owner: (typeof owners)[number]) => (
    <ComboboxItemProfile name={owner.name} />
  ),
};
const invalidStaticInputChange = {
  onInputChange() {},
  children: <ComboboxItemText id="draft" title="Draft" />,
};

describe('Combobox types', () => {
  it('exports props for each collection mode', () => {
    const optionsProps = { options } satisfies ComboboxOptionsProps;
    const asyncOptionsProps = {
      options: asyncOptions,
    } satisfies ComboboxAsyncOptionsProps;
    const itemsProps = {
      items: owners,
      children: (owner: (typeof owners)[number]) => (
        <ComboboxItemProfile name={owner.name} />
      ),
    } satisfies ComboboxItemsProps<(typeof owners)[number]>;
    const asyncItemsProps = {
      items: asyncOwners,
      children: (owner: (typeof owners)[number]) => (
        <ComboboxItemProfile name={owner.name} />
      ),
    } satisfies ComboboxAsyncItemsProps<(typeof owners)[number]>;
    const staticProps = {
      children: <ComboboxItemText title="Draft" />,
    } satisfies ComboboxStaticProps;
    const serverOptionsProps = {
      options: asyncOptions,
      search: { mode: 'server' as const },
    } satisfies ComboboxServerOptionsProps;
    const serverItemsProps = {
      items: asyncServerOwners,
      search: { mode: 'server' as const },
      children: (owner: (typeof serverOwners)[number]) => (
        <ComboboxItemProfile name={owner.name} />
      ),
    } satisfies ComboboxServerItemsProps<(typeof serverOwners)[number]>;

    expect([
      optionsProps,
      asyncOptionsProps,
      itemsProps,
      asyncItemsProps,
      staticProps,
      serverOptionsProps,
      serverItemsProps,
    ]).toHaveLength(7);
  });

  it('accepts valid collection branches', () => {
    <Combobox options={options} />;
    <Combobox options={[{ value: 'draft', label: 'Draft' }]} />;

    <Combobox items={owners} dependencies={['owner-renderer']}>
      {owner => <ComboboxItemProfile name={owner.name} src={owner.avatarUrl} />}
    </Combobox>;

    <Combobox items={asyncOwners} dependencies={['owner-renderer']}>
      {owner => <ComboboxItemProfile name={owner.name} />}
    </Combobox>;

    <Combobox>
      <ComboboxItemText
        id="draft"
        title="Draft"
        description="Work in progress"
      />
    </Combobox>;

    <Combobox>
      <ComboboxItemText title="Draft" />
    </Combobox>;

    <ComboboxItem id="custom" textValue="Custom" showSelectionIndicator>
      Custom
    </ComboboxItem>;

    <Combobox options={options} search={{ defaultInputValue: 'draft' }} />;
    <Combobox options={options} search={{ onInputChange() {} }} />;
    <Combobox
      options={options}
      search={{ inputValue: 'draft', onInputChange() {} }}
    />;
    <Combobox
      options={options}
      search={{
        filter: (option: NormalizedOption) => option.label.includes('draft'),
      }}
    />;
    <Combobox
      options={options}
      search={{ mode: 'server', inputValue: 'draft', onInputChange() {} }}
      loading={{ state: 'loading', onLoadMore() {} }}
    />;
    <Combobox options={asyncOptions} search={{ mode: 'server' }} />;

    <Combobox
      items={asyncServerOwners}
      search={{ mode: 'server' }}
      defaultValue={serverOwners[0]}
      onChange={owner => owner?.name}
    >
      {owner => <ComboboxItemProfile name={owner.name} />}
    </Combobox>;

    <Combobox
      options={asyncOptions}
      search={{ mode: 'server' }}
      defaultValue={options[0]}
      onChange={option => option?.label}
    />;

    <Combobox
      items={asyncOwners.items}
      search={{ mode: 'server', inputValue: 'ada', onInputChange() {} }}
      loading={{ state: asyncOwners.loadingState }}
    >
      {owner => <ComboboxItemProfile name={owner.name} />}
    </Combobox>;

    <Combobox
      options={options}
      defaultInputValue="draft"
      onInputChange={() => {}}
      defaultFilter={() => true}
    />;
    <Combobox
      options={options}
      inputValue="draft"
      onInputChange={() => {}}
      defaultFilter={() => true}
    />;

    expect(true).toBe(true);
  });

  it('rejects invalid collection branches', () => {
    // @ts-expect-error low-level items require textValue
    <ComboboxItem id="custom">Custom</ComboboxItem>;

    // @ts-expect-error preset items keep the standard selection indicator
    <ComboboxItemText id="draft" title="Draft" showSelectionIndicator />;

    // @ts-expect-error options and items are mutually exclusive
    <Combobox {...invalidOptionsAndItems} />;

    // @ts-expect-error dynamic items require a renderer
    <Combobox items={owners} />;

    // @ts-expect-error static composition cannot be mixed with options
    <Combobox {...invalidOptionsAndChildren} />;

    // @ts-expect-error options collections do not use renderer dependencies
    <Combobox options={options} dependencies={[]} />;

    // @ts-expect-error async options collections do not use renderer dependencies
    <Combobox options={asyncOptions} dependencies={[]} />;

    <Combobox dependencies={[]}>
      {/* @ts-expect-error static composition does not use renderer dependencies */}
      <ComboboxItemText id="draft" title="Draft" />
    </Combobox>;

    // @ts-expect-error manual server search must be controlled
    <Combobox options={options} search={{ mode: 'server' }} />;

    // @ts-expect-error controlled client search requires onInputChange
    <Combobox options={options} search={{ inputValue: 'ada' }} />;

    // @ts-expect-error direct async server search owns its state
    <Combobox {...invalidAsyncServerSearch} />;

    // @ts-expect-error direct async server items require canonical textValue
    <Combobox {...invalidAsyncServerItems} />;

    // @ts-expect-error direct async server selection uses the full item
    <Combobox {...invalidServerItemSelection} />;

    // @ts-expect-error direct async option selection uses the full option
    <Combobox {...invalidServerOptionSelection} />;

    // @ts-expect-error direct async loading is derived from the source
    <Combobox options={asyncOptions} loading={{ state: 'loading' }} />;

    // @ts-expect-error static composition has no source object for a full-row filter
    <Combobox {...invalidStaticFilter} />;

    // @ts-expect-error nested search cannot be mixed with deprecated top-level state
    <Combobox {...invalidMixedSearchState} />;

    // @ts-expect-error static composition is client-only and has no loading source
    <Combobox {...invalidStaticLoading} />;

    // @ts-expect-error deprecated inputValue is only available with plain options
    <Combobox {...invalidItemsInputValue} />;

    // @ts-expect-error deprecated defaultFilter is only available with plain options
    <Combobox {...invalidItemsFilter} />;

    // @ts-expect-error deprecated defaultInputValue is only available with plain options
    <Combobox {...invalidAsyncItemsDefaultInput} />;

    // @ts-expect-error deprecated inputValue is not available with async options
    <Combobox options={asyncOptions} inputValue="ada" />;

    // @ts-expect-error deprecated onInputChange is only available with plain options
    <Combobox {...invalidStaticInputChange} />;

    expect(true).toBe(true);
  });
});
