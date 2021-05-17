/*
 * Copyright 2020 Spotify AB
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

import React, { useState } from 'react';
import {TableColumn} from '@backstage/core';
import { CatalogBasePageContents } from './CatalogPageBase';
import { CatalogFilterType } from '../CatalogFilter/CatalogFilter';
import { CatalogTable } from '../CatalogTable/CatalogTable';
import { EntityFilterGroupsProvider, useFilteredEntities } from '../../filter';
import { EntityRow } from '../CatalogTable/types';

export type CatalogPageProps = {
  initiallySelectedFilter?: string;
  columns?: TableColumn<EntityRow>[];
};

const CatalogPageContents = (props: CatalogPageProps) => {
  const [selectedTab, setSelectedTab] = useState<string>();
  const [
    selectedSidebarItem,
    setSelectedSidebarItem,
  ] = useState<CatalogFilterType>();
  const { loading, error, matchingEntities } = useFilteredEntities();

  const TableComponent = () => (
    <CatalogTable
      titlePreamble={selectedSidebarItem?.label ?? ''}
      loading={loading}
      error={error}
      view={selectedTab}
      columns={props.columns}
      entities={matchingEntities}
    />
  );

  return (
    <CatalogBasePageContents
      selectedTab={selectedTab}
      onSidebarSelectionChange={setSelectedSidebarItem}
      onHeaderTabChange={setSelectedTab}
      showHeaderTabs
      showSupportButton
      showManagedFilters
      TableComponent={TableComponent}
      {...props}
    />
  );
};

export const CatalogPage = (props: CatalogPageProps) => (
  <EntityFilterGroupsProvider>
    <CatalogPageContents {...props} />
  </EntityFilterGroupsProvider>
);
