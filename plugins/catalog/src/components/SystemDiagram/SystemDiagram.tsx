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
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import {
  DependencyGraph,
  DependencyGraphTypes,
  InfoCard,
  Progress,
  useApi,
} from '@backstage/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useAsync } from 'react-use';

type SystemDiagramProps = {
  entity: Entity;
  variant?: string;
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
  const systemNodes = [];
  const systemEdges = [];

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
          id: `${catalogItem.kind}:${catalogItem.metadata.name}`.toLowerCase(),
        });

        // check relations of the entity to see if it relates to other entities
        // note those relations may, or may not, be explicitly
        // assigned to the system
        if (catalogItem.relations) {
          for (const relation of catalogItem.relations) {
            switch (relation.type) {
              case RELATION_PROVIDES_API:
                systemEdges.push({
                  to: `${catalogItem.kind}:${catalogItem.metadata.name}`.toLowerCase(),
                  from: `${relation.target.kind}:${relation.target.name}`.toLowerCase(),
                  label: 'provides API',
                });
                break;
              case RELATION_PART_OF:
                systemEdges.push({
                  from: `${catalogItem.kind}:${catalogItem.metadata.name}`.toLowerCase(),
                  to: `${relation.target.kind}:${relation.target.name}`.toLowerCase(),
                  label: 'part of',
                });
                break;
              default:
                break;
            }
          }
        }
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
      <DependencyGraph
        nodes={systemNodes}
        edges={systemEdges}
        paddingX={15}
        direction={DependencyGraphTypes.Direction.BOTTOM_TOP}
      />
    </InfoCard>
  );
}
