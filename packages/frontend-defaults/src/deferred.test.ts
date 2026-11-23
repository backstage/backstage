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
  createFrontendFeatureLoader,
  createFrontendModule,
  createFrontendPlugin,
  FrontendFeature,
} from '@backstage/frontend-plugin-api';
import { OpaqueDeferredFrontendFeature } from '@internal/frontend';
import { applyExplicitFeatures } from './deferred';

describe('applyExplicitFeatures', () => {
  const createDeferred = (pluginId: string, loaded?: unknown) => {
    const load = jest.fn(async () => ({
      default: loaded ?? createFrontendPlugin({ pluginId }),
    }));
    const feature = OpaqueDeferredFrontendFeature.createInstance('v1', {
      name: `${pluginId}-pkg`,
      manifest: {
        manifestVersion: 1,
        type: 'plugin',
        pluginId,
        deferrable: true,
        routes: [],
        externalRoutes: [],
        extensions: [],
      },
      load,
    }) as unknown as FrontendFeature;
    return { feature, load };
  };

  it('should let explicit features win over deferred plugins', async () => {
    const replaced = createDeferred('replaced');
    const modifiedPlugin = createFrontendPlugin({ pluginId: 'modified' });
    const modified = createDeferred('modified', modifiedPlugin);
    const untouched = createDeferred('untouched');
    const eagerPlugin = createFrontendPlugin({ pluginId: 'eager' });

    const result = await applyExplicitFeatures(
      [eagerPlugin, replaced.feature, modified.feature, untouched.feature],
      [
        createFrontendPlugin({ pluginId: 'replaced' }),
        createFrontendModule({ pluginId: 'modified', extensions: [] }),
        createFrontendFeatureLoader({ loader: () => [] }),
      ],
    );

    // The explicit plugin replaces the deferred one, and the plugin that a
    // module applies to is loaded before the app starts
    expect(result).toEqual([eagerPlugin, modifiedPlugin, untouched.feature]);
    expect(replaced.load).not.toHaveBeenCalled();
    expect(modified.load).toHaveBeenCalledTimes(1);
    expect(untouched.load).not.toHaveBeenCalled();

    // A deferred package that doesn't provide a plugin fails clearly
    const broken = createDeferred('broken', { not: 'a plugin' });
    await expect(
      applyExplicitFeatures(
        [broken.feature],
        [createFrontendModule({ pluginId: 'broken', extensions: [] })],
      ),
    ).rejects.toThrow(
      "The 'broken-pkg' package didn't provide a frontend plugin as its default export",
    );
  });
});
