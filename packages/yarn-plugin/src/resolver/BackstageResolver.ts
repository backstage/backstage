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
} from '@yarnpkg/core';
import { PROTOCOL } from '../constants';
import { getCurrentBackstageVersion, getPackageVersion } from '../util';

export class BackstageResolver implements Resolver {
  static protocol = PROTOCOL;

  supportsDescriptor = (descriptor: Descriptor) =>
    descriptor.range.startsWith(BackstageResolver.protocol);

  shouldPersistResolution = () => true;

  bindDescriptor(descriptor: Descriptor): Descriptor {
    return structUtils.makeDescriptor(
      descriptor,
      `${PROTOCOL}${getCurrentBackstageVersion()}`,
    );
  }

  async getCandidates(descriptor: Descriptor): Promise<Locator[]> {
    return [
      structUtils.makeLocator(
        descriptor,
        `npm:${await getPackageVersion(descriptor)}`,
      ),
    ];
  }

  supportsLocator = () => false;

  getResolutionDependencies = () => ({});

  async getSatisfying(): Promise<{ locators: Locator[]; sorted: boolean }> {
    // Candidate versions produced by this resolver always use the `npm:`
    // protocol, so this function will never be called.
    throw new Error('Unreachable');
  }

  async resolve(): Promise<Package> {
    // Once transformed into locators (through getCandidates), the versions are
    // resolved by the NpmSemverResolver
    throw new Error(`Unreachable`);
  }
}
