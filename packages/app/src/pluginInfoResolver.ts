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

import { Entity } from '@backstage/catalog-model';
import { FrontendPluginInfoResolver } from '@backstage/frontend-app-api';

// This file shows an example of what it looks like to extend the plugin info
// resolution with custom logic and fields. In this case we're reading the
// `spec.type` field from the plugin manifest (catalog-info.yaml).
//
// Using module augmentation we extend the `FrontendPluginInfo` interface to
// include our custom fields. This makes these fields available throughout our project.

declare module '@backstage/frontend-plugin-api' {
  export interface FrontendPluginInfo {
    /**
     * **DO NOT USE**
     *
     * This field is added in the example app to showcase module augmentation
     * for extending the plugin info in internal apps. It only exists as an
     * example in this project.
     */
    exampleFieldDoNotUse?: string;
  }
}

export const pluginInfoResolver: FrontendPluginInfoResolver = async ctx => {
  const manifest = (await ctx.manifest?.()) as Entity | undefined;
  const { info: defaultInfo } = await ctx.defaultResolver({
    packageJson: await ctx.packageJson(),
    manifest: manifest,
  });
  return {
    info: {
      ...defaultInfo,
      exampleFieldDoNotUse: manifest?.spec?.type?.toString(),
    },
  };
};
