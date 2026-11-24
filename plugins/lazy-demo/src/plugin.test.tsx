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
import { screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import lazyDemoPlugin from './plugin';

describe('lazy-demo', () => {
  it('renders the details page with a link back to the root page', async () => {
    expect(lazyDemoPlugin.pluginId).toBe('lazy-demo');

    renderTestApp({
      features: [lazyDemoPlugin],
      initialRouteEntries: ['/lazy-demo/details'],
    });

    const link = await screen.findByRole('link', {
      name: 'Back to the lazy demo',
    });
    expect(link).toHaveAttribute('href', '/lazy-demo');
  });
});
