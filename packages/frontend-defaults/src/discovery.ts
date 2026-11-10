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
  createFrontendFeatureLoader,
  FrontendFeature,
  FrontendFeatureLoader,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { DeferredFrontendFeature } from '../../frontend-app-api/src/wiring/deferredFeatures';
import type { FrontendFeatureManifest } from '@backstage/frontend-app-api/alpha';
import { isBackstageFeatureLoader } from './resolution';

type EagerDiscoveryEntry = { name: string; export?: string; default: unknown };

type LazyDiscoveryEntry = {
  name: string;
  export?: string;
  manifest: FrontendFeatureManifest;
  load: () => Promise<{ default: unknown }>;
};

interface DiscoveryGlobal {
  modules: Array<EagerDiscoveryEntry | LazyDiscoveryEntry>;
}

function readPackageDetectionConfig(config: Config) {
  const packages = config.getOptional('app.packages');
  if (packages === undefined || packages === null) {
    return undefined;
  }

  if (typeof packages === 'string') {
    if (packages !== 'all') {
      throw new Error(
        `Invalid app.packages mode, got '${packages}', expected 'all'`,
      );
    }
    return {};
  }

  if (typeof packages !== 'object' || Array.isArray(packages)) {
    throw new Error("Invalid config at 'app.packages', expected object");
  }
  const packagesConfig = new ConfigReader(packages, 'app.packages');

  return {
    include: packagesConfig.getOptionalStringArray('include'),
    exclude: packagesConfig.getOptionalStringArray('exclude'),
  };
}

function isLazyEntry(
  entry: EagerDiscoveryEntry | LazyDiscoveryEntry,
): entry is LazyDiscoveryEntry {
  return 'load' in entry && typeof entry.load === 'function';
}

function isDeferrable(entry: LazyDiscoveryEntry) {
  return entry.manifest?.type === 'plugin' && entry.manifest.deferrable;
}

// A lazy entry that can't be deferred is loaded before the app starts.
function createLoaderForLazyEntry(
  entry: LazyDiscoveryEntry,
): FrontendFeatureLoader {
  return createFrontendFeatureLoader({
    async loader() {
      const { default: feature } = await entry.load();
      if (!isFeatureOrLoader(feature)) {
        throw new Error(
          `The '${entry.name}' package didn't provide a frontend feature as its default export`,
        );
      }
      return [feature];
    },
  });
}

/**
 * Discovers the features and deferred plugins that were detected at build
 * time.
 *
 * @internal
 */
export function discoverAvailableAndDeferredFeatures(config: Config): {
  features: (FrontendFeature | FrontendFeatureLoader)[];
  deferred: DeferredFrontendFeature[];
} {
  const discovered = (
    window as { '__@backstage/discovered__'?: DiscoveryGlobal }
  )['__@backstage/discovered__'];

  const detection = readPackageDetectionConfig(config);
  if (!detection) {
    return { features: [], deferred: [] };
  }

  const entries =
    discovered?.modules.filter(({ name }) => {
      if (detection.exclude?.includes(name)) {
        return false;
      }
      if (detection.include && !detection.include.includes(name)) {
        return false;
      }
      return true;
    }) ?? [];

  const features = new Array<FrontendFeature | FrontendFeatureLoader>();
  const deferred = new Array<DeferredFrontendFeature>();
  for (const entry of entries) {
    if (!isLazyEntry(entry)) {
      if (isFeatureOrLoader(entry.default)) {
        features.push(entry.default);
      }
    } else if (isDeferrable(entry)) {
      deferred.push({
        name: entry.name,
        manifest: entry.manifest,
        load: entry.load,
      });
    } else {
      features.push(createLoaderForLazyEntry(entry));
    }
  }

  return { features, deferred };
}

/**
 * @public
 */
export function discoverAvailableFeatures(config: Config): {
  features: (FrontendFeature | FrontendFeatureLoader)[];
} {
  const { features, deferred } = discoverAvailableAndDeferredFeatures(config);

  // Without the app setup of createApp the deferred plugins can't be loaded
  // on demand, so they are loaded before the app starts instead.
  return {
    features: [
      ...features,
      ...deferred.map(entry => createLoaderForLazyEntry(entry)),
    ],
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
