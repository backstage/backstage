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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppComponents } from '../../../core-app-api/src/app/types';
import { coreExtensionData, createExtension } from '../wiring';

/** @public */
export function createBootErrorPageExtension(options: {
  component: AppComponents['BootErrorPage'];
}) {
  return createExtension({
    id: `core.components.bootErrorPage`,
    attachTo: { id: 'core.components', input: 'bootErrorPage' },
    inputs: {},
    output: {
      component: coreExtensionData.components.bootErrorPage,
    },
    factory({ bind }) {
      bind({
        component: options.component,
      });
    },
  });
}

/** @public */
export function createNotFoundErrorPageExtension(options: {
  component: AppComponents['NotFoundErrorPage'];
}) {
  return createExtension({
    id: `core.components.notFoundErrorPage`,
    attachTo: { id: 'core.components', input: 'notFoundErrorPage' },
    inputs: {},
    output: {
      component: coreExtensionData.components.notFoundErrorPage,
    },
    factory({ bind }) {
      bind({
        component: options.component,
      });
    },
  });
}

/** @public */
export function createErrorBoundaryFallbackExtension(options: {
  component: AppComponents['ErrorBoundaryFallback'];
}) {
  return createExtension({
    id: `core.components.errorBoundaryFallback`,
    attachTo: { id: 'core.components', input: 'errorBoundaryFallback' },
    inputs: {},
    output: {
      component: coreExtensionData.components.errorBoundaryFallback,
    },
    factory({ bind }) {
      bind({
        component: options.component,
      });
    },
  });
}

/** @public */
export function createProgressExtension(options: {
  component: AppComponents['Progress'];
}) {
  return createExtension({
    id: `core.components.progress`,
    attachTo: { id: 'core.components', input: 'progress' },
    inputs: {},
    output: {
      component: coreExtensionData.components.progress,
    },
    factory({ bind }) {
      bind({
        component: options.component,
      });
    },
  });
}
