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

import React, { useState } from 'react';
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
import { useAsync } from 'react-use';
import {
  Entity,
  EntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  CATALOG_FILTER_EXISTS,
} from '@backstage/plugin-catalog-react';
import { BazaarProject } from '../../types';
import { bazaarApiRef } from '../../api';

const useStyles = makeStyles({
  container: {
    marginTop: '2rem',
  },
});

export const SortView = () => {
  const classes = useStyles();
  const [openAdd, setOpenAdd] = useState(false);
  const [openNoProjects, setOpenNoProjects] = useState(false);
  const [catalogEntities, setCatalogEntities] = useState<Entity[]>([]);
  const [bazaarMembers, setBazaarMembers] = useState<Map<EntityRef, number>>(
    new Map(),
  );
  const [bazaarProjects, setBazaarProjects] = useState<BazaarProject[]>([]);
  const bazaarApi = useApi(bazaarApiRef);
  const catalogApi = useApi(catalogApiRef);

  const compareProjectsByDate = (
    a: BazaarProject,
    b: BazaarProject,
  ): number => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  };

  const handleCloseNoProjects = () => {
    setOpenNoProjects(false);
  };

  const { loading } = useAsync(async () => {
    const entities = await catalogApi.getEntities({
      filter: {
        kind: 'Component',
        'metadata.annotations.backstage.io/edit-url': CATALOG_FILTER_EXISTS,
      },
      fields: ['apiVersion', 'kind', 'metadata', 'spec'],
    });

    const response = await bazaarApi.getEntities();
    const dbProjects: BazaarProject[] = [];
    const bazaarProjectRefs: string[] = [];

    response.data.forEach((project: any) => {
      dbProjects.push({
        entityRef: project.entity_ref,
        name: project.name,
        status: project.status,
        announcement: project.announcement,
        community: project.community,
        updatedAt: project.updated_at,
      });

      bazaarProjectRefs.push(project.entity_ref);
    });

    setBazaarMembers(await bazaarApi.getMemberCounts(dbProjects));
    setBazaarProjects(dbProjects);
    setCatalogEntities(
      entities.items.filter((entity: Entity) => {
        return !bazaarProjectRefs.includes(stringifyEntityRef(entity));
      }),
    );
  });

  if (loading) {
    return <Progress />;
  }

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
            if (catalogEntities.length !== 0) {
              setOpenAdd(true);
            } else {
              setOpenNoProjects(true);
            }
          }}
        >
          Add project
        </Button>
        <AddProjectDialog
          catalogEntities={catalogEntities}
          handleClose={() => {
            setOpenAdd(false);
          }}
          open={openAdd}
          setBazaarProjects={setBazaarProjects}
          setCatalogEntities={setCatalogEntities}
        />
        <SupportButton />
      </ContentHeader>
      <ProjectPreview
        bazaarProjects={bazaarProjects || []}
        sortingMethod={compareProjectsByDate}
        bazaarMembers={bazaarMembers}
      />
      <Content noPadding className={classes.container} />
    </Content>
  );
};
