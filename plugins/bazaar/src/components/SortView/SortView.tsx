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
import { Content, SupportButton } from '@backstage/core-components';
import { AddProjectDialog } from '../AddProjectDialog';
import { ProjectPreview } from '../ProjectPreview/ProjectPreview';
import { Button, makeStyles } from '@material-ui/core';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { BazaarProject } from '../../types';
import { bazaarApiRef } from '../../api';
import { Alert } from '@material-ui/lab';
import SearchBar from 'material-ui-search-bar';
import { sortByDate, sortByMembers, sortByTitle } from '../../util/sortMethods';
import { SortMethodSelector } from '../SortMethodSelector';
import { fetchCatalogItems } from '../../util/fetchMethods';
import { parseBazaarProject } from '../../util/parseMethods';

const useStyles = makeStyles({
  button: { minWidth: '11rem' },
  container: {
    marginTop: '2rem',
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    marginBottom: '1.2rem',
  },
  search: {
    marginRight: '1rem',
    height: '2.5rem',
    width: '35rem',
  },
});

const getUnlinkedCatalogEntities = (
  bazaarProjects: BazaarProject[],
  catalogEntities: Entity[],
) => {
  const bazaarProjectRefs = bazaarProjects.map(
    (project: BazaarProject) => project.entityRef,
  );

  return catalogEntities.filter((entity: Entity) => {
    return !bazaarProjectRefs?.includes(stringifyEntityRef(entity));
  });
};

/** @public */
export const SortView = () => {
  const bazaarApi = useApi(bazaarApiRef);
  const catalogApi = useApi(catalogApiRef);
  const classes = useStyles();
  const sortMethods = [sortByDate, sortByTitle, sortByMembers];
  const [sortMethodNbr, setSortMethodNbr] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [unlinkedCatalogEntities, setUnlinkedCatalogEntities] =
    useState<Entity[]>();

  const [catalogEntities, fetchCatalogEntities] = useAsyncFn(async () => {
    return await fetchCatalogItems(catalogApi);
  });

  const [bazaarProjects, fetchBazaarProjects] = useAsyncFn(async () => {
    const response = await bazaarApi.getProjects();
    const dbProjects: BazaarProject[] = [];

    response.data.forEach((project: any) => {
      dbProjects.push(parseBazaarProject(project));
    });

    return dbProjects;
  });

  const catalogEntityRefs = catalogEntities.value?.map((project: Entity) =>
    stringifyEntityRef(project),
  );

  const getSearchResults = () => {
    return bazaarProjects.value
      ?.filter(project => project.title.includes(searchValue))
      .sort(sortMethods[sortMethodNbr]);
  };

  useEffect(() => {
    const filterBrokenLinks = () => {
      if (catalogEntityRefs) {
        bazaarProjects.value?.forEach(async (project: BazaarProject) => {
          if (project.entityRef) {
            if (!catalogEntityRefs?.includes(project.entityRef)) {
              await bazaarApi.updateProject({
                ...project,
                entityRef: null,
              });
            }
          }
        });
      }
    };
    filterBrokenLinks();
  }, [
    bazaarApi,
    bazaarProjects.value,
    catalogEntityRefs,
    catalogEntities.value,
  ]);

  useEffect(() => {
    fetchCatalogEntities();
    fetchBazaarProjects();
  }, [fetchBazaarProjects, fetchCatalogEntities]);

  useEffect(() => {
    const unlinkedCEntities = getUnlinkedCatalogEntities(
      bazaarProjects.value || [],
      catalogEntities.value || [],
    );

    if (unlinkedCEntities) {
      setUnlinkedCatalogEntities(unlinkedCEntities);
    }
  }, [bazaarProjects, catalogEntities]);

  const handleSortMethodChange = (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>,
  ) => {
    setSortMethodNbr(
      typeof event.target.value === 'number' ? event.target.value : 0,
    );
  };

  if (catalogEntities.error)
    return <Alert severity="error">{catalogEntities.error.message}</Alert>;

  if (bazaarProjects.error)
    return <Alert severity="error">{bazaarProjects.error.message}</Alert>;

  return (
    <Content noPadding>
      <div className={classes.header}>
        <SortMethodSelector
          sortMethodNbr={sortMethodNbr}
          handleSortMethodChange={handleSortMethodChange}
        />

        <SearchBar
          className={classes.search}
          value={searchValue}
          onChange={newSortMethod => {
            setSearchValue(newSortMethod);
          }}
          onCancelSearch={() => {
            setSearchValue('');
          }}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => {
            setOpenAdd(true);
          }}
        >
          Add project
        </Button>
        <AddProjectDialog
          catalogEntities={unlinkedCatalogEntities || []}
          handleClose={() => {
            setOpenAdd(false);
          }}
          open={openAdd}
          fetchBazaarProjects={fetchBazaarProjects}
          fetchCatalogEntities={fetchCatalogEntities}
        />
        <SupportButton />
      </div>
      <ProjectPreview
        bazaarProjects={getSearchResults() || []}
        fetchBazaarProjects={fetchBazaarProjects}
        catalogEntities={unlinkedCatalogEntities || []}
        height="large"
      />
      <Content noPadding className={classes.container} />
    </Content>
  );
};
