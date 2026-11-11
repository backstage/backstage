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
  PageBlueprint,
} from '@backstage/frontend-plugin-api';

const lazyPackageDemoPage = PageBlueprint.make({
  params: {
    path: '/lazy-package-demo',
    loader: () =>
      import('./components/PackageDemoPage').then(m => <m.PackageDemoPage />),
  },
});

/**
 * A demo plugin that the app discovers through `app.packages` and defers
 * with `app.experimental.deferredPackages`.
 *
 * @public
 */
export default createFrontendPlugin({
  pluginId: 'lazy-package-demo',
  title: 'Lazy Package Demo',
  extensions: [lazyPackageDemoPage],
});
