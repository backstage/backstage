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

import {
  createFrontendPlugin,
  createRouteRef,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const rootRouteRef = createRouteRef();

export const approvalDemoPlugin = createFrontendPlugin({
  pluginId: 'approval-demo',
  title: 'Approval demo',
  icon: <CheckCircleOutlineIcon />,
  routes: { root: rootRouteRef },
  extensions: [
    PageBlueprint.make({
      disabled: true,
      params: {
        path: '/approval-demo',
        routeRef: rootRouteRef,
        loader: () =>
          import('./ApprovalDemoPage').then(m => <m.ApprovalDemoPage />),
      },
    }),
  ],
});
