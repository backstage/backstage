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
  NotFoundErrorPage as AdaptableNotFoundErrorPage,
  Progress as AdaptableProgress,
  ErrorBoundary as AdaptableErrorBoundary,
  AdaptableComponentBlueprint,
} from '@backstage/frontend-plugin-api';

import { Progress as ProgressComponent } from '@backstage/core-components';

export const Progress = AdaptableComponentBlueprint.make({
  name: 'core.components.progress',
  params: define =>
    define({
      component: AdaptableProgress,
      loader: () => ProgressComponent,
    }),
});

export const NotFoundErrorPage = AdaptableComponentBlueprint.make({
  name: 'core.components.notFoundErrorPage',
  params: define =>
    define({
      component: AdaptableNotFoundErrorPage,
      loader: () => NotFoundErrorPageComponent,
    }),
});

export const ErrorBoundary = AdaptableComponentBlueprint.make({
  name: 'core.components.errorBoundary',
  params: define =>
    define({
      component: AdaptableErrorBoundary,
      loader: () => ErrorBoundaryComponent,
    }),
});
