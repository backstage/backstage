/*
 * Copyright 2026 The Backstage Authors
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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { testPageRouter } from '../../../packages/frontend-test-utils/src/__testUtils__/testPageRouter';
import { useState } from 'react';
import '@testing-library/jest-dom';
import { Link, useParams, useSearch } from '@tanstack/react-router';
import { TanStackPageRouter } from './TanStackPageRouter';

/**
 * Page router adapter conformance.
 *
 * Exercises framework-selected subpages, navigation, and state preservation
 * with the TanStack adapter.
 */

/**
 * The page content, written with this adapter's routing library. Carries a
 * piece of in-page state that a remount would reset, what the library makes
 * of the current search params, a link scoped to the sub-page's own mount,
 * and content one level deeper than the sub-page itself (TanStack hands that
 * tail over as the `_splat` param rather than through a descendant route
 * tree).
 */
function SubPageProbe(props: { name: string }) {
  const [bumped, setBumped] = useState(0);
  const search = useSearch({ strict: false }) as { q?: string };
  const params = useParams({ strict: false }) as { _splat?: string };
  return (
    <div>
      <span data-testid="sub-page">{props.name}</span>
      <span data-testid="bumped">{bumped}</span>
      <span data-testid="lib-query">{search.q ?? ''}</span>
      <button type="button" onClick={() => setBumped(n => n + 1)}>
        Bump
      </button>
      <Link to={'/deep' as never}>Deep</Link>
      {params._splat === 'deep' && <span data-testid="deep">deep</span>}
    </div>
  );
}

testPageRouter({
  name: 'TanStack Router',
  PageRouter: TanStackPageRouter,
  SubPageProbe,
});
