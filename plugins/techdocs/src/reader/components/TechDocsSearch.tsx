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

import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { SearchContextProvider, useSearch } from '@backstage/plugin-search';
import { DocsResultListItem } from '../../components/DocsResultListItem';
import SearchIcon from '@material-ui/icons/Search';
import { useDebounce } from 'react-use';
import { useNavigate } from 'react-router';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

type EntityId = {
  name: string;
  namespace: string;
  kind: string;
};
type TechDocsSearchProps = {
  entityId: EntityId;
  debounceTime?: number;
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
};

export const buildInitialFilters = (
  legacyPaths: boolean,
  entityId: EntityId,
) => {
  return legacyPaths
    ? entityId
    : Object.entries(entityId).reduce((acc, [key, value]) => {
        return { ...acc, [key]: value.toLowerCase() };
      }, {});
};

const TechDocsSearchBar = ({
  entityId,
  debounceTime = 150,
}: TechDocsSearchProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    term,
    setTerm,
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

  const [value, setValue] = useState<string>(term);

  useDebounce(() => setTerm(value), debounceTime, [value]);

  const handleQuery = (e: ChangeEvent<HTMLInputElement>) => {
    if (!open) {
      setOpen(true);
    }
    setValue(e.target.value);
  };

  const handleSelection = (_: any, selection: TechDocsSearchResult | null) => {
    if (selection?.document) {
      const { location } = selection.document;
      navigate(location);
    }
  };

  return (
    <Grid item xs={12}>
      <Autocomplete
        data-testid="techdocs-search-bar"
        size="small"
        open={open}
        getOptionLabel={() => ''}
        filterOptions={x => {
          return x; // This is needed to get renderOption to be called after options change. Bug in material-ui?
        }}
        onClose={() => {
          setOpen(false);
        }}
        onFocus={() => {
          setOpen(true);
        }}
        onChange={handleSelection}
        blurOnSelect
        noOptionsText="No results found"
        value={null}
        options={options}
        renderOption={({ document }) => (
          <DocsResultListItem
            result={document}
            lineClamp={3}
            asListItem={false}
            asLink={false}
            title={document.title}
          />
        )}
        loading={loading}
        renderInput={params => (
          <TextField
            {...params}
            data-testid="techdocs-search-bar-input"
            variant="outlined"
            fullWidth
            placeholder={`Search ${entityId.name} docs`}
            value={value}
            onChange={handleQuery}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton aria-label="Query" disabled>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </Grid>
  );
};

const TechDocsSearch = (props: TechDocsSearchProps) => {
  const configApi = useApi(configApiRef);
  const legacyPaths = configApi.getOptionalBoolean(
    'techdocs.legacyUseCaseSensitiveTripletPaths',
  );
  const initialState = {
    term: '',
    types: ['techdocs'],
    pageCursor: '',
    filters: buildInitialFilters(legacyPaths || false, props.entityId),
  };
  return (
    <SearchContextProvider initialState={initialState}>
      <TechDocsSearchBar {...props} />
    </SearchContextProvider>
  );
};
export { TechDocsSearch };
