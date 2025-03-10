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
import { FrontendFeature } from '@backstage/frontend-app-api';
import { CreateAppFeatureLoader } from './createApp';

/** @public */
export async function resolveFeatures(options: {
  config: Config;
  features?: (FrontendFeature | CreateAppFeatureLoader)[];
}): Promise<FrontendFeature[]> {
  const features = [];
  for (const entry of options.features ?? []) {
    if ('load' in entry) {
      try {
        const result = await entry.load({ config: options.config });
        features.push(...result.features);
      } catch (e) {
        throw new Error(
          `Failed to read frontend features from loader '${entry.getLoaderName()}', ${stringifyError(
            e,
          )}`,
        );
      }
    } else {
      features.push(entry);
    }
  }
  return features;
}
