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
import {
  createFrontendPlugin,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';
import { rootRouteRef } from './routes';

export const AuthPage = PageBlueprint.make({
  params: {
    path: '/oauth2',
    routeRef: rootRouteRef,
    // The page's own content is a React Router v6 `<Routes>` tree, and the
    // consent page reads its params with React Router's `useParams`, so the
    // page declares the routing library it uses.
    loader: () =>
      import('./components/Router').then(m => (
        <ReactRouterV6PageRouter>
          <m.Router />
        </ReactRouterV6PageRouter>
      )),
  },
});

export default createFrontendPlugin({
  pluginId: 'auth',
  extensions: [AuthPage],
  routes: {
    root: rootRouteRef,
  },
});
