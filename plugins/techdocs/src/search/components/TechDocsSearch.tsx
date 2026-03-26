/*
 * Copyright 2021 The Backstage Authors
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

import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  SearchAutocomplete,
  SearchContextProvider,
} from '@backstage/plugin-search-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TechDocsSearchResultListItem } from './TechDocsSearchResultListItem';
import {
  useTechDocsSearch,
  TechDocsSearchResult,
} from '../../hooks/useTechDocsSearch';

/**
 * Props for {@link TechDocsSearch}
 *
 * @public
 */
export type TechDocsSearchProps = {
  entityId: CompoundEntityRef;
  entityTitle?: string;
  debounceTime?: number;
  searchResultUrlMapper?: (url: string) => string;
};

const isTechDocsSearchResult = (
  option: any,
): option is TechDocsSearchResult => {
  return option?.document;
};

const TechDocsSearchBar = (props: TechDocsSearchProps) => {
  const {
    entityId,
    entityTitle,
    debounceTime = 150,
    searchResultUrlMapper,
  } = props;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { results, term, loading } = useTechDocsSearch(entityId);

  const handleSelection = (
    _: any,
    selection: TechDocsSearchResult | string | null,
  ) => {
    if (isTechDocsSearchResult(selection)) {
      const { location } = selection.document;
      navigate(
        searchResultUrlMapper ? searchResultUrlMapper(location) : location,
      );
    }
  };

  return (
    <SearchAutocomplete
      data-testid="techdocs-search-bar"
      size="small"
      open={open && Boolean(term)}
      getOptionLabel={() => ''}
      filterOptions={x => {
        return x; // This is needed to get renderOption to be called after options change. Bug in material-ui?
      }}
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      onChange={handleSelection}
      blurOnSelect
      noOptionsText="No results found"
      value={null}
      options={results}
      renderOption={({ document, highlight }) => (
        <TechDocsSearchResultListItem
          result={document}
          lineClamp={3}
          asListItem={false}
          asLink={false}
          title={document.title}
          highlight={highlight}
        />
      )}
      loading={loading}
      inputDebounceTime={debounceTime}
      inputPlaceholder={`Search ${entityTitle || entityId.name} docs`}
      freeSolo={false}
    />
  );
};

/**
 * Component used to render search bar on TechDocs page, scoped to
 *
 * @public
 */
export const TechDocsSearch = (props: TechDocsSearchProps) => {
  const initialState = {
    term: '',
    types: ['techdocs'],
    pageCursor: '',
    filters: props.entityId,
  };
  return (
    <SearchContextProvider initialState={initialState}>
      <TechDocsSearchBar {...props} />
    </SearchContextProvider>
  );
};
