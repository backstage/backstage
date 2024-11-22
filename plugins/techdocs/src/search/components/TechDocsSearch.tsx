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
import { ResultHighlight } from '@backstage/plugin-search-common';
import {
  SearchAutocomplete,
  SearchContextProvider,
  useSearch,
} from '@backstage/plugin-search-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TechDocsSearchResultListItem } from './TechDocsSearchResultListItem';

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

type TechDocsDoc = {
  namespace: string;
  kind: string;
  name: string;
  path: string;
  location: string;
  title: string;
};

type TechDocsSearchResult = {
  type: string;
  document: TechDocsDoc;
  highlight?: ResultHighlight;
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
  const {
    setFilters,
    term,
    result: { loading, value: searchVal },
  } = useSearch();
  const [options, setOptions] = useState<any[]>([]);
  useEffect(() => {
    let mounted = true;

    if (mounted && searchVal) {
      // TODO: Change this into getting only subset of search results from the BE in the first place
      // once pagination is implemented for search engines
      // See: https://github.com/backstage/backstage/issues/6062
      const searchResults = searchVal.results.slice(0, 10);
      setOptions(searchResults);
    }
    return () => {
      mounted = false;
    };
  }, [loading, searchVal]);

  // Update the filter context when the entityId changes, e.g. when the search
  // bar continues to be rendered, navigating between different TechDocs sites.
  const { kind, name, namespace } = entityId;
  useEffect(() => {
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        kind,
        namespace,
        name,
      };
    });
  }, [kind, namespace, name, setFilters]);

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
      options={options}
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
