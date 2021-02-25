/*
 * Copyright 2021 Spotify AB
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
  Entity,
  RELATION_PROVIDES_API,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  catalogApiRef,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import {
  DependencyGraph,
  DependencyGraphTypes,
  InfoCard,
  Progress,
  useApi,
} from '@backstage/core';
import { Box, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
import React from 'react';
import { useAsync } from 'react-use';

type SystemDiagramProps = {
  entity: Entity;
};

const getEntityNodeId = (entity: Entity) => {
  return `${entity.kind}:${entity.metadata.name}`.toLowerCase();
};

export function SystemDiagram({ entity }: SystemDiagramProps) {
  const catalogApi = useApi(catalogApiRef);
  const { loading, error, value: catalogResponse } = useAsync(() => {
    return catalogApi.getEntities({
      filter: {
        kind: ['Component', 'API', 'Resource', 'System', 'Domain'],
      },
    });
  }, [catalogApi]);

  const currentSystemName = entity.metadata.name;
  const currentSystemNode = `system:${entity.metadata.name}`.toLowerCase();
  const systemNodes = new Array<{ id: string }>();
  const systemEdges = new Array<{ from: string; to: string; label: string }>();

  if (catalogResponse && catalogResponse.items) {
    for (const catalogItem of catalogResponse.items) {
      // pick out the system itself
      if (catalogItem.metadata.name === entity.metadata.name) {
        systemNodes.push({
          id: currentSystemNode,
        });

        // check if the system has an assigned domain
        // even if the domain object doesn't exist in the catalog, display it in the map
        if (catalogItem.spec?.domain) {
          systemNodes.push({
            id: `domain:${catalogItem.spec.domain}`.toLowerCase(),
          });
          systemEdges.push({
            from: currentSystemNode,
            to: `domain:${catalogItem.spec.domain}`.toLowerCase(),
            label: 'part of',
          });
        }
      }

      // process any entity assigned to the system
      if (catalogItem.spec?.system === currentSystemName) {
        systemNodes.push({
          id: getEntityNodeId(catalogItem),
        });

        // Check relations of the entity assigned to this system to see
        // if it relates to other entities.
        // Note those relations may, or may not, be explicitly
        // assigned to the system.

        const catalogItemRelations_partOf = getEntityRelations(
          catalogItem,
          RELATION_PART_OF,
        );
        catalogItemRelations_partOf.forEach(foundRelation =>
          systemEdges.push({
            from: getEntityNodeId(catalogItem),
            to: `${foundRelation.kind}:${foundRelation.name}`.toLowerCase(),
            label: 'part of',
          }),
        );

        const catalogItemRelations_providesApi = getEntityRelations(
          catalogItem,
          RELATION_PROVIDES_API,
        );
        catalogItemRelations_providesApi.forEach(foundRelation =>
          systemEdges.push({
            from: getEntityNodeId(catalogItem),
            to: `${foundRelation.kind}:${foundRelation.name}`.toLowerCase(),
            label: 'provides API',
          }),
        );
      }
    }
  }

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <InfoCard title="System Diagram">
      <div>
        <DependencyGraph
          nodes={systemNodes}
          edges={systemEdges}
          nodeMargin={10}
          direction={DependencyGraphTypes.Direction.BOTTOM_TOP}
        />
      </div>
      <Box m={1} />
      <Typography
        variant="caption"
        style={{ display: 'block', textAlign: 'right' }}
      >
        <ZoomOutMap style={{ verticalAlign: 'bottom' }} /> Use pinch &amp; zoom
        to move around the diagram.
      </Typography>
    </InfoCard>
  );
}
