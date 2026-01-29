/*
 * Copyright 2020 The Backstage Authors
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

import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import Clear from '@material-ui/icons/Clear';
import Search from '@material-ui/icons/Search';
import { useEffect, useMemo, useState } from 'react';
import useDebounce from 'react-use/lib/useDebounce';
import { useEntityList } from '../../hooks/useEntityListProvider';
import { EntityTextFilter } from '../../filters';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { TextFilterFieldsConfig } from '../../types';

function resolveFilterFields(
  config: TextFilterFieldsConfig | undefined,
  kind: string | undefined,
): string[] | undefined {
  if (!config) {
    return undefined;
  }

  // If config is an array, use it directly for all kinds
  if (Array.isArray(config)) {
    return config;
  }

  // If config is a record, look up by kind (case-insensitive)
  const normalizedKind = kind?.toLowerCase();
  if (normalizedKind) {
    const matchingKey = Object.keys(config).find(
      key => key.toLowerCase() === normalizedKind,
    );
    if (matchingKey) {
      return config[matchingKey];
    }
  }

  // No matching kind found, use defaults
  return undefined;
}

/** @public */
export type CatalogReactEntitySearchBarClassKey = 'searchToolbar' | 'input';

const useStyles = makeStyles(
  _theme => ({
    searchToolbar: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    input: {},
  }),
  { name: 'CatalogReactEntitySearchBar' },
);

/**
 * Renders search bar for filtering the entity list.
 * @public
 */
export const EntitySearchBar = () => {
  const classes = useStyles();
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const {
    updateFilters,
    queryParameters: { text: textParameter },
    textFilterFields,
    filters,
    paginationMode,
  } = useEntityList();

  const queryParamTextFilter = useMemo(
    () => [textParameter].flat()[0],
    [textParameter],
  );

  const [search, setSearch] = useState(queryParamTextFilter ?? '');

  // Resolve the filter fields based on current kind
  // Only use custom fields when pagination is enabled (backend filtering)
  // In non-paginated mode, custom fields would break client-side filtering
  const resolvedFilterFields = useMemo(
    () =>
      paginationMode !== 'none'
        ? resolveFilterFields(textFilterFields, filters.kind?.value)
        : undefined,
    [textFilterFields, filters.kind?.value, paginationMode],
  );

  useDebounce(
    () => {
      updateFilters({
        text: search.length
          ? new EntityTextFilter(search, resolvedFilterFields)
          : undefined,
      });
    },
    250,
    [search, resolvedFilterFields, updateFilters],
  );

  useEffect(() => {
    if (queryParamTextFilter) {
      setSearch(queryParamTextFilter);
    }
  }, [queryParamTextFilter]);

  return (
    <Toolbar className={classes.searchToolbar}>
      <FormControl>
        <Input
          aria-label="search"
          id="input-with-icon-adornment"
          className={classes.input}
          placeholder={t('entitySearchBar.placeholder')}
          autoComplete="off"
          onChange={event => setSearch(event.target.value)}
          value={search}
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={() => setSearch('')}
                edge="end"
                disabled={search.length === 0}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </Toolbar>
  );
};
