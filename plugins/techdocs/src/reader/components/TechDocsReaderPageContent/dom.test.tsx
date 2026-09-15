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
import { act, screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';
import { Route, Routes } from 'react-router-dom';
import { useInitialRedirect } from './dom';

const TestComponent = ({ defaultPath }: { defaultPath?: string }) => {
  useInitialRedirect(defaultPath);
  return <div>Test</div>;
};

describe('useInitialRedirect', () => {
  it.each([
    [undefined, '', false],
    ['/overview', '', true],
    ['/overview', '/existing-path', false],
  ])(
    'handles default path %s at subpath %s',
    async (defaultPath, subpath, redirects) => {
      const initialPath = `/docs/default/Component/backstage-demo${subpath}`;
      const { appHistory } = renderInTestApp(
        <Routes>
          <Route
            path="*"
            element={<TestComponent defaultPath={defaultPath} />}
          />
        </Routes>,
        {
          router: ReactRouterV6PageRouter,
          mountPath: '/docs/:namespace/:kind/:name',
          initialRouteEntries: ['/start', initialPath],
        },
      );
      await screen.findByText('Test');
      expect(appHistory.location.pathname).toBe(
        redirects ? initialPath + defaultPath : initialPath,
      );
      // A default document replaces the initial URL instead of adding a history entry.
      act(() => appHistory.navigate(-1));
      expect(appHistory.location.pathname).toBe('/start');
    },
  );
});
