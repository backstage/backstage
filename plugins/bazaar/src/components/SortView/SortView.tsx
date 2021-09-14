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
import { Entity } from '@backstage/catalog-model';
import { getBazaarMembers } from '../../util/dbRequests';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  CATALOG_FILTER_EXISTS,
} from '@backstage/plugin-catalog-react';
import { BazaarProject } from '../../util/types';

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
  const [bazaarMembers, setBazaarMembers] = useState<Map<string, number>>(
    new Map(),
  );
  const [bazaarProjects, setBazaarProjects] = useState<BazaarProject[]>([]);
  const catalogApi = useApi(catalogApiRef);
  const baseUrl = useApi(configApiRef)
    .getConfig('backend')
    .getString('baseUrl');

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

    const response = await fetch(`${baseUrl}/api/bazaar/entities`, {
      method: 'GET',
    }).then(resp => resp.json());

    const dbProjects: BazaarProject[] = [];
    const bazaarProjectRefs: string[] = [];

    response.data.forEach((project: any) => {
      dbProjects.push({
        entityRef: project.entity_ref,
        name: project.name,
        status: project.status,
        announcement: project.announcement,
        updatedAt: project.updated_at,
      });

      bazaarProjectRefs.push(project.entity_ref);
    });

    setBazaarMembers(await getBazaarMembers(dbProjects, baseUrl));
    setBazaarProjects(dbProjects);
    setCatalogEntities(
      entities.items.filter((entity: Entity) => {
        const catalogEntityRef = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;

        return !bazaarProjectRefs.includes(catalogEntityRef);
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
