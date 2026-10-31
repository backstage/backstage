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

import {
  CatalogIcon,
  Content,
  useSidebarPinState,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Card, CardBody, Flex, Grid } from '@backstage/ui';
import { configApiRef } from '@backstage/frontend-plugin-api';
import {
  catalogApiRef,
  CATALOG_FILTER_EXISTS,
} from '@backstage/plugin-catalog-react';
import { SearchResult } from '@backstage/plugin-search-common';
import {
  DefaultResultListItem,
  SearchBar,
  SearchContextProvider,
  SearchFilter,
  SearchPagination,
  SearchResult as SearchResults,
  SearchResultPager,
  useSearch,
} from '@backstage/plugin-search-react';
import {
  type SearchFilterExtensionComponent,
  type SearchFilterResultTypeBlueprintParams,
  type SearchResultItemExtensionComponent,
  type SearchResultItemExtensionPredicate,
} from '@backstage/plugin-search-react/alpha';
import { SearchType } from '../components/SearchType';
import styles from './SearchPage.module.css';
import { UrlUpdater } from '../components/SearchPage/SearchPage';

export interface SearchPageProps {
  noTrack: boolean;
  items: Array<{
    predicate?: SearchResultItemExtensionPredicate;
    component: SearchResultItemExtensionComponent;
  }>;
  resultTypes: SearchFilterResultTypeBlueprintParams[];
  searchFilters: SearchFilterExtensionComponent[];
}

function SearchPageContent(props: SearchPageProps) {
  const getResultItemComponent = (result: SearchResult) =>
    props.items.find(item => item.predicate?.(result))?.component ??
    DefaultResultListItem;

  const { isMobile } = useSidebarPinState();
  const { types } = useSearch();
  const catalogApi = useApi(catalogApiRef);
  const configApi = useApi(configApiRef);

  return (
    <Content>
      <Grid.Root columns="12">
        <Grid.Item colSpan="12">
          <SearchBar debounceTime={100} />
        </Grid.Item>
        {!isMobile && (
          <Grid.Item colSpan="3">
            <Flex direction="column" gap="4">
              <SearchType.Accordion
                name="Result Type"
                defaultValue={configApi.getOptionalString('search.defaultType')}
                showCounts
                types={[
                  {
                    value: 'software-catalog',
                    name: 'Software Catalog',
                    icon: <CatalogIcon />,
                  },
                ].concat(props.resultTypes)}
              />
              <Card>
                <CardBody>
                  {types.includes('techdocs') && (
                    <SearchFilter.Select
                      className={styles.filter}
                      label="Entity"
                      name="name"
                      values={async () => {
                        const { items } = await catalogApi.getEntities({
                          fields: ['metadata.name'],
                          filter: {
                            'metadata.annotations.backstage.io/techdocs-ref':
                              CATALOG_FILTER_EXISTS,
                          },
                        });

                        const names = items.map(entity => entity.metadata.name);
                        names.sort();
                        return names;
                      }}
                    />
                  )}
                  <SearchFilter.Select
                    className={styles.filter}
                    label="Kind"
                    name="kind"
                    values={async () => {
                      const { facets } = await catalogApi.getEntityFacets({
                        facets: ['kind'],
                      });
                      return (facets.kind ?? [])
                        .map(facet => facet.value)
                        .sort((a, b) => a.localeCompare(b));
                    }}
                  />
                  <SearchFilter.Checkbox
                    className={styles.filter}
                    label="Lifecycle"
                    name="lifecycle"
                    values={['experimental', 'production']}
                  />
                  {props.searchFilters.map((SearchFilterComponent, index) => (
                    <SearchFilterComponent
                      key={index}
                      className={styles.filter}
                    />
                  ))}
                </CardBody>
              </Card>
            </Flex>
          </Grid.Item>
        )}
        <Grid.Item colSpan={isMobile ? '12' : '9'}>
          <SearchPagination />
          <SearchResults>
            {({ results }) => (
              <>
                {results.map((result, index) => {
                  const { document, ...rest } = result;
                  const SearchResultListItem = getResultItemComponent(result);
                  return (
                    <SearchResultListItem
                      {...rest}
                      key={index}
                      result={document}
                      noTrack={props.noTrack}
                    />
                  );
                })}
              </>
            )}
          </SearchResults>
          <SearchResultPager />
        </Grid.Item>
      </Grid.Root>
    </Content>
  );
}

export function SearchPage(props: SearchPageProps) {
  return (
    <SearchContextProvider>
      <UrlUpdater />
      <SearchPageContent {...props} />
    </SearchContextProvider>
  );
}
