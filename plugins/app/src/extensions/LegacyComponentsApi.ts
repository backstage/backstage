/*
 * Copyright 2024 The Backstage Authors
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
  ApiBlueprint,
  createApiRef,
  ErrorDisplay,
  NotFoundErrorPage,
  Progress,
} from '@backstage/frontend-plugin-api';
import { ComponentType } from 'react';

/**
 * This is the old component API that has been replaced by the new SwappableComponentsApi.
 *
 * This backwards compatibility implementation exists to avoid breaking older plugins.
 *
 * This was added for the 1.42 release, and can be removed in the future.
 *
 * @internal
 */
export const LegacyComponentsApi = ApiBlueprint.make({
  name: 'components',
  params: defineParams =>
    defineParams({
      api: createApiRef<{
        getComponent(ref: { id: string }): ComponentType<any>;
      }>({ id: 'core.components' }),
      deps: {},
      factory: () => ({
        getComponent(ref) {
          if (ref.id === 'core.components.progress') {
            return Progress;
          }
          if (ref.id === 'core.components.notFoundErrorPage') {
            return NotFoundErrorPage;
          }
          if (ref.id === 'core.components.errorBoundaryFallback') {
            return ErrorDisplay;
          }
          throw new Error(`No implementation found for component ref ${ref}`);
        },
      }),
    }),
});
