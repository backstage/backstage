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

import { Plugin, semverUtils, YarnVersion } from '@yarnpkg/core';
import chalk from 'chalk';
import { beforeWorkspacePacking } from './handlers/beforeWorkspacePacking';
import { BackstageResolver } from './resolver/BackstageResolver';

if (!semverUtils.satisfiesWithPrereleases(YarnVersion, '^4.1.1')) {
  console.error();
  console.error(
    `${chalk.bold.red(
      'Unsupported yarn version.',
    )}: The Backstage yarn plugin only works with yarn ^4.1.1. Please upgrade yarn, or remove this plugin with "yarn plugin remove @yarnpkg/plugin-backstage".`,
  );
  console.error();
}

/**
 * @public
 */
const plugin: Plugin = {
  hooks: {
    beforeWorkspacePacking,
  },
  resolvers: [BackstageResolver],
};

export default plugin;
