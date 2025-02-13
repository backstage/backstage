/*
 * Copyright 2023 The Backstage Authors
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

import { Config, ConfigReader } from '@backstage/config';
import { FrontendFeature } from '@backstage/frontend-app-api';
import appPlugin from '@backstage/plugin-app';
import { CreateAppFeatureLoader } from './createApp';
import { stringifyError } from '@backstage/errors';

interface DiscoveryGlobal {
  modules: Array<{ name: string; export?: string; default: unknown }>;
}

function readPackageDetectionConfig(config: Config) {
  const packages = config.getOptional('app.experimental.packages');
  if (packages === undefined || packages === null) {
    return undefined;
  }

  if (typeof packages === 'string') {
    if (packages !== 'all') {
      throw new Error(
        `Invalid app.experimental.packages mode, got '${packages}', expected 'all'`,
      );
    }
    return {};
  }

  if (typeof packages !== 'object' || Array.isArray(packages)) {
    throw new Error(
      "Invalid config at 'app.experimental.packages', expected object",
    );
  }
  const packagesConfig = new ConfigReader(
    packages,
    'app.experimental.packages',
  );

  return {
    include: packagesConfig.getOptionalStringArray('include'),
    exclude: packagesConfig.getOptionalStringArray('exclude'),
  };
}

/**
 * @internal
 */
export function getAvailableFeatures(config: Config): FrontendFeature[] {
  const discovered = (
    window as { '__@backstage/discovered__'?: DiscoveryGlobal }
  )['__@backstage/discovered__'];

  const detection = readPackageDetectionConfig(config);
  if (!detection) {
    return [];
  }

  return (
    discovered?.modules
      .filter(({ name }) => {
        if (detection.exclude?.includes(name)) {
          return false;
        }
        if (detection.include && !detection.include.includes(name)) {
          return false;
        }
        return true;
      })
      .map(m => m.default)
      .filter(isBackstageFeature) ?? []
  );
}

function isBackstageFeature(obj: unknown): obj is FrontendFeature {
  if (obj !== null && typeof obj === 'object' && '$$type' in obj) {
    return (
      obj.$$type === '@backstage/FrontendPlugin' ||
      obj.$$type === '@backstage/FrontendModule' ||
      // TODO: Remove this once the old plugin type and extension overrides
      // are no longer supported
      obj.$$type === '@backstage/BackstagePlugin' ||
      obj.$$type === '@backstage/ExtensionOverrides'
    );
  }
  return false;
}

/**
 * @public
 */
export async function resolveFeatures(
  config: Config,
  providedFeatures: (FrontendFeature | CreateAppFeatureLoader)[] | undefined,
) {
  const discoveredFeatures = getAvailableFeatures(config);
  const features: FrontendFeature[] = [appPlugin, ...discoveredFeatures];

  for (const entry of providedFeatures ?? []) {
    if ('load' in entry) {
      try {
        const result = await entry.load({ config });
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
