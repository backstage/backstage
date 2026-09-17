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
  ClientSearch,
  DerivedServerSearch,
  DynamicItemsCollection,
  IdentifiedOption,
  LegacyOption,
  LoadingConfig,
  ManualServerSearch,
  Option,
  PlainStaticOptionsCollection,
  StaticCompositionSearch,
  StaticItemsCollection,
} from './selectableCollection';

type Owner = {
  id: string;
  name: string;
};

describe('selectable collection types', () => {
  it('accepts the supported collection contracts', () => {
    const loading = {
      state: 'loading',
      onLoadMore() {},
    } satisfies LoadingConfig;
    const uncontrolled = {
      defaultInputValue: 'draft',
    } satisfies ClientSearch<Owner>;
    const notified = {
      onInputChange() {},
    } satisfies ClientSearch<Owner>;
    const controlled = {
      inputValue: 'draft',
      onInputChange() {},
    } satisfies ClientSearch<Owner>;
    const manualServer = {
      mode: 'server',
      inputValue: 'draft',
      onInputChange() {},
    } satisfies ManualServerSearch;
    const derivedServer = {
      mode: 'server',
    } satisfies DerivedServerSearch;
    const staticSearch = {
      defaultInputValue: 'draft',
    } satisfies StaticCompositionSearch;
    const identified = {
      id: 'draft',
      label: 'Draft',
      description: 'Still in progress',
    } satisfies IdentifiedOption;
    const legacy = {
      value: 'draft',
      label: 'Draft',
    } satisfies LegacyOption;
    const staticOptions = {
      options: [identified, legacy],
    } satisfies PlainStaticOptionsCollection<Option>;
    const dynamicItems = {
      items: [{ id: 'ada', name: 'Ada Lovelace' }],
      children: (_item: Owner) => null as never,
    } satisfies DynamicItemsCollection<Owner>;
    const staticItems = {
      children: null as never,
    } satisfies StaticItemsCollection;

    expect({
      loading,
      uncontrolled,
      notified,
      controlled,
      manualServer,
      derivedServer,
      staticSearch,
      staticOptions,
      dynamicItems,
      staticItems,
    }).toBeDefined();
  });

  it('rejects ambiguous collection contracts at compile time', () => {
    // @ts-expect-error loading requires state
    const invalidLoading = { onLoadMore() {} } satisfies LoadingConfig;

    const missingChange = {
      inputValue: 'draft',
      // @ts-expect-error controlled client search requires onInputChange
    } satisfies ClientSearch<Owner>;

    const conflictingInput = {
      inputValue: 'draft',
      defaultInputValue: 'published',
      onInputChange() {},
      // @ts-expect-error client search cannot be controlled and defaulted together
    } satisfies ClientSearch<Owner>;

    const uncontrolledServer = {
      mode: 'server',
      // @ts-expect-error manual server search is controlled
    } satisfies ManualServerSearch;

    const conflictingDerivedInput = {
      mode: 'server',
      // @ts-expect-error derived server search receives its input state from the async list
      inputValue: 'draft',
    } satisfies DerivedServerSearch;

    const staticFilter = {
      // @ts-expect-error static item composition cannot apply a row filter
      filter() {
        return true;
      },
    } satisfies StaticCompositionSearch;

    const ambiguousOption = {
      id: 'draft',
      // @ts-expect-error identified options cannot also use the deprecated value field
      value: 'draft',
      label: 'Draft',
    } satisfies IdentifiedOption;

    const missingOptionId = {
      label: 'Draft',
      // @ts-expect-error an option requires either id or the deprecated value field
    } satisfies Option;

    const richLegacyOptionSource = {
      value: 'draft',
      label: 'Draft',
      description: 'Still in progress',
    };
    // @ts-expect-error rich option fields require id
    const richLegacyOption: LegacyOption = richLegacyOptionSource;

    const conflictingCollection = {
      options: [{ id: 'draft', label: 'Draft' }],
      // @ts-expect-error options and rendered items are mutually exclusive
      items: [{ id: 'ada', name: 'Ada Lovelace' }],
    } satisfies PlainStaticOptionsCollection<Option>;

    expect({
      invalidLoading,
      missingChange,
      conflictingInput,
      uncontrolledServer,
      conflictingDerivedInput,
      staticFilter,
      ambiguousOption,
      missingOptionId,
      richLegacyOption,
      conflictingCollection,
    }).toBeDefined();
  });
});
