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
} from '@backstage/frontend-plugin-api';

const IndexPage = createPageExtension({
  id: 'index',
  defaultPath: '/',
  component: async () => {
    const Component = () => {
      // const page1 = useRouteRef();
      return (
        <div>
          op
          <div>
            <Link to="/page1">Page 1</Link>
          </div>
          <div>
            <Link to="/graphiql">GraphiQL</Link>
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
  component: async () => {
    const Component = () => (
      <div>
        <h1>This is page 1</h1>
      </div>
    );
    return <Component />;
  },
});

export const pagesPlugin = createPlugin({
  id: 'pages',
  extensions: [IndexPage, Page1],
});
