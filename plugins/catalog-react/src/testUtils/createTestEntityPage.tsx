/*
 * Copyright 2025 The Backstage Authors
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

import { Fragment, ReactNode } from 'react';
import { Entity } from '@backstage/catalog-model';
import {
  coreExtensionData,
  createExtensionInput,
  PageBlueprint,
  ExtensionDefinition,
  useApiHolder,
} from '@backstage/frontend-plugin-api';
import { Routes, Route } from 'react-router-dom';
import { EntityProvider } from '../hooks/useEntity';
import {
  EntityCardBlueprint,
  EntityContentBlueprint,
} from '../alpha/blueprints';
import { entityRouteRef } from '../routes';
import { catalogApiRef } from '../api';
import { catalogApiMock } from './catalogApiMock';
import { TestApiProvider } from '@backstage/frontend-test-utils';

/**
 * Options for creating a test entity page.
 * @public
 */
export interface TestEntityPageOptions {
  /**
   * The entity to provide in the EntityProvider context.
   */
  entity: Entity;
}

/**
 * Creates a test entity page extension that provides EntityProvider context
 * and accepts entity extensions (cards, content) as inputs.
 *
 * This utility simplifies testing entity extensions by eliminating the need
 * for manual EntityProvider wrapping and route configuration.
 *
 * @remarks
 *
 * The test page uses input redirects to accept both:
 * - Entity cards (normally attach to `entity-content:catalog/overview`)
 * - Entity content (normally attach to `page:catalog/entity`)
 *
 * Cards are rendered in a simple container. Content extensions follow
 * standard routing behavior, with a single content optimization that
 * renders directly without routing.
 *
 * @example
 * ```tsx
 * import { createTestEntityPage } from '@backstage/plugin-catalog-react/testUtils';
 * import { renderTestApp } from '@backstage/frontend-test-utils';
 *
 * const mockEntity = {
 *   apiVersion: 'backstage.io/v1alpha1',
 *   kind: 'Component',
 *   metadata: { name: 'test' },
 *   spec: { type: 'service' },
 * };
 *
 * // Testing an entity card
 * renderTestApp({
 *   extensions: [createTestEntityPage({ entity: mockEntity }), myEntityCard],
 * });
 *
 * // Testing entity content
 * renderTestApp({
 *   extensions: [createTestEntityPage({ entity: mockEntity }), myEntityContent],
 * });
 * ```
 *
 * @public
 */
export function createTestEntityPage(
  options: TestEntityPageOptions,
): ExtensionDefinition {
  const { entity } = options;

  return PageBlueprint.makeWithOverrides({
    name: 'test-entity',
    inputs: {
      // Redirect cards from entity-content:catalog/overview
      cards: createExtensionInput(
        [
          coreExtensionData.reactElement,
          EntityContentBlueprint.dataRefs.filterFunction.optional(),
          EntityContentBlueprint.dataRefs.filterExpression.optional(),
          EntityCardBlueprint.dataRefs.type.optional(),
        ],
        {
          replaces: [{ id: 'entity-content:catalog/overview', input: 'cards' }],
        },
      ),
      // Redirect contents from page:catalog/entity
      contents: createExtensionInput(
        [
          coreExtensionData.reactElement,
          coreExtensionData.routePath,
          coreExtensionData.routeRef.optional(),
          EntityContentBlueprint.dataRefs.title,
          EntityContentBlueprint.dataRefs.filterFunction.optional(),
          EntityContentBlueprint.dataRefs.filterExpression.optional(),
          EntityContentBlueprint.dataRefs.group.optional(),
        ],
        {
          replaces: [{ id: 'page:catalog/entity', input: 'contents' }],
        },
      ),
    },
    factory: (originalFactory, { inputs }) => {
      return originalFactory({
        path: '/',
        routeRef: entityRouteRef,
        loader: async () => {
          // Process cards with entity filtering
          const cards = inputs.cards
            .filter(card =>
              (
                card.get(EntityContentBlueprint.dataRefs.filterFunction) ??
                (() => true)
              )(entity),
            )
            .map(card => ({
              element: card.get(coreExtensionData.reactElement),
              type: card.get(EntityCardBlueprint.dataRefs.type),
            }));

          // Process contents with entity filtering
          const contents = inputs.contents
            .filter(content =>
              (
                content.get(EntityContentBlueprint.dataRefs.filterFunction) ??
                (() => true)
              )(entity),
            )
            .map(content => ({
              element: content.get(coreExtensionData.reactElement),
              path: content.get(coreExtensionData.routePath),
              title: content.get(EntityContentBlueprint.dataRefs.title),
            }));

          if (contents.length === 0 && cards.length === 0) {
            return <div data-testid="empty-entity-page" />;
          }

          return (
            <MockEntityApiProvider entity={entity}>
              <EntityProvider entity={entity}>
                {cards.map((card, index) => (
                  <Fragment key={index}>{card.element}</Fragment>
                ))}
                {contents.length === 1 && contents[0].element}
                {contents.length > 1 && (
                  <Routes>
                    {contents.map(content => (
                      <Route
                        key={content.path}
                        path={
                          content.path === '/'
                            ? '/'
                            : `${content.path.replace(/^\//, '')}/*`
                        }
                        element={content.element}
                      />
                    ))}
                    <Route path="*" element={contents[0].element} />
                  </Routes>
                )}
              </EntityProvider>
            </MockEntityApiProvider>
          );
        },
      });
    },
  });
}

/**
 * A mock provider that injects a catalog API with the single entity of the test entity page.
 *
 * Users can still install their own catalog API implementations and they will take precedence over the mock.
 * @internal
 */
function MockEntityApiProvider({
  entity,
  children,
}: {
  entity: Entity;
  children: ReactNode;
}) {
  const parentHolder = useApiHolder();

  // If catalog API is already provided, don't override it
  if (parentHolder.get(catalogApiRef)) {
    return <>{children}</>;
  }

  // Provide a mock catalog API with the single entity
  const mockApi = catalogApiMock({ entities: [entity] });
  return (
    <TestApiProvider apis={[[catalogApiRef, mockApi]]}>
      {children}
    </TestApiProvider>
  );
}
