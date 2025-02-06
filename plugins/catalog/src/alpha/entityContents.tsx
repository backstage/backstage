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
  coreExtensionData,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import {
  EntityCardBlueprint,
  EntityContentBlueprint,
  OverviewEntityContentLauyoutBlueprint,
} from '@backstage/plugin-catalog-react/alpha';
import { buildFilterFn } from './filter/FilterWrapper';
import { useEntity } from '@backstage/plugin-catalog-react';

const catalogOverviewEntityContent = EntityContentBlueprint.makeWithOverrides({
  name: 'overview',
  inputs: {
    layouts: createExtensionInput([
      OverviewEntityContentLauyoutBlueprint.dataRefs.areas,
      OverviewEntityContentLauyoutBlueprint.dataRefs.defaultArea,
      OverviewEntityContentLauyoutBlueprint.dataRefs.filterFunction.optional(),
      OverviewEntityContentLauyoutBlueprint.dataRefs.filterExpression.optional(),
      OverviewEntityContentLauyoutBlueprint.dataRefs.component,
    ]),
    cards: createExtensionInput([
      coreExtensionData.reactElement,
      EntityContentBlueprint.dataRefs.filterFunction.optional(),
      EntityContentBlueprint.dataRefs.filterExpression.optional(),
      EntityCardBlueprint.dataRefs.area.optional(),
    ]),
  },
  factory: (originalFactory, { inputs }) => {
    return originalFactory({
      defaultPath: '/',
      defaultTitle: 'Overview',
      loader: async () => {
        const defaultLayout = await import('./EntityOverviewPage').then(
          m => m.EntityOverviewPage,
        );

        const Component = () => {
          const { entity } = useEntity();

          // Use the first layout that matches the entity filter
          const layout = inputs.layouts.find(l => {
            const filterFunction = l.get(
              OverviewEntityContentLauyoutBlueprint.dataRefs.filterFunction,
            );
            const filterExpression = l.get(
              OverviewEntityContentLauyoutBlueprint.dataRefs.filterExpression,
            );

            return buildFilterFn(filterFunction, filterExpression)(entity);
          });

          const Layout =
            layout?.get(
              OverviewEntityContentLauyoutBlueprint.dataRefs.component,
            ) ?? defaultLayout;

          return (
            <Layout
              buildFilterFn={buildFilterFn}
              cards={inputs.cards.map(card => ({
                element: card.get(coreExtensionData.reactElement),
                filterFunction: card.get(
                  EntityContentBlueprint.dataRefs.filterFunction,
                ),
                filterExpression: card.get(
                  EntityContentBlueprint.dataRefs.filterExpression,
                ),
                area:
                  card.get(EntityCardBlueprint.dataRefs.area) ??
                  layout?.get(
                    OverviewEntityContentLauyoutBlueprint.dataRefs.defaultArea,
                  ),
              }))}
            />
          );
        };

        return <Component />;
      },
    });
  },
});

export default [catalogOverviewEntityContent];
