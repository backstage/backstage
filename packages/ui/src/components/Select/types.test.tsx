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

import { Select, SelectItem, SelectItemProfile, SelectItemText } from '.';
import type { AsyncListSource } from '../../types/selectableCollection';
import type {
  SelectAsyncItemsProps,
  SelectAsyncOptionsProps,
  SelectItemsProps,
  SelectOptionsProps,
  SelectProps,
  SelectStaticProps,
} from './types';

const owners = [
  { id: 'ada', name: 'Ada Lovelace', avatarUrl: 'ada.png' },
  { id: 'grace', name: 'Grace Hopper' },
];
const options = [{ id: 'draft', label: 'Draft' }];
const asyncOptions: AsyncListSource<(typeof options)[number]> = {
  items: options,
  filterText: '',
  setFilterText() {},
  loadingState: 'idle',
  loadMore() {},
};
const asyncOwners: AsyncListSource<(typeof owners)[number]> = {
  items: owners,
  filterText: '',
  setFilterText() {},
  loadingState: 'idle',
  loadMore() {},
};
const controlledServerSearch = {
  mode: 'server' as const,
  inputValue: 'draft',
  onInputChange() {},
};

describe('Select types', () => {
  it('exports props for each collection mode', () => {
    const optionsProps = { options } satisfies SelectOptionsProps;
    const asyncOptionsProps = {
      options: asyncOptions,
    } satisfies SelectAsyncOptionsProps;
    const itemsProps = {
      items: owners,
      children: (owner: (typeof owners)[number]) => (
        <SelectItemProfile name={owner.name} />
      ),
    } satisfies SelectItemsProps<(typeof owners)[number], 'single'>;
    const asyncItemsProps = {
      items: asyncOwners,
      children: (owner: (typeof owners)[number]) => (
        <SelectItemProfile name={owner.name} />
      ),
    } satisfies SelectAsyncItemsProps<(typeof owners)[number], 'single'>;
    const staticProps = {
      children: <SelectItemText title="Draft" />,
    } satisfies SelectStaticProps;

    expect([
      optionsProps,
      asyncOptionsProps,
      itemsProps,
      asyncItemsProps,
      staticProps,
    ]).toHaveLength(5);
  });

  it('preserves the selection mode generic in the first position', () => {
    const props = {} satisfies SelectProps<'single' | 'multiple'>;

    expect(props).toBeDefined();
  });

  it('accepts supported item composition branches', () => {
    const valid = (
      <>
        <Select options={[{ id: 'draft', label: 'Draft' }]} />
        <Select options={[{ value: 'draft', label: 'Draft' }]} />
        <Select items={owners} dependencies={['owner-renderer']}>
          {owner => (
            <SelectItemProfile name={owner.name} src={owner.avatarUrl} />
          )}
        </Select>
        <Select items={asyncOwners} dependencies={['owner-renderer']}>
          {owner => <SelectItemProfile name={owner.name} />}
        </Select>
        <Select>
          <SelectItemText
            id="draft"
            title="Draft"
            description="Work in progress"
          />
        </Select>
        <Select>
          <SelectItem id="custom" textValue="Custom" showSelectionIndicator>
            Custom
          </SelectItem>
        </Select>
      </>
    );

    expect(valid).toBeDefined();
  });

  it('accepts supported search and loading branches', () => {
    const valid = (
      <>
        <Select options={options} search />
        <Select options={options} search={{ defaultInputValue: 'draft' }} />
        <Select options={options} search={{ onInputChange() {} }} />
        <Select
          options={options}
          search={{ inputValue: 'draft', onInputChange() {} }}
        />
        <Select options={options} search={{ placeholder: 'Find status' }} />
        <Select options={options} search={controlledServerSearch} />
        <Select
          options={options}
          loading={{ state: 'loading', onLoadMore() {} }}
        />
        <Select options={asyncOptions} search={{ mode: 'server' }} />
        <Select
          items={owners}
          search={{
            mode: 'server',
            inputValue: 'ada',
            onInputChange() {},
          }}
        >
          {owner => <SelectItemProfile name={owner.name} />}
        </Select>
        <Select options={options} searchable searchPlaceholder="Find status" />
      </>
    );

    expect(valid).toBeDefined();
  });

  it('rejects invalid item composition branches', () => {
    const invalid = (
      <>
        {/* @ts-expect-error low-level items require textValue */}
        <SelectItem id="custom">Custom</SelectItem>

        {/* @ts-expect-error preset items keep the standard selection indicator */}
        <SelectItemText id="draft" title="Draft" showSelectionIndicator />

        {/* @ts-expect-error options and items are mutually exclusive */}
        <Select options={options} items={owners}>
          {(owner: (typeof owners)[number]) => (
            <SelectItemProfile name={owner.name} />
          )}
        </Select>

        {/* @ts-expect-error dynamic items require a renderer */}
        <Select items={owners} />

        {/* @ts-expect-error static composition cannot be mixed with options */}
        <Select options={options}>
          <SelectItemText id="draft" title="Draft" />
        </Select>

        {/* @ts-expect-error options collections do not use renderer dependencies */}
        <Select options={options} dependencies={[]} />

        {/* @ts-expect-error async options collections do not use renderer dependencies */}
        <Select options={asyncOptions} dependencies={[]} />

        {/* @ts-expect-error static composition does not use renderer dependencies */}
        <Select dependencies={[]}>
          <SelectItemText id="draft" title="Draft" />
        </Select>
      </>
    );

    expect(invalid).toBeDefined();
  });

  it('rejects invalid search and loading combinations', () => {
    const invalid = (
      <>
        {/* @ts-expect-error manual server search must be controlled */}
        <Select options={options} search={{ mode: 'server' }} />

        {/* @ts-expect-error inputValue requires onInputChange */}
        <Select options={options} search={{ inputValue: 'ada' }} />

        {/* @ts-expect-error static composition has no source object for a full-row filter */}
        <Select search={{ filter: item => item.id === 'draft' }}>
          <SelectItemText id="draft" title="Draft" />
        </Select>

        {/* @ts-expect-error direct async server search owns its state */}
        <Select options={asyncOptions} search={controlledServerSearch} />

        {/* @ts-expect-error direct async loading is derived from the source */}
        <Select options={asyncOptions} loading={{ state: 'loading' }} />

        {/* @ts-expect-error deprecated aliases cannot be mixed with search */}
        <Select options={options} searchable search />

        {/* @ts-expect-error static composition is client-only and has no loading source */}
        <Select loading={{ state: 'loading' }}>
          <SelectItemText id="draft" title="Draft" />
        </Select>
      </>
    );

    expect(invalid).toBeDefined();
  });
});
