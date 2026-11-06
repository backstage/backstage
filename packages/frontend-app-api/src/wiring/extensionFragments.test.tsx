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
  ApiBlueprint,
  coreApis,
  coreExtensionData,
  createFrontendModule,
  createFrontendPlugin,
} from '@backstage/frontend-plugin-api';
import {
  ExtensionFragment,
  FragmentBlueprint,
  extensionFragmentsApiRef,
} from '@backstage/frontend-plugin-api/next';
import { appModuleExtensionFragments } from '@backstage/plugin-app/next';
import appPlugin from '@backstage/plugin-app';
import { render, screen } from '@testing-library/react';
import { prepareSpecializedApp } from './prepareSpecializedApp';

it.each([undefined, false, true])(
  'loads fragments only when rendered, respecting predicates (flag active: %s)',
  async flagActive => {
    const factory = jest.fn();
    const loader = jest.fn(async () => <div>Summary</div>);
    const fragment = FragmentBlueprint.make({
      params: { loader },
    }).override({
      ...(flagActive !== undefined
        ? { if: { featureFlags: { $contains: 'summary' } } }
        : {}),
      factory(originalFactory) {
        factory();
        return originalFactory();
      },
    });
    const prepared = prepareSpecializedApp({
      features: [
        appModuleExtensionFragments,
        appPlugin.withOverrides({
          extensions: [
            appPlugin
              .getExtension('sign-in-page:app')
              .override({ disabled: true }),
            appPlugin.getExtension('app/layout').override({
              factory: () => [
                coreExtensionData.reactElement(
                  <ExtensionFragment
                    fragmentId="deployments"
                    fallback={<div>No summary</div>}
                  />,
                ),
              ],
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'deployments',
          featureFlags: [{ name: 'summary' }],
          extensions: [fragment],
        }),
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: coreApis.featureFlags,
                  deps: {},
                  factory: () => ({
                    isActive: () => flagActive === true,
                    registerFlag: () => {},
                    getRegisteredFlags: () => [],
                    save: () => {},
                  }),
                }),
            }),
          ],
        }),
      ],
    });
    const bootstrap = prepared.getBootstrapApp();
    const bootstrapRegistry = bootstrap.apis.get(extensionFragmentsApiRef);
    expect(bootstrapRegistry !== undefined).toBe(flagActive === undefined);
    expect(
      bootstrapRegistry?.getFragment('fragment:deployments') !== undefined,
    ).toBe(flagActive === undefined);
    expect(bootstrapRegistry?.getFragment('fragment:missing')).toBeUndefined();
    expect(factory.mock.calls.length > 0).toBe(flagActive === undefined);
    expect(loader).not.toHaveBeenCalled();

    const finalized = prepared.finalize();
    const registry = finalized.apis.get(extensionFragmentsApiRef)!;
    expect(registry).toBeDefined();
    expect(registry.getFragment('fragment:deployments') !== undefined).toBe(
      flagActive !== false,
    );
    expect(registry.getFragment('fragment:missing')).toBeUndefined();
    expect(loader).not.toHaveBeenCalled();
    expect(finalized.errors).toBeUndefined();

    render(finalized.element);
    const expectedContent = flagActive === false ? 'No summary' : 'Summary';
    expect(await screen.findByText(expectedContent)).toBeVisible();
    expect(factory.mock.calls.length > 0).toBe(flagActive !== false);
    expect(loader).toHaveBeenCalledTimes(flagActive === false ? 0 : 1);
  },
);
