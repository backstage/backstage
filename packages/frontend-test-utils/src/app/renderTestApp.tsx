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

import { createSpecializedApp } from '@backstage/frontend-app-api';
import {
  coreExtensionData,
  createFrontendPlugin,
  ExtensionDefinition,
  FrontendFeature,
} from '@backstage/frontend-plugin-api';
import { render } from '@testing-library/react';
import appPlugin from '@backstage/plugin-app';
import { JsonObject } from '@backstage/types';
import { ConfigReader } from '@backstage/config';

export type RenderTestAppOptions = {
  /**
   * Additional configuration passed to the app when rendering elements inside it.
   */
  config?: JsonObject;
  /**
   * Additional extensions to add to the test app.
   */
  extensions: ExtensionDefinition<any>[];

  /**
   * Additional features to add to the test app.
   */
  features?: FrontendFeature[];
};

const appPluginOverride = appPlugin.withOverrides({
  extensions: [
    appPlugin.getExtension('sign-in-page:app').override({
      disabled: true,
    }),
  ],
});

export function renderTestApp(options: RenderTestAppOptions) {
  const features: FrontendFeature[] = [
    createFrontendPlugin({
      pluginId: 'test',
      extensions: options.extensions,
    }),
    appPluginOverride,
  ];

  if (options.features) {
    features.push(...options.features);
  }

  const app = createSpecializedApp({
    features,
    config: options.config
      ? ConfigReader.fromConfigs([
          {
            context: 'render-config',
            data: options.config,
          },
        ])
      : undefined,
  });

  return render(
    app.tree.root.instance!.getData(coreExtensionData.reactElement),
  );
}
