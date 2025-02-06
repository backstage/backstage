/*
 * Copyright 2024 The Backstage Authors
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
  ExtensionBoundary,
  coreExtensionData,
  createExtensionBlueprint,
} from '@backstage/frontend-plugin-api';
import {
  entityFilterFunctionDataRef,
  entityFilterExpressionDataRef,
  entityCardAreaDataRef,
  defaultEntityCardArea,
} from './extensionData';

/**
 * @alpha
 * A blueprint for creating cards for the entity pages in the catalog.
 */
export const EntityCardBlueprint = createExtensionBlueprint({
  kind: 'entity-card',
  attachTo: { id: 'entity-content:catalog/overview', input: 'cards' },
  output: [
    coreExtensionData.reactElement,
    entityFilterFunctionDataRef.optional(),
    entityFilterExpressionDataRef.optional(),
    entityCardAreaDataRef.optional(),
  ],
  dataRefs: {
    filterFunction: entityFilterFunctionDataRef,
    filterExpression: entityFilterExpressionDataRef,
    area: entityCardAreaDataRef,
  },
  config: {
    schema: {
      filter: z => z.string().optional(),
      area: z => z.string().optional(),
    },
  },
  *factory(
    {
      loader,
      filter,
      defaultArea,
    }: {
      loader: () => Promise<JSX.Element>;
      filter?:
        | typeof entityFilterFunctionDataRef.T
        | typeof entityFilterExpressionDataRef.T;
      defaultArea?: (typeof defaultEntityCardArea)[number];
    },
    { node, config },
  ) {
    yield coreExtensionData.reactElement(ExtensionBoundary.lazy(node, loader));

    if (config.filter) {
      yield entityFilterExpressionDataRef(config.filter);
    } else if (typeof filter === 'string') {
      yield entityFilterExpressionDataRef(filter);
    } else if (typeof filter === 'function') {
      yield entityFilterFunctionDataRef(filter);
    }

    const area = config.area ?? defaultArea;
    if (area) {
      yield entityCardAreaDataRef(area);
    }
  },
});
