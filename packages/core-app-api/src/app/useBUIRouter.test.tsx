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

import { fireEvent, render, screen } from '@testing-library/react';
import {
  Link,
  MemoryRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { useBUIRouter } from './useBUIRouter';

function Probe() {
  const router = useBUIRouter();
  return (
    <>
      {['..', '../sibling?view=docs#intro', '?view=docs', '#intro', '/'].map(
        href => (
          <div key={href}>
            <Link to={href}>React Router {href}</Link>
            <a href={router.resolveHref(href)}>BUI {href}</a>
          </div>
        ),
      )}
      <span>{router.pathname}</span>
      <button
        onClick={() =>
          router.navigate('../sibling?view=docs#intro', {
            replace: true,
            state: { source: 'bui' },
          })
        }
      >
        Navigate
      </button>
    </>
  );
}

function Location() {
  const location = useLocation();
  const action = useNavigationType();
  return (
    <output>
      {location.pathname}
      {location.search}
      {location.hash}:{action}:{location.state?.source}
    </output>
  );
}

describe('legacy BUI router integration', () => {
  it.each([false, true])(
    'resolves like React Router and navigates from the same nested scope (relative splat: %s)',
    relativeSplat => {
      render(
        <MemoryRouter
          basename="/app"
          initialEntries={['/app/catalog/group/entity/docs/child']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: relativeSplat,
          }}
        >
          <Location />
          <Routes>
            <Route path="catalog" element={<Outlet />}>
              <Route element={<Outlet />}>
                <Route path="group/entity" element={<Outlet />}>
                  <Route path="docs/*" element={<Probe />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={null} />
          </Routes>
        </MemoryRouter>,
      );
      for (const href of [
        '..',
        '../sibling?view=docs#intro',
        '?view=docs',
        '#intro',
        '/',
      ]) {
        expect(
          screen.getByRole('link', { name: `BUI ${href}` }),
        ).toHaveAttribute(
          'href',
          screen
            .getByRole('link', { name: `React Router ${href}` })
            .getAttribute('href'),
        );
      }
      expect(
        screen.getByText('/app/catalog/group/entity/docs/child'),
      ).toBeInTheDocument();
      const target = screen
        .getByRole('link', { name: 'BUI ../sibling?view=docs#intro' })
        .getAttribute('href')!;
      fireEvent.click(screen.getByRole('button', { name: 'Navigate' }));
      expect(screen.getByRole('status')).toHaveTextContent(
        `${target.slice('/app'.length)}:REPLACE:bui`,
      );
    },
  );
});
