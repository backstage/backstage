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

// This is only used to test manifest extraction and is resolved from the workspace
// eslint-disable-next-line @backstage/no-undeclared-imports
import {
  PageBlueprint,
  createFrontendPlugin,
} from '@backstage/frontend-plugin-api';

export default createFrontendPlugin({
  pluginId: 'fixture-pages',
  extensions: [
    PageBlueprint.make({
      params: { path: '/fixture', loader: async () => <div /> },
    }),
  ],
});
