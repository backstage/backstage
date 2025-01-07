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
import { NpmSemverResolver } from '@yarnpkg/plugin-npm';
import { PROTOCOL } from '../constants';

export class BackstageNpmResolver implements Resolver {
  static protocol = PROTOCOL;

  /**
   * Target only descriptors using the `backstage:` protocol
   */
  supportsDescriptor = (descriptor: Descriptor) =>
    descriptor.range.startsWith(BackstageNpmResolver.protocol);

  /**
   * We treat any `backstage:` descriptor as if it's targeting the npm package
   * version from the manifest for the current version of Backstage, by pulling
   * in the `NpmSemverResolver` and deferring to its `getCandidates` method.
   *
   * The version itself comes from the `npm` parameter on the incoming
   * descriptor, which is set by the `reduceDependency` hook.
   */
  async getCandidates(
    descriptor: Descriptor,
    dependencies: Record<string, Package>,
    opts: ResolveOptions,
  ): Promise<Locator[]> {
    const npmVersion = structUtils.parseRange(descriptor.range).params?.npm;

    if (!npmVersion || Array.isArray(npmVersion)) {
      throw new Error(
        `Missing npm parameter on backstage: range "${descriptor.range}"`,
      );
    }

    return new NpmSemverResolver().getCandidates(
      structUtils.makeDescriptor(descriptor, `npm:^${npmVersion}`),
      dependencies,
      opts,
    );
  }

  /**
   * We insert the `npm:^<version>` descriptor as an additional dependency to
   * ensure that dependencies remain locked when adding and removing the plugin
   * from repositories. This is relevant for example when building packed
   * production-like workspaces for testing using `backstage-cli
   * build-workspace`.
   */
  getResolutionDependencies(
    descriptor: Descriptor,
  ): Record<string, Descriptor> {
    const npmVersion = structUtils.parseRange(descriptor.range).params?.npm;

    if (!npmVersion) {
      throw new Error(`Unreachable`);
    }

    return {
      [structUtils.stringifyIdent(descriptor)]: structUtils.makeDescriptor(
        descriptor,
        `npm:^${npmVersion}`,
      ),
    };
  }

  /**
   * This method is called when deduplicating locators. We first convert any
   * `backstage:` locators into the corresponding `npm:` locator, and then defer
   * to the implementation from `NpmSemverResolver`.
   */
  async getSatisfying(
    descriptor: Descriptor,
    dependencies: Record<string, Package>,
    locators: Array<Locator>,
    opts: ResolveOptions,
  ) {
    let npmDescriptor = descriptor;
    const range = structUtils.parseRange(npmDescriptor.range);

    if (range.protocol === PROTOCOL) {
      const npmVersion = range.params?.npm;
      npmDescriptor = structUtils.makeDescriptor(
        descriptor,
        `npm:^${npmVersion}`,
      );
    }

    return new NpmSemverResolver().getSatisfying(
      npmDescriptor,
      dependencies,
      locators,
      opts,
    );
  }

  /**
   * Stub - no descriptor binding is needed in this resolver (note though that
   * it does rely on the binding performed in the `reduceDependency` hook).
   */
  bindDescriptor = (descriptor: Descriptor) => descriptor;

  /**
   * This plugin does not need to support any locators itself, since the
   * `getCandidates` method will always convert `backstage:` versions into
   * `npm:` versions which are resolved using the `NpmSemverResolver`.
   */
  supportsLocator = () => false;

  /**
   * This method should never be called, since all emitted locators use the
   * `npm:` protocol.
   */
  shouldPersistResolution = () => {
    throw new Error('Unreachable');
  };

  /**
   * This method should never be called, since all emitted locators use the
   * `npm:` protocol.
   */
  resolve = async () => {
    throw new Error(`Unreachable`);
  };
}
