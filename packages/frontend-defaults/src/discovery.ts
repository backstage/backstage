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
import {
  FrontendFeature,
  FrontendFeatureLoader,
} from '@backstage/frontend-plugin-api';
import { isBackstageFeatureLoader } from './resolution';

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
 * @public
 */
export function discoverAvailableFeatures(config: Config): {
  features: (FrontendFeature | FrontendFeatureLoader)[];
} {
  const discovered = (
    window as { '__@backstage/discovered__'?: DiscoveryGlobal }
  )['__@backstage/discovered__'];

  const detection = readPackageDetectionConfig(config);
  if (!detection) {
    return { features: [] };
  }

  return {
    features:
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
        .filter(isFeatureOrLoader) ?? [],
  };
}

function isBackstageFeature(obj: unknown): obj is FrontendFeature {
  if (obj !== null && typeof obj === 'object' && '$$type' in obj) {
    return (
      obj.$$type === '@backstage/FrontendPlugin' ||
      obj.$$type === '@backstage/FrontendModule'
    );
  }
  return false;
}

function isFeatureOrLoader(
  obj: unknown,
): obj is FrontendFeature | FrontendFeatureLoader {
  return isBackstageFeature(obj) || isBackstageFeatureLoader(obj);
}
