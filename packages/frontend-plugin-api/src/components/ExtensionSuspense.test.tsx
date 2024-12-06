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

import { lazy } from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import { ExtensionSuspense } from './ExtensionSuspense';

describe('ExtensionSuspense', () => {
  it('should render the app progress component as fallback', async () => {
    const LazyComponent = lazy(() => new Promise(() => {}));

    await renderWithEffects(
      wrapInTestApp(
        <ExtensionSuspense>
          <LazyComponent />
        </ExtensionSuspense>,
      ),
    );

    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('should render the lazy loaded children component', async () => {
    const LazyComponent = lazy(() =>
      Promise.resolve({ default: () => <div>Lazy Component</div> }),
    );

    await renderWithEffects(
      wrapInTestApp(
        <ExtensionSuspense>
          <LazyComponent />
        </ExtensionSuspense>,
      ),
    );

    await waitFor(() =>
      expect(screen.getByText('Lazy Component')).toBeInTheDocument(),
    );
  });
});
