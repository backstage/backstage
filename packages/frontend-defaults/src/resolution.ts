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

/** @public */
export async function resolveAsyncFeatures(options: {
  config: Config;
  features?: (
    | FrontendFeature
    | FrontendFeatureLoader
    | CreateAppFeatureLoader
  )[];
}): Promise<{ features: FrontendFeature[] }> {
  const features: (FrontendFeature | FrontendFeatureLoader)[] = [];

  // Separate deprecated CreateAppFeatureLoader elements from the frontend features,
  // and manage the deprecated elements first.
  for (const item of options?.features ?? []) {
    if ('load' in item) {
      try {
        const result = await item.load({ config: options.config });
        features.push(...result.features);
      } catch (e) {
        throw new Error(
          `Failed to read frontend features from loader '${item.getLoaderName()}', ${stringifyError(
            e,
          )}`,
        );
      }
    } else {
      features.push(item);
    }
  }

  const loadedFeatures: FrontendFeature[] = [];
  const alreadyMetFeatureLoaders: FrontendFeatureLoader[] = [];
  const maxRecursionDepth = 5;

  async function applyFeatureLoaders(
    featuresOrLoaders: (FrontendFeature | FrontendFeatureLoader)[],
    recursionDepth: number,
  ) {
    if (featuresOrLoaders.length === 0) {
      return;
    }

    for (const featureOrLoader of featuresOrLoaders) {
      if (isBackstageFeatureLoader(featureOrLoader)) {
        if (alreadyMetFeatureLoaders.some(l => l === featureOrLoader)) {
          continue;
        }
        if (isInternalFrontendFeatureLoader(featureOrLoader)) {
          if (recursionDepth > maxRecursionDepth) {
            throw new Error(
              `Maximum feature loading recursion depth (${maxRecursionDepth}) reached for the feature loader ${featureOrLoader.description}`,
            );
          }
          alreadyMetFeatureLoaders.push(featureOrLoader);
          let result: (FrontendFeature | FrontendFeatureLoader)[];
          try {
            result = await featureOrLoader.loader({ config: options.config });
          } catch (e) {
            throw new Error(
              `Failed to read frontend features from loader ${
                featureOrLoader.description
              }: ${stringifyError(e)}`,
            );
          }
          await applyFeatureLoaders(result, recursionDepth + 1);
        }
      } else {
        loadedFeatures.push(featureOrLoader);
      }
    }
  }

  await applyFeatureLoaders(features, 1);

  return { features: loadedFeatures };
}

export function isBackstageFeatureLoader(
  obj: unknown,
): obj is FrontendFeatureLoader {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    '$$type' in obj &&
    obj.$$type === '@backstage/FrontendFeatureLoader'
  );
}
