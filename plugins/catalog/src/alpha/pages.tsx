/*
 * Copyright 2023 The Backstage Authors
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

import React from 'react';
import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import {
  coreExtensionData,
  createExtensionInput,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import {
  AsyncEntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import {
  EntityHeaderBlueprint,
  EntityContentBlueprint,
  defaultEntityContentGroups,
} from '@backstage/plugin-catalog-react/alpha';
import { rootRouteRef } from '../routes';
import { useEntityFromUrl } from '../components/CatalogEntityPage/useEntityFromUrl';
import { buildFilterFn } from './filter/FilterWrapper';
import { EntityHeader } from './components/EntityHeader';

export const catalogPage = PageBlueprint.makeWithOverrides({
  inputs: {
    filters: createExtensionInput([coreExtensionData.reactElement]),
  },
  factory(originalFactory, { inputs }) {
    return originalFactory({
      defaultPath: '/catalog',
      routeRef: convertLegacyRouteRef(rootRouteRef),
      loader: async () => {
        const { BaseCatalogPage } = await import('../components/CatalogPage');
        const filters = inputs.filters.map(filter =>
          filter.get(coreExtensionData.reactElement),
        );
        return compatWrapper(<BaseCatalogPage filters={<>{filters}</>} />);
      },
    });
  },
});

export const catalogEntityPage = PageBlueprint.makeWithOverrides({
  name: 'entity',
  inputs: {
    header: createExtensionInput(
      [EntityHeaderBlueprint.dataRefs.element.optional()],
      { singleton: true, optional: true },
    ),
    contents: createExtensionInput([
      coreExtensionData.reactElement,
      coreExtensionData.routePath,
      coreExtensionData.routeRef.optional(),
      EntityContentBlueprint.dataRefs.title,
      EntityContentBlueprint.dataRefs.filterFunction.optional(),
      EntityContentBlueprint.dataRefs.filterExpression.optional(),
      EntityContentBlueprint.dataRefs.group.optional(),
    ]),
  },
  config: {
    schema: {
      groups: z =>
        z
          .array(z.record(z.string(), z.object({ title: z.string() })))
          .optional(),
    },
  },
  factory(originalFactory, { config, inputs }) {
    return originalFactory({
      defaultPath: '/catalog/:namespace/:kind/:name',
      routeRef: convertLegacyRouteRef(entityRouteRef),
      loader: async () => {
        const { EntityLayout } = await import('./components/EntityLayout');

        type Groups = Record<
          string,
          { title: string; items: Array<(typeof inputs.contents)[0]> }
        >;

        const header = inputs.header?.get(
          EntityHeaderBlueprint.dataRefs.element,
        ) ?? <EntityHeader />;

        let groups = Object.entries(defaultEntityContentGroups).reduce<Groups>(
          (rest, group) => {
            const [groupId, groupValue] = group;
            return {
              ...rest,
              [groupId]: { title: groupValue, items: [] },
            };
          },
          {},
        );

        // config groups override default groups
        if (config.groups) {
          groups = config.groups.reduce<Groups>((rest, group) => {
            const [groupId, groupValue] = Object.entries(group)[0];
            return {
              ...rest,
              [groupId]: { title: groupValue.title, items: [] },
            };
          }, {});
        }

        for (const output of inputs.contents) {
          const itemId = output.node.spec.id;
          const itemTitle = output.get(EntityContentBlueprint.dataRefs.title);
          const itemGroup = output.get(EntityContentBlueprint.dataRefs.group);
          const group = itemGroup && groups[itemGroup];
          if (!group) {
            groups[itemId] = { title: itemTitle, items: [output] };
            continue;
          }
          group.items.push(output);
        }

        const Component = () => {
          return (
            <AsyncEntityProvider {...useEntityFromUrl()}>
              <EntityLayout header={header}>
                {Object.values(groups).flatMap(({ title, items }) =>
                  items.map(output => (
                    <EntityLayout.Route
                      group={title}
                      key={output.get(coreExtensionData.routePath)}
                      path={output.get(coreExtensionData.routePath)}
                      title={output.get(EntityContentBlueprint.dataRefs.title)}
                      if={buildFilterFn(
                        output.get(
                          EntityContentBlueprint.dataRefs.filterFunction,
                        ),
                        output.get(
                          EntityContentBlueprint.dataRefs.filterExpression,
                        ),
                      )}
                    >
                      {output.get(coreExtensionData.reactElement)}
                    </EntityLayout.Route>
                  )),
                )}
              </EntityLayout>
            </AsyncEntityProvider>
          );
        };

        return compatWrapper(<Component />);
      },
    });
  },
});

export default [catalogPage, catalogEntityPage];
