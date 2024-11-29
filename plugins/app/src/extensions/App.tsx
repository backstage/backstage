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
import {
  ExtensionBoundary,
  coreExtensionData,
  createExtension,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ApiProvider } from '../../../../packages/core-app-api/src';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppThemeProvider } from '../../../../packages/core-app-api/src/app/AppThemeProvider';

export const App = createExtension({
  attachTo: { id: 'root', input: 'app' },
  inputs: {
    root: createExtensionInput([coreExtensionData.reactElement], {
      singleton: true,
    }),
  },
  output: [coreExtensionData.reactElement],
  factory: ({ node, apis, inputs }) => {
    return [
      coreExtensionData.reactElement(
        <ApiProvider apis={apis}>
          <AppThemeProvider>
            <ExtensionBoundary node={node}>
              {inputs.root.get(coreExtensionData.reactElement)}
            </ExtensionBoundary>
          </AppThemeProvider>
        </ApiProvider>,
      ),
    ];
  },
});
