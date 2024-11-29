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
  structUtils,
  Descriptor,
  Locator,
  Package,
  Resolver,
  ResolveOptions,
} from '@yarnpkg/core';
import { PROTOCOL } from '../constants';
import {
  bindBackstageVersion,
  getCurrentBackstageVersion,
  getPackageVersion,
} from '../util';

export class BackstageResolver implements Resolver {
  static protocol = PROTOCOL;

  supportsDescriptor = (descriptor: Descriptor) =>
    descriptor.range.startsWith(BackstageResolver.protocol);

  shouldPersistResolution = () => true;

  /**
   * Called for each dependency present in the dependency list of a package
   * definition. If it returns a new descriptor, this new descriptor will be
   * used.
   *
   * In this plugin, we convert the specific range "backstage:^" to
   * "backstage:<version from backstage.json>". This new range will be the one
   * stored in lockfile entries, ensuring that we re-resolve the package when
   * the version in backstage.json changes.
   */
  bindDescriptor(descriptor: Descriptor): Descriptor {
    if (descriptor.range === 'backstage:^') {
      return bindBackstageVersion(descriptor, getCurrentBackstageVersion());
    }

    return descriptor;
  }

  /**
   * Given a descriptor, return the list of locators that potentially satisfy
   * it. The implementation in this plugin converts a `backstage:` range with a
   * concrete version into the appropriate concrete npm version for that
   * backstage release.
   */
  async getCandidates(
    descriptor: Descriptor,
    _dependencies: Record<string, Package>,
    opts: ResolveOptions,
  ): Promise<Locator[]> {
    return [
      structUtils.makeLocator(
        descriptor,
        `npm:${await getPackageVersion(
          descriptor,
          opts.project.configuration,
        )}`,
      ),
    ];
  }

  /**
   * Given a descriptor and a list of possible locators, return a filtered list
   * containing only locators that satisfy the descriptor. Since each Backstage
   * release version corresponds to a single version for each package, we just
   * need to filter that array for locators with that exact version.
   */
  async getSatisfying(
    descriptor: Descriptor,
    _dependencies: Record<string, Package>,
    locators: Array<Locator>,
    opts: ResolveOptions,
  ): Promise<{ locators: Locator[]; sorted: boolean }> {
    const packageVersion = await getPackageVersion(
      descriptor,
      opts.project.configuration,
    );

    return {
      locators: locators.filter(
        locator =>
          structUtils.areIdentsEqual(descriptor, locator) &&
          locator.reference === `npm:${packageVersion}`,
      ),
      sorted: true,
    };
  }

  /**
   * This plugin does not need to support any locators itself, since the
   * `getCandidates` method will always convert `backstage:` versions into
   * `npm:` versions which can be handled as usual.
   */
  supportsLocator = () => false;

  /**
   * This resolver never transforms the packages that are actually depended on,
   * only replaces versions. As such there's never a need to add additional
   * dependencies.
   */
  getResolutionDependencies = () => ({});

  /**
   * Once transformed into locators (through getCandidates), the versions are
   * resolved by the NpmSemverResolver
   */
  async resolve(): Promise<Package> {
    throw new Error(`Unreachable`);
  }
}
