/*
 * Copyright 2024 The Backstage Authors
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
  Configuration,
  Descriptor,
  httpUtils,
  structUtils,
} from '@yarnpkg/core';
import { getManifestByVersion } from '@backstage/release-manifests';

import { PROTOCOL } from '../constants';
import { getCurrentBackstageVersion } from './getCurrentBackstageVersion';

export const getPackageVersion = async (
  descriptor: Descriptor,
  configuration: Configuration,
) => {
  const ident = structUtils.stringifyIdent(descriptor);
  const range = structUtils.parseRange(descriptor.range);

  if (range.protocol !== PROTOCOL) {
    throw new Error(
      `Unsupported version protocol in version range "${descriptor.range}" for package ${ident}`,
    );
  }

  if (range.selector !== '^') {
    throw new Error(
      `Unexpected version selector "${range.selector}" for package ${ident}`,
    );
  }

  const backstageVersion = getCurrentBackstageVersion();

  const manifest = await getManifestByVersion({
    version: backstageVersion,
    // We override the fetch function used inside getManifestByVersion with a
    // custom implementation that calls yarn's built-in `httpUtils` method
    // instead. This has a couple of benefits:
    //
    // 1. This means that the fetch should leverage yarn's built-in cache, so we
    //    don't need to explicitly memoize the fetch.
    // 2. The request should automatically take account of any proxy settings
    //    configured in yarn.
    fetch: async (url: string) => {
      const response = await httpUtils.get(url, {
        configuration,
        jsonResponse: true,
      });

      // The release-manifests package expects fetchFn to resolve with a subset
      // of the native HTTP Response object, but yarn's httpUtils implementation
      // keeps most of the details hidden. This means we need to construct an
      // object which quacks like a Response in the appropriate ways.
      return {
        // The function has some custom handling for non-200 errors. Yarn
        // doesn't provide the status code, but if we've got to this point
        // without throwing, we can assume the request has been successful.
        status: 200,
        // The requested URL, used to correctly report errors
        url,
        // Yarn automatically parses the response as JSON, so our implementation
        // can simply return it.
        json: () => response,
      };
    },
  });

  const manifestEntry = manifest.packages.find(
    candidate => candidate.name === ident,
  );

  if (!manifestEntry) {
    throw new Error(
      `Package ${ident} not found in manifest for Backstage v${backstageVersion}. ` +
        `This means the specified package is not included in this Backstage ` +
        `release. This may imply the package has been replaced with an alternative - ` +
        `please review the documentation for the package. If you need to continue ` +
        `using this package, it will be necessary to switch to manually managing its ` +
        `version.`,
    );
  }

  return manifestEntry.version;
};
