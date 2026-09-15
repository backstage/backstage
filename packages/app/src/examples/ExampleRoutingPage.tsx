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

import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';
import { Link } from '@backstage/core-components';
import { useRouteRef, BreadcrumbEntry } from '@backstage/frontend-plugin-api';
import { Route, Routes } from 'react-router-dom';
import { indexRouteRef, externalPageXRouteRef } from './pagesRoutes';

export function ExampleRoutingPage() {
  const indexLink = useRouteRef(indexRouteRef);
  const xLink = useRouteRef(externalPageXRouteRef);

  return (
    <ReactRouterV6PageRouter>
      <div>
        <h1>This is page 1</h1>
        {indexLink && <Link to={indexLink()}>Go back</Link>}
        <Link to="./page2">Page 2</Link>
        {xLink && <Link to={xLink()}>Page X</Link>}

        <div>
          Sub-page content:
          <div>
            <Routes>
              <Route
                path="/"
                element={
                  <BreadcrumbEntry entry={{ label: 'Page 1', href: '/' }}>
                    <h2>This is also page 1</h2>
                  </BreadcrumbEntry>
                }
              />

              <Route
                path="/page2"
                element={
                  <BreadcrumbEntry entry={{ label: 'Page 2', href: '/page2' }}>
                    <h2>This is page 2</h2>
                  </BreadcrumbEntry>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </ReactRouterV6PageRouter>
  );
}
