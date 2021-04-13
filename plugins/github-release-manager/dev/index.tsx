/*
 * Copyright 2021 Spotify AB
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
import React from 'react';
import { createDevApp } from '@backstage/dev-utils';

import {
  gitHubReleaseManagerPlugin,
  GitHubReleaseManagerPage,
} from '../src/plugin';

createDevApp()
  .registerPlugin(gitHubReleaseManagerPlugin)
  .addPage({
    title: 'Page 1',
    element: (
      <GitHubReleaseManagerPage
        project={{
          github: {
            org: 'erikengervall',
            repo: 'playground',
          },
          name: 'GitHub Release Manager (semver)',
          versioningStrategy: 'semver',
        }}
      />
    ),
  })
  .addPage({
    title: 'Page 2',
    element: (
      <GitHubReleaseManagerPage
        project={{
          github: {
            org: 'erikengervall',
            repo: 'playground-2',
          },
          name: 'GitHub Release Manager (calver)',
          versioningStrategy: 'calver',
        }}
      />
    ),
  })
  .render();
