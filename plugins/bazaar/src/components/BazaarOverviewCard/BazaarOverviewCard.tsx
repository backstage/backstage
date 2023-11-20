/*
 * Copyright 2022 The Backstage Authors
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
import { ProjectPreview } from '../ProjectPreview/ProjectPreview';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import type { BazaarProject } from '../../types';
import { bazaarApiRef } from '../../api';
import { fetchCatalogItems } from '../../util/fetchMethods';
import { parseBazaarProject } from '../../util/parseMethods';
import { ErrorPanel, InfoCard, Link } from '@backstage/core-components';
import { bazaarPlugin } from '../../plugin';
import { IconButton } from '@material-ui/core';
import StorefrontIcon from '@material-ui/icons/Storefront';

/** @public */
export type BazaarOverviewCardProps = {
  title?: string;
  order: 'latest' | 'random';
  fullWidth?: boolean;
  fullHeight?: boolean;
};

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
export const BazaarOverviewCard = (props: BazaarOverviewCardProps) => {
  const { title, order, fullWidth = false, fullHeight = false } = props;
  const bazaarApi = useApi(bazaarApiRef);
  const catalogApi = useApi(catalogApiRef);
  const root = useRouteRef(bazaarPlugin.routes.root);

  const defaultTitle =
    order === 'latest' ? 'Bazaar Latest Projects' : 'Bazaar Random Projects';

  const bazaarLink = {
    title: 'Go to Bazaar',
    link: `${root()}`,
  };

  const [unlinkedCatalogEntities, setUnlinkedCatalogEntities] =
    useState<Entity[]>();

  const [catalogEntities, fetchCatalogEntities] = useAsyncFn(async () => {
    return await fetchCatalogItems(catalogApi);
  });

  const [bazaarProjects, fetchBazaarProjects] = useAsyncFn(async () => {
    const limit = fullWidth ? 6 : 3;
    const response = await bazaarApi.getProjects(limit, order);
    return response.data.map(parseBazaarProject) as BazaarProject[];
  });

  const catalogEntityRefs = catalogEntities.value?.map((project: Entity) =>
    stringifyEntityRef(project),
  );

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

  if (catalogEntities.error) {
    return <ErrorPanel error={catalogEntities.error} />;
  }

  if (bazaarProjects.error) {
    return <ErrorPanel error={bazaarProjects.error} />;
  }

  return (
    <InfoCard
      title={title ?? defaultTitle}
      action={
        <IconButton>
          <Link to={bazaarLink.link} title={bazaarLink.title}>
            <StorefrontIcon />
          </Link>
        </IconButton>
      }
    >
      <ProjectPreview
        bazaarProjects={bazaarProjects.value || []}
        fetchBazaarProjects={fetchBazaarProjects}
        catalogEntities={unlinkedCatalogEntities || []}
        useTablePagination={false}
        gridSize={fullWidth ? 2 : 4}
        height={fullHeight ? 'large' : 'small'}
      />
    </InfoCard>
  );
};
