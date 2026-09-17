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

import {
  coreExtensionData,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import {
  EntityCardBlueprint,
  EntityContentBlueprint,
  EntityContentLayoutBlueprint,
} from '@backstage/plugin-catalog-react/alpha';
import { buildFilterFn } from './filter/FilterWrapper';

export const catalogOverviewEntityContent =
  EntityContentBlueprint.makeWithOverrides({
    name: 'overview',
    inputs: {
      layouts: createExtensionInput([
        EntityContentLayoutBlueprint.dataRefs.filterFunction.optional(),
        EntityContentLayoutBlueprint.dataRefs.filterExpression.optional(),
        EntityContentLayoutBlueprint.dataRefs.component,
      ]),
      cards: createExtensionInput([
        coreExtensionData.reactElement,
        EntityContentBlueprint.dataRefs.filterFunction.optional(),
        EntityContentBlueprint.dataRefs.filterExpression.optional(),
        EntityCardBlueprint.dataRefs.type.optional(),
      ]),
    },
    factory: (originalFactory, { node, inputs }) => {
      return originalFactory({
        path: '/',
        title: 'Overview',
        group: 'overview',
        loader: async () => {
          const { CatalogOverviewPage } = await import(
            './components/CatalogOverviewPage'
          );
          const layouts = inputs.layouts.map(layout => ({
            filter: buildFilterFn(
              layout.get(EntityContentLayoutBlueprint.dataRefs.filterFunction),
              layout.get(
                EntityContentLayoutBlueprint.dataRefs.filterExpression,
              ),
            ),
            Component: layout.get(
              EntityContentLayoutBlueprint.dataRefs.component,
            ),
          }));

          const cards = inputs.cards.map(card => ({
            element: card.get(coreExtensionData.reactElement),
            type: card.get(EntityCardBlueprint.dataRefs.type),
            filter: buildFilterFn(
              card.get(EntityContentBlueprint.dataRefs.filterFunction),
              card.get(EntityContentBlueprint.dataRefs.filterExpression),
            ),
          }));

          return (
            <CatalogOverviewPage node={node} layouts={layouts} cards={cards} />
          );
        },
      });
    },
  });

export default [catalogOverviewEntityContent];
