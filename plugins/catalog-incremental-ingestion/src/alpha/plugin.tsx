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

import { Content } from '@backstage/core-components';
import {
  createFrontendPlugin,
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';
import AutorenewIcon from '@material-ui/icons/Autorenew';

/** @alpha */
export const incrementalIngestionDevToolsContent = SubPageBlueprint.make({
  attachTo: { id: 'page:devtools', input: 'pages' },
  params: {
    path: 'incremental-ingestion',
    title: 'Incremental Ingestion',
    loader: () =>
      import('../components/IncrementalIngestionDevtoolsContent').then(m => (
        <Content>
          <m.IncrementalIngestionDevtoolsContent />
        </Content>
      )),
  },
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'catalog-incremental-ingestion',
  title: 'Incremental Ingestion',
  icon: <AutorenewIcon fontSize="inherit" />,
  info: { packageJson: () => import('../../package.json') },
  extensions: [incrementalIngestionDevToolsContent],
});
