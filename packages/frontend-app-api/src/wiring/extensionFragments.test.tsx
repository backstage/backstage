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
  createFrontendModule,
  createFrontendPlugin,
  FragmentBlueprint,
} from '@backstage/frontend-plugin-api';
import appPlugin from '@backstage/plugin-app';
import { prepareSpecializedApp } from './prepareSpecializedApp';

it.each([undefined, false, true])(
  'defers the fragment registry until finalization (flag active: %s)',
  flagActive => {
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
        appPlugin.withOverrides({
          extensions: [
            appPlugin
              .getExtension('sign-in-page:app')
              .override({ disabled: true }),
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
    expect(bootstrap.apis.get(coreApis.extensionFragments)).toBeUndefined();
    expect(factory).not.toHaveBeenCalled();
    expect(loader).not.toHaveBeenCalled();

    const finalized = prepared.finalize();
    const registry = finalized.apis.get(coreApis.extensionFragments)!;
    expect(registry).toBeDefined();
    expect(registry.getFragment('fragment:deployments') !== undefined).toBe(
      flagActive !== false,
    );
    expect(registry.getFragment('fragment:missing')).toBeUndefined();
    // API factories are collected in an isolated tree before the live tree is instantiated.
    expect(factory).toHaveBeenCalledTimes(flagActive === false ? 0 : 2);
    expect(loader).not.toHaveBeenCalled();
    expect(finalized.errors).toBeUndefined();
  },
);
