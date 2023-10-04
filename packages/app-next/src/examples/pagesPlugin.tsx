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

import React from 'react';
import { Link } from '@backstage/core-components';
import {
  createPageExtension,
  createPlugin,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import { createRouteRef } from '@backstage/core-plugin-api';
import { Route, Routes } from 'react-router-dom';

const indexRouteRef = createRouteRef({ id: 'index' });
const page1RouteRef = createRouteRef({ id: 'page1' });
// const page2RouteRef = createSubRouteRef({
//   id: 'page2',
//   parent: page1RouteRef,
//   path: '/page2',
// });

const IndexPage = createPageExtension({
  id: 'index',
  defaultPath: '/',
  routeRef: indexRouteRef,
  loader: async () => {
    const Component = () => {
      const page1Link = useRouteRef(page1RouteRef);
      return (
        <div>
          op
          <div>
            <Link to={page1Link()}>Page 1</Link>
          </div>
          <div>
            <Link to="/graphiql">GraphiQL</Link>
          </div>
          <div>
            <Link to="/search">Search</Link>
          </div>
        </div>
      );
    };
    return <Component />;
  },
});

const Page1 = createPageExtension({
  id: 'page1',
  defaultPath: '/page1',
  routeRef: page1RouteRef,
  loader: async () => {
    const Component = () => {
      const indexLink = useRouteRef(indexRouteRef);
      // const page2Link = useRouteRef(page2RouteRef);

      return (
        <div>
          <h1>This is page 1</h1>
          <Link to={indexLink()}>Go back</Link>
          <Link to="./page2">Page 2</Link>
          {/* <Link to={page2Link()}>Page 2</Link> */}

          <div>
            Sub-page content:
            <div>
              <Routes>
                <Route path="/" element={<h2>This is also page 1</h2>} />
                <Route path="/page2" element={<h2>This is page 2</h2>} />
              </Routes>
            </div>
          </div>
        </div>
      );
    };
    return <Component />;
  },
});

export const pagesPlugin = createPlugin({
  id: 'pages',
  // routes: {
  //   index: indexRouteRef,
  //   // reference in config:
  //   //   'plugin.pages.routes.index'
  //   //     OR
  //   //   'page1'
  // },
  extensions: [IndexPage, Page1],
});
