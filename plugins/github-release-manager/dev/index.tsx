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
import { Typography } from '@material-ui/core';

import {
  gitHubReleaseManagerPlugin,
  GitHubReleaseManagerPage,
} from '../src/plugin';
import { InfoCardPlus } from '../src/components/InfoCardPlus';

function DevWrapper({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 30 }}>{children}</div>;
}

createDevApp()
  .registerPlugin(gitHubReleaseManagerPlugin)
  .addPage({
    title: 'Dynamic',
    path: '/dynamic',
    element: (
      <DevWrapper>
        <InfoCardPlus>
          <Typography variant="h4">Dev notes</Typography>
          <Typography>Configure plugin via select inputs</Typography>
        </InfoCardPlus>

        <GitHubReleaseManagerPage />
      </DevWrapper>
    ),
  })
  .addPage({
    title: 'Static',
    path: '/static',
    element: (
      <DevWrapper>
        <InfoCardPlus>
          <Typography variant="h4">Dev notes</Typography>
          <Typography>
            Configure plugin statically by passing props to the
            `GitHubReleaseManagerPage` component
          </Typography>
        </InfoCardPlus>

        <GitHubReleaseManagerPage
          project={{
            owner: 'eengervall-playground',
            repo: 'RMaaS-semver',
            versioningStrategy: 'semver',
          }}
        />
      </DevWrapper>
    ),
  })
  .addPage({
    title: 'Omit',
    path: '/omit',
    element: (
      <DevWrapper>
        <InfoCardPlus>
          <Typography variant="h4">Dev notes</Typography>
          <Typography>Each components can be omitted</Typography>
          <Typography>Success callbacks can also be added</Typography>
        </InfoCardPlus>

        <GitHubReleaseManagerPage
          project={{
            owner: 'eengervall-playground',
            repo: 'playground-semver',
            versioningStrategy: 'semver',
          }}
          components={{
            createRc: {
              successCb: ({
                comparisonUrl,
                createdTag,
                gitHubReleaseName,
                gitHubReleaseUrl,
                previousTag,
              }) => {
                // eslint-disable-next-line no-console
                console.log(
                  'Custom success callback for Create RC',
                  comparisonUrl,
                  createdTag,
                  gitHubReleaseName,
                  gitHubReleaseUrl,
                  previousTag,
                );
              },
            },
            promoteRc: {
              omit: true,
            },
            patch: {
              omit: true,
            },
          }}
        />
      </DevWrapper>
    ),
  })
  .render();
