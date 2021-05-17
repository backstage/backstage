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

import React, { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, makeStyles } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import {
  configApiRef,
  Content,
  ContentHeader,
  errorApiRef,
  SupportButton,
  useApi,
  useRouteRef,
} from '@backstage/core';
import {
  catalogApiRef,
  isOwnerOf,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import CatalogLayout from './CatalogLayout';
import { CatalogTabs, LabeledComponentType } from './CatalogTabs';
import {
  ButtonGroup,
  CatalogFilter,
  CatalogFilterType,
} from '../CatalogFilter/CatalogFilter';
import { useOwnUser } from '../useOwnUser';
import { ResultsFilter } from '../ResultsFilter/ResultsFilter';
import { CatalogTableProps } from '../CatalogTable/CatalogTable';
import { EntityFilterGroupsProvider, useFilteredEntities } from '../../filter';
import { createComponentRouteRef } from '../../routes';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
  contentWrapperWithoutFilterGroups: {
    display: 'block',
  },
  buttonSpacing: {
    marginLeft: theme.spacing(2),
  },
}));

export type CatalogBaseTableProps = Pick<CatalogTableProps, 'error' | 'view'>;

export type CatalogBasePageProps = {
  initiallySelectedFilter?: string;
  selectedTab?: string;
  onHeaderTabChange?: Function;
  onSidebarSelectionChange?: Function;
  createComponentLinkText?: string;
  supportButtonText?: string;
  showHeaderTabs: boolean;
  showManagedFilters: boolean;
  showSupportButton: boolean;
  LayoutComponent?: React.ReactType<any>;
  TableComponent: React.ReactType<CatalogBaseTableProps>;
};

export const CatalogBasePageContents = ({
  initiallySelectedFilter,
  selectedTab,
  onHeaderTabChange,
  onSidebarSelectionChange,
  createComponentLinkText,
  supportButtonText,
  showHeaderTabs,
  showManagedFilters,
  showSupportButton,
  LayoutComponent = CatalogLayout,
  TableComponent,
}: CatalogBasePageProps) => {
  const styles = useStyles();
  const { reload, availableTags, isCatalogEmpty } = useFilteredEntities();
  const configApi = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);
  const { isStarredEntity } = useStarredEntities();
  const [selectedSidebarItem] = useState<CatalogFilterType>();

  const orgName = configApi.getOptionalString('organization.name') ?? 'Company';
  const initiallySelectedFilterValue =
    selectedSidebarItem?.id ?? initiallySelectedFilter ?? 'owned';

  const createComponentLink = useRouteRef(createComponentRouteRef);
  const addMockData = useCallback(async () => {
    try {
      const promises: Promise<unknown>[] = [];
      const root = configApi.getConfig('catalog.exampleEntityLocations');
      for (const type of root.keys()) {
        for (const target of root.getStringArray(type)) {
          promises.push(catalogApi.addLocation({ target }));
        }
      }
      await Promise.all(promises);
      await reload();
    } catch (err) {
      errorApi.post(err);
    }
  }, [catalogApi, configApi, errorApi, reload]);

  const tabs = useMemo<LabeledComponentType[]>(
    () => [
      {
        id: 'service',
        label: 'Services',
      },
      {
        id: 'website',
        label: 'Websites',
      },
      {
        id: 'library',
        label: 'Libraries',
      },
      {
        id: 'documentation',
        label: 'Documentation',
      },
      {
        id: 'other',
        label: 'Other',
      },
    ],
    [],
  );

  const { value: user } = useOwnUser();

  const filterGroups = useMemo<ButtonGroup[]>(
    () => [
      {
        name: 'Personal',
        items: [
          {
            id: 'owned',
            label: 'Owned',
            icon: SettingsIcon,
            filterFn: entity => user !== undefined && isOwnerOf(user, entity),
          },
          {
            id: 'starred',
            label: 'Starred',
            icon: StarIcon,
            filterFn: isStarredEntity,
          },
        ],
      },
      {
        name: orgName,
        items: [
          {
            id: 'all',
            label: 'All',
            filterFn: () => true,
          },
        ],
      },
    ],
    [isStarredEntity, orgName, user],
  );

  const showAddExampleEntities =
    configApi.has('catalog.exampleEntityLocations') && isCatalogEmpty;

  return (
    <LayoutComponent>
      {showHeaderTabs && (
        <CatalogTabs
          tabs={tabs}
          onChange={({ label }) =>
            onHeaderTabChange && onHeaderTabChange(label)
          }
        />
      )}
      <Content>
        <ContentHeader title={selectedTab ?? ''}>
          {createComponentLink && (
            <Button
              component={RouterLink}
              variant="contained"
              color="primary"
              to={createComponentLink()}
            >
              {createComponentLinkText ?? 'Create Component'}
            </Button>
          )}
          {showAddExampleEntities && (
            <Button
              className={styles.buttonSpacing}
              variant="outlined"
              color="primary"
              onClick={addMockData}
            >
              Add example components
            </Button>
          )}
          {showSupportButton && (
            <SupportButton>{supportButtonText ?? 'All your software catalog entities'}</SupportButton>
          )}
        </ContentHeader>
        <div
          className={
            showManagedFilters
              ? styles.contentWrapper
              : styles.contentWrapperWithoutFilterGroups
          }
        >
          {showManagedFilters && (
            <div>
              <CatalogFilter
                buttonGroups={filterGroups}
                onChange={({ label, id }) =>
                  onSidebarSelectionChange &&
                  onSidebarSelectionChange({ label, id })
                }
                initiallySelected={initiallySelectedFilterValue}
              />
              <ResultsFilter availableTags={availableTags} />
            </div>
          )}
          <TableComponent />
        </div>
      </Content>
    </LayoutComponent>
  );
};

export const CatalogBasePage = (props: CatalogBasePageProps) => (
  <EntityFilterGroupsProvider>
    <CatalogBasePageContents {...props} />
  </EntityFilterGroupsProvider>
);
