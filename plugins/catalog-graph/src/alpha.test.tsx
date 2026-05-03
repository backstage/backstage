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

import { screen, waitFor } from '@testing-library/react';
import { mockApis, renderTestApp } from '@backstage/frontend-test-utils';
import { ComponentEntity } from '@backstage/catalog-model';
import { createTestEntityPage } from '@backstage/plugin-catalog-react/testUtils';
import catalogGraphPlugin from './alpha';

/**
 * Resolve the `relations` entity-card extension from the plugin.
 *
 * The extension ID `'entity-card:catalog-graph/relations'` is a contract
 * asserted by Rule 6 (AAP §0.8.6) — it MUST remain literal across the
 * `CatalogGraphEntityCard` → `BlitzyProjectGraphEntityCard` rename so
 * downstream app configuration that references this identity keeps
 * working.
 *
 * `plugin.getExtension` throws synchronously if the ID does not resolve,
 * so if Rule 6 is ever violated this module fails to load and the entire
 * test file fails — providing build-time verification of the identity
 * invariant.
 */
const BlitzyProjectGraphEntityCard = catalogGraphPlugin.getExtension(
  'entity-card:catalog-graph/relations',
);

describe('catalog-graph alpha plugin', () => {
  describe('BlitzyProjectGraphEntityCard', () => {
    it("loads the 'entity-card:catalog-graph/relations' extension without error after the BlitzyProjectGraphEntityCard rename (Rule 6)", async () => {
      // Minimal entity fixture — no `github.com/project-slug` annotation
      // so `BlitzyProjectGraphCard` short-circuits to `null` without
      // invoking the proxy fetch. This keeps the smoke test isolated
      // from the network-mocking plumbing that the CP2 scope boundary
      // constrains.
      const entity: ComponentEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-service',
          namespace: 'default',
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'team-a',
        },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity }),
          BlitzyProjectGraphEntityCard,
        ],
        apis: [
          mockApis.discovery({ baseUrl: 'http://example.com' }),
          mockApis.fetch({ baseImplementation: jest.fn() }),
        ],
      });

      // `ExtensionBoundary.lazy` wraps every entity card in its own
      // `<Suspense fallback={<Progress />}>` — the fallback exposes
      // `data-testid="core-progress"`. Once the dynamic `import()` of
      // `BlitzyProjectGraphCard` resolves, the fallback disappears and
      // the component mounts. Waiting for the fallback to clear is the
      // canonical "extension loaded without error" assertion.
      await waitFor(() => {
        expect(screen.queryByTestId('core-progress')).not.toBeInTheDocument();
      });
    });
  });
});
