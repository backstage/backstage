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

import { createContext, useContext } from 'react';
import { screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  createFrontendPlugin,
  PageBlueprint,
  useAppNode,
} from '@backstage/frontend-plugin-api';
import {
  ExtensionFragment,
  FragmentBlueprint,
} from '@backstage/frontend-plugin-api/alpha';

it('collects fragments across plugins and renders them in the host page', async () => {
  const HostContext = createContext('default');
  function Summary() {
    return (
      <div>
        {useContext(HostContext)}: {useAppNode()?.spec.id}
      </div>
    );
  }
  const unusedLoader = jest.fn(async () => <div>Unused fragment</div>);
  const disabledLoader = jest.fn(async () => <div>Disabled fragment</div>);
  renderTestApp({
    features: [
      createFrontendPlugin({
        pluginId: 'deployments',
        extensions: [
          FragmentBlueprint.make({
            name: 'summary',
            params: { loader: async () => <Summary /> },
          }),
          FragmentBlueprint.make({ params: { loader: unusedLoader } }),
          FragmentBlueprint.make({
            name: 'disabled',
            disabled: true,
            params: { loader: disabledLoader },
          }),
        ],
      }),
      createFrontendPlugin({
        pluginId: 'consumer',
        extensions: [
          PageBlueprint.make({
            params: {
              path: '/',
              loader: async () => (
                <HostContext.Provider value="host">
                  <ExtensionFragment fragmentId="deployments/summary" />
                  <ExtensionFragment
                    fragmentId="deployments/disabled"
                    fallback={<div>Disabled fallback</div>}
                  />
                  <ExtensionFragment
                    fragmentId="missing"
                    fallback={<div>Missing fallback</div>}
                  />
                </HostContext.Provider>
              ),
            },
          }),
        ],
      }),
    ],
  });
  expect(
    await screen.findByText('host: fragment:deployments/summary'),
  ).toBeVisible();
  expect(screen.getByText('Disabled fallback')).toBeVisible();
  expect(screen.getByText('Missing fallback')).toBeVisible();
  expect(unusedLoader).not.toHaveBeenCalled();
  expect(disabledLoader).not.toHaveBeenCalled();
});
