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
  coreExtensionData,
  createExtension,
} from '@backstage/frontend-plugin-api';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';
import { compatWrapper } from './compatWrapper';
import { useApp } from '@backstage/core-plugin-api';

describe('BackwardsCompatProvider', () => {
  it('should convert the app context', () => {
    // TODO(Rugvip): Replace with the new renderInTestApp once it's available, and have some plugins
    createExtensionTester(
      createExtension({
        attachTo: { id: 'ignored', input: 'ignored' },
        output: {
          element: coreExtensionData.reactElement,
        },
        factory() {
          function Component() {
            const app = useApp();
            return (
              <div data-testid="ctx">
                plugins:
                {app
                  .getPlugins()
                  .map(p => p.getId())
                  .join(', ')}
                {'\n'}
                components: {Object.keys(app.getComponents()).join(', ')}
                {'\n'}
                icons: {Object.keys(app.getSystemIcons()).join(', ')}
              </div>
            );
          }

          return {
            element: compatWrapper(<Component />),
          };
        },
      }),
    ).render();

    expect(screen.getByTestId('ctx').textContent).toMatchInlineSnapshot(`
      "plugins:
      components: Progress, Router, NotFoundErrorPage, BootErrorPage, ErrorBoundaryFallback
      icons: brokenImage, catalog, scaffolder, techdocs, search, chat, dashboard, docs, email, github, group, help, kind:api, kind:component, kind:domain, kind:group, kind:location, kind:system, kind:user, kind:resource, kind:template, user, warning"
    `);
  });
});
