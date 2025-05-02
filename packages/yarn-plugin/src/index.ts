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

/**
 * Yarn plugin for resolving package versions based on
 * a Backstage version manifest.
 *
 * @packageDocumentation
 */

import { Plugin, Hooks, semverUtils, YarnVersion } from '@yarnpkg/core';
import { Hooks as PackHooks } from '@yarnpkg/plugin-pack';
import { beforeWorkspacePacking, reduceDependency } from './handlers';
import { BackstageNpmResolver } from './resolvers';

// All dependencies of the yarn plugin are bundled during the build. Chalk
// triples the size of the plugin bundle when included, so we avoid the
// dependency by hard-coding the ANSI escape codes for the one bit of formatting
// we need.
const RED_BOLD = `\u001B[31;1m`;
const RESET = '\u001B[0m';

if (!semverUtils.satisfiesWithPrereleases(YarnVersion, '^4.1.1')) {
  console.error();
  console.error(
    `${RED_BOLD}Unsupported yarn version${RESET}: The Backstage yarn plugin only works with yarn ^4.1.1. Please upgrade yarn, or remove this plugin with "yarn plugin remove @yarnpkg/plugin-backstage".`,
  );
  console.error();
}

/**
 * @public
 */
const plugin: Plugin<Hooks & PackHooks> = {
  hooks: {
    reduceDependency,
    beforeWorkspacePacking,
  },
  resolvers: [BackstageNpmResolver],
};

export default plugin;
