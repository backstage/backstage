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
 * invariant alongside the runtime behavioural tests below.
 */
const BlitzyProjectGraphEntityCard = catalogGraphPlugin.getExtension(
  'entity-card:catalog-graph/relations',
);

/**
 * Canonical entity fixture WITH a `github.com/project-slug` annotation.
 * Drives the two positive test paths that need
 * `BlitzyProjectGraphCard` to execute its proxy fetch code path.
 */
const slugEntity: ComponentEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'my-service',
    namespace: 'default',
    annotations: {
      'github.com/project-slug': 'octo-org/octo-repo',
    },
  },
  spec: {
    type: 'service',
    lifecycle: 'production',
    owner: 'team-a',
  },
};

/**
 * Canonical entity fixture WITHOUT a `github.com/project-slug` annotation.
 * Drives the Rule 9 (AAP §0.8.9) null-render test.
 */
const noSlugEntity: ComponentEntity = {
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

/**
 * Expected proxy URL computed by `BlitzyProjectGraphCard` when the
 * discovery API returns `http://example.com/api/proxy` for `'proxy'`.
 *
 * Derivation:
 *   - `mockApis.discovery({ baseUrl: 'http://example.com' })` resolves
 *     `getBaseUrl('proxy')` to `http://example.com/api/proxy`.
 *   - The component constructs
 *     `${proxyBase}/github-api/repos/${owner}/${repo}/pulls?state=all&per_page=100`
 *     (BlitzyProjectGraphCard.tsx L243-L244).
 */
const expectedProxyUrl =
  'http://example.com/api/proxy/github-api/repos/octo-org/octo-repo/pulls?state=all&per_page=100';

describe('catalog-graph alpha plugin', () => {
  describe('BlitzyProjectGraphEntityCard', () => {
    it("renders nothing when the entity has no 'github.com/project-slug' annotation (Rule 9)", async () => {
      // Track fetch invocations so we can prove no network traffic is
      // issued for an entity without the annotation (Rule 9 spirit).
      const fetchFn = jest.fn();

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: noSlugEntity }),
          BlitzyProjectGraphEntityCard,
        ],
        apis: [
          mockApis.discovery({ baseUrl: 'http://example.com' }),
          mockApis.fetch({ baseImplementation: fetchFn }),
        ],
      });

      // `ExtensionBoundary.lazy` wraps every entity card in its own
      // `<Suspense fallback={<Progress />}>` — the fallback exposes
      // `data-testid="core-progress"`. Once the dynamic `import()` of
      // `BlitzyProjectGraphCard` resolves, the fallback disappears and
      // the component mounts. Wait for the fallback to be fully gone so
      // the absence assertions below do not race the initial render.
      await waitFor(() => {
        expect(screen.queryByTestId('core-progress')).not.toBeInTheDocument();
      });

      // Rule 9 contract: with no slug, the component returns `null` —
      // no swimlane SVG, no loading spinner, no error message.
      expect(
        screen.queryByRole('img', { name: 'Pull requests swimlane' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('progressbar', { name: 'Loading pull requests' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Failed to load pull requests/),
      ).not.toBeInTheDocument();

      // The `useAsync` callback short-circuits with `undefined` before
      // touching the fetch or discovery APIs when the slug is absent
      // (BlitzyProjectGraphCard.tsx L240) — so the injected fetch mock
      // must not observe any invocations at all.
      expect(fetchFn).not.toHaveBeenCalled();
    });

    it('renders the swimlane SVG and fetches pull requests via the GitHub proxy when the slug annotation is present', async () => {
      // Mock the proxy fetch to return an empty PR list. The component
      // maps `GitHubPR[]` → `BlitzyProject[]` and renders an SVG trunk
      // even when the array is empty (see the `svgHeight` computation
      // at BlitzyProjectGraphCard.tsx L303, which stays `> 0` for zero
      // projects).
      const fetchFn = jest.fn().mockResolvedValue(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: slugEntity }),
          BlitzyProjectGraphEntityCard,
        ],
        apis: [
          mockApis.discovery({ baseUrl: 'http://example.com' }),
          mockApis.fetch({ baseImplementation: fetchFn }),
        ],
      });

      // The SVG canvas is the defining accessibility artifact of
      // `BlitzyProjectGraphCard` per its runtime contract
      // (BlitzyProjectGraphCard.tsx L311-L312).
      expect(
        await screen.findByRole('img', { name: 'Pull requests swimlane' }),
      ).toBeInTheDocument();

      // Verify the exact proxy URL — the Feature 1 AAP §0.1.1 contract
      // is `/api/proxy/github-api/repos/{owner}/{repo}/pulls?state=all&per_page=100`.
      // `MockFetchApi` is constructed with only a `baseImplementation`
      // (no middleware), so the component's single-argument
      // `fetchApi.fetch(url)` call flows straight through to the Jest
      // mock, preserving the URL for assertion.
      expect(fetchFn).toHaveBeenCalledWith(expectedProxyUrl);
    });

    it('renders the inline error message when the proxy fetch fails', async () => {
      // Mock the proxy fetch to return a 404 Response. The component's
      // `if (!res.ok) throw new Error(...)` branch at
      // BlitzyProjectGraphCard.tsx L246-L248 then causes `useAsync` to
      // surface an `error` with message `GitHub proxy returned 404`,
      // which `BlitzyProjectGraphCard.tsx` L292-L298 renders inline as
      // `Failed to load pull requests: GitHub proxy returned 404`.
      const fetchFn = jest.fn().mockResolvedValue(
        new Response('not found', {
          status: 404,
          statusText: 'Not Found',
        }),
      );

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: slugEntity }),
          BlitzyProjectGraphEntityCard,
        ],
        apis: [
          mockApis.discovery({ baseUrl: 'http://example.com' }),
          mockApis.fetch({ baseImplementation: fetchFn }),
        ],
      });

      expect(
        await screen.findByText(/Failed to load pull requests.*404/),
      ).toBeInTheDocument();
    });
  });
});
