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
  coreExtensionData,
  createExtensionBlueprint,
  ExtensionBoundary,
  RouteRef,
} from '@backstage/frontend-plugin-api';
import {
  entityContentTitleDataRef,
  entityFilterFunctionDataRef,
  entityFilterExpressionDataRef,
  entityContentGroupDataRef,
  defaultEntityContentGroups,
} from './extensionData';
import { EntityPredicate } from '../predicates';
import { resolveEntityFilterData } from './resolveEntityFilterData';
import { createEntityPredicateSchema } from '../predicates/createEntityPredicateSchema';
import { Entity } from '@backstage/catalog-model';

/**
 * @alpha
 * Creates an EntityContent extension.
 */
export const EntityContentBlueprint = createExtensionBlueprint({
  kind: 'entity-content',
  attachTo: { id: 'page:catalog/entity', input: 'contents' },
  output: [
    coreExtensionData.reactElement,
    coreExtensionData.routePath,
    entityContentTitleDataRef,
    coreExtensionData.routeRef.optional(),
    entityFilterFunctionDataRef.optional(),
    entityFilterExpressionDataRef.optional(),
    entityContentGroupDataRef.optional(),
  ],
  dataRefs: {
    title: entityContentTitleDataRef,
    filterFunction: entityFilterFunctionDataRef,
    filterExpression: entityFilterExpressionDataRef,
    group: entityContentGroupDataRef,
  },
  config: {
    schema: {
      path: z => z.string().optional(),
      title: z => z.string().optional(),
      filter: z =>
        z.union([z.string(), createEntityPredicateSchema(z)]).optional(),
      group: z => z.literal(false).or(z.string()).optional(),
    },
  },
  *factory(
    {
      loader,
      defaultPath,
      defaultTitle,
      defaultGroup,
      filter,
      routeRef,
    }: {
      loader: () => Promise<JSX.Element>;
      defaultPath: string;
      defaultTitle: string;
      defaultGroup?: keyof typeof defaultEntityContentGroups | (string & {});
      routeRef?: RouteRef;
      filter?: string | EntityPredicate | ((entity: Entity) => boolean);
    },
    { node, config },
  ) {
    const path = config.path ?? defaultPath;
    const title = config.title ?? defaultTitle;
    const group = config.group ?? defaultGroup;

    yield coreExtensionData.reactElement(ExtensionBoundary.lazy(node, loader));

    yield coreExtensionData.routePath(path);

    yield entityContentTitleDataRef(title);

    if (routeRef) {
      yield coreExtensionData.routeRef(routeRef);
    }

    yield* resolveEntityFilterData(filter, config, node);

    if (group) {
      yield entityContentGroupDataRef(group);
    }
  },
});
