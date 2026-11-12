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

import { OpaqueType } from '@internal/opaque';
import { FrontendFeatureManifest } from './types';

/**
 * A plugin that a frontend feature loader provides without loading it, so
 * that the app can defer loading it until one of its pages or elements is
 * rendered. `createApp` takes these out of the loaded features and installs
 * a stand-in for each one, built from its manifest.
 */
export const OpaqueDeferredFrontendFeature = OpaqueType.create<{
  public: { readonly $$type: '@backstage/DeferredFrontendFeature' };
  versions: {
    readonly version: 'v1';
    /** The package name of the plugin. */
    readonly name: string;
    /** The build-time description of the plugin. */
    readonly manifest: FrontendFeatureManifest;
    /** Loads the plugin, which must be the default export. */
    readonly load: () => Promise<{ default: unknown }>;
  };
}>({
  type: '@backstage/DeferredFrontendFeature',
  versions: ['v1'],
});
