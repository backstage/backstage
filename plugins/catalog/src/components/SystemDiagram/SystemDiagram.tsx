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

import { Entity } from '@backstage/catalog-model';
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

  const systemNodes = [];
  const systemEdges = [];

  if (catalogResponse && catalogResponse.items) {
    // push the system knowing this was called with it
    systemNodes.push({ id: `system:${entity.metadata.name}` });

    // console.log('Found ' + catalogResponse.items.length + ' catalog items...');
    // loop through and push any found elements into the graph arrays
    for (const catalogItem of catalogResponse.items) {
      //      console.log('Checking ' + catalogItem.metadata.name + '...');

      // Process anything assigned to the system
      // if (catalogItem.spec?.system && catalogItem.spec.system === entity.metadata.name) {
      //   systemNodes.push( { id: (catalogItem.kind + ':' + catalogItem.metadata.name).toLowerCase() } );
      //   systemEdges.push( { from: (catalogItem.kind + ':' + catalogItem.metadata.name).toLowerCase(),
      //   to: ('system:' + entity.metadata.name).toLowerCase(),
      //   label: 'specd'})
      // }

      // Process relationships
      if (catalogItem.relations) {
        // console.log(
        //   'Checking relations for ' + catalogItem.metadata.name + '...',
        // );
        for (const relation of catalogItem.relations) {
          // console.log(' - relation ' + relation.target.kind + '...');
          if (
            relation.target.kind === 'system' &&
            relation.target.name === entity.metadata.name
          ) {
            // console.log(
            //   ' + pushing a ' + catalogItem.kind + ' to the nodes...',
            // );
            systemNodes.push({
              id: `${catalogItem.kind}:${catalogItem.metadata.name}`.toLowerCase(),
            });
            // this duplicates showing the relationship, which isn't valuable
            // if (relation.type === 'partOf') {
            //   systemEdges.push({
            //     from: (catalogItem.kind + ':' + catalogItem.metadata.name).toLowerCase(),
            //     to: (relation.target.kind + ':' + relation.target.name).toLowerCase(),
            //     label: relation.type,
            //   });
            // }
            if (relation.type === 'hasPart') {
              systemEdges.push({
                from: `${relation.target.kind}:${relation.target.name}`.toLowerCase(),
                to: `${catalogItem.kind}:${catalogItem.metadata.name}`.toLowerCase(),
                label: relation.type,
              });
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

  // console.log('Resulting arrays:');
  // console.log(systemNodes);
  // console.log(systemEdges);

  return (
    <InfoCard title="System Diagram">
      <DependencyGraph
        nodes={systemNodes}
        edges={systemEdges}
        align={DependencyGraphTypes.Alignment.DOWN_LEFT}
        direction={DependencyGraphTypes.Direction.BOTTOM_TOP}
      />
    </InfoCard>
  );
}
