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
import { ErrorPanel, InfoCard } from '@backstage/core-components';
import { bazaarPlugin } from '../../plugin';

/** @public */
export type BazaarOverviewCardProps = {
  order: 'latest' | 'random';
  limit: number;
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
  const { order, limit } = props;
  const bazaarApi = useApi(bazaarApiRef);
  const catalogApi = useApi(catalogApiRef);
  const root = useRouteRef(bazaarPlugin.routes.root);

  const bazaarLink = {
    title: 'Go to Bazaar',
    link: root.toString(),
  };

  const [unlinkedCatalogEntities, setUnlinkedCatalogEntities] =
    useState<Entity[]>();

  const [catalogEntities, fetchCatalogEntities] = useAsyncFn(async () => {
    return await fetchCatalogItems(catalogApi);
  });

  const [bazaarProjects, fetchBazaarProjects] = useAsyncFn(async () => {
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
      title={
        order === 'latest' ? 'Bazaar Latest Projects' : 'Bazaar Random Projects'
      }
      deepLink={bazaarLink}
    >
      <ProjectPreview
        bazaarProjects={bazaarProjects.value || []}
        fetchBazaarProjects={fetchBazaarProjects}
        catalogEntities={unlinkedCatalogEntities || []}
        useTablePagination={false}
        fullHeight={false}
        fixedWidth
      />
    </InfoCard>
  );
};
