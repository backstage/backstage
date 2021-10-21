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

import React, { useEffect, useState } from 'react';
import {
  Content,
  ContentHeader,
  SupportButton,
  Progress,
} from '@backstage/core-components';
import { AddProjectDialog } from '../AddProjectDialog';
import { AlertBanner } from '../AlertBanner';
import { ProjectPreview } from '../ProjectPreview/ProjectPreview';
import { Button, makeStyles, Link } from '@material-ui/core';
import { useAsyncFn } from 'react-use';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { BazaarProject } from '../../types';
import { bazaarApiRef } from '../../api';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles({
  container: {
    marginTop: '2rem',
  },
});

const filterCatalogEntities = (
  bazaarProjects: BazaarProject[],
  catalogEntities: Entity[],
) => {
  const bazaarProjectRefs = bazaarProjects.map(
    (project: BazaarProject) => project.entityRef,
  );

  const filtered = catalogEntities.filter((entity: Entity) => {
    return !bazaarProjectRefs?.includes(stringifyEntityRef(entity));
  });

  return filtered;
};

export const SortView = () => {
  const classes = useStyles();
  const [openAdd, setOpenAdd] = useState(false);
  const [openNoProjects, setOpenNoProjects] = useState(false);
  const bazaarApi = useApi(bazaarApiRef);
  const catalogApi = useApi(catalogApiRef);
  const [filteredCatalogEntites, setFilteredCatalogEntities] =
    useState<Entity[]>();

  const compareProjectsByDate = (
    a: BazaarProject,
    b: BazaarProject,
  ): number => {
    const dateA = new Date(a.updatedAt!).getTime();
    const dateB = new Date(b.updatedAt!).getTime();
    return dateB - dateA;
  };

  const handleCloseNoProjects = () => {
    setOpenNoProjects(false);
  };

  const [catalogEntities, fetchCatalogEntities] = useAsyncFn(async () => {
    const entities = await catalogApi.getEntities({
      filter: {
        kind: ['Component', 'Resource'],
      },
      fields: ['kind', 'metadata.name', 'metadata.namespace'],
    });

    return entities.items;
  });

  const [bazaarProjects, fetchBazaarProjects] = useAsyncFn(async () => {
    const response = await bazaarApi.getEntities();
    const dbProjects: BazaarProject[] = [];

    response.data.forEach((project: any) => {
      dbProjects.push({
        entityRef: project.entity_ref,
        name: project.name,
        status: project.status,
        announcement: project.announcement,
        community: project.community,
        updatedAt: project.updated_at,
        membersCount: project.members_count,
      });
    });

    return dbProjects;
  });

  useEffect(() => {
    fetchCatalogEntities();
    fetchBazaarProjects();
  }, [fetchBazaarProjects, fetchCatalogEntities]);

  useEffect(() => {
    const filteredCatalogEntities = filterCatalogEntities(
      bazaarProjects.value || [],
      catalogEntities.value || [],
    );

    if (filteredCatalogEntities) {
      setFilteredCatalogEntities(filteredCatalogEntities);
    }
  }, [bazaarProjects, catalogEntities]);

  if (catalogEntities.loading || bazaarProjects.loading) return <Progress />;

  if (catalogEntities.error)
    return <Alert severity="error">{catalogEntities.error.message}</Alert>;

  if (bazaarProjects.error)
    return <Alert severity="error">{bazaarProjects.error.message}</Alert>;

  return (
    <Content noPadding>
      <AlertBanner
        open={openNoProjects}
        message={
          <div>
            No project available. Please{' '}
            <Link
              style={{ color: 'inherit', fontWeight: 'bold' }}
              href="/create"
            >
              create a project
            </Link>{' '}
            from a template first.
          </div>
        }
        handleClose={handleCloseNoProjects}
      />
      <ContentHeader title="Latest updated">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (filteredCatalogEntites?.length !== 0) {
              setOpenAdd(true);
            } else {
              setOpenNoProjects(true);
            }
          }}
        >
          Add project
        </Button>
        <AddProjectDialog
          catalogEntities={filteredCatalogEntites || []}
          handleClose={() => {
            setOpenAdd(false);
          }}
          open={openAdd}
          fetchBazaarProjects={fetchBazaarProjects}
          fetchCatalogEntities={fetchCatalogEntities}
        />
        <SupportButton />
      </ContentHeader>
      <ProjectPreview
        bazaarProjects={bazaarProjects.value || []}
        sortingMethod={compareProjectsByDate}
      />
      <Content noPadding className={classes.container} />
    </Content>
  );
};
