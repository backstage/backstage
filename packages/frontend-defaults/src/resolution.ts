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

import { Config } from '@backstage/config';
import { stringifyError } from '@backstage/errors';
import {
  FrontendFeature,
  FrontendFeatureLoader,
} from '@backstage/frontend-plugin-api';
import { CreateAppFeatureLoader } from './createApp';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { isInternalFrontendFeatureLoader } from '../../frontend-plugin-api/src/wiring/createFrontendFeatureLoader';
import { isBackstageFeatureLoader } from './discovery';

/** @public */
export async function resolveAsyncFeatures(options: {
  config: Config;
  features?: (
    | FrontendFeature
    | FrontendFeatureLoader
    | CreateAppFeatureLoader
  )[];
}): Promise<{ features: FrontendFeature[] }> {
  const featuresOrLoaders: (FrontendFeature | FrontendFeatureLoader)[] = [];

  // Separate deprecated CreateAppFeatureLoader elements from the frontend features,
  // and manage the deprecated elements first.
  for (const item of options?.features ?? []) {
    if ('load' in item) {
      try {
        const result = await item.load({ config: options.config });
        featuresOrLoaders.push(...result.features);
      } catch (e) {
        throw new Error(
          `Failed to read frontend features from loader '${item.getLoaderName()}', ${stringifyError(
            e,
          )}`,
        );
      }
    } else {
      featuresOrLoaders.push(item);
    }
  }

  const loadedFeatures: FrontendFeature[] = [];
  const alreadyMetFeatureLoaders: FrontendFeatureLoader[] = [];
  const maxRecursionDepth = 5;

  async function applyFeatureLoaders(
    toLoad: (FrontendFeature | FrontendFeatureLoader)[],
    recursionDepth: number,
  ) {
    if (featuresOrLoaders.length === 0) {
      return;
    }

    const featureLoaders: FrontendFeatureLoader[] = [];
    for (const item of toLoad) {
      if (isBackstageFeatureLoader(item)) {
        featureLoaders.push(item);
      } else {
        loadedFeatures.push(item);
      }
    }

    for (const featureLoader of featureLoaders) {
      if (alreadyMetFeatureLoaders.some(l => l === featureLoader)) {
        continue;
      }
      if (isInternalFrontendFeatureLoader(featureLoader)) {
        if (recursionDepth > maxRecursionDepth) {
          throw new Error(
            `Maximum feature loading recursion depth (${maxRecursionDepth}) reached for the feature loader ${featureLoader.description}`,
          );
        }
        alreadyMetFeatureLoaders.push(featureLoader);
        let result: (FrontendFeature | FrontendFeatureLoader)[];
        try {
          result = await featureLoader.loader({ config: options.config });
        } catch (e) {
          throw new Error(
            `Failed to read frontend features from loader ${
              featureLoader.description
            }: ${stringifyError(e)}`,
          );
        }
        await applyFeatureLoaders(result, recursionDepth + 1);
      }
    }
  }

  await applyFeatureLoaders(featuresOrLoaders, 1);

  return { features: loadedFeatures };
}
