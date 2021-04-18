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
import { Alert } from '@material-ui/lab';

import {
  gitHubReleaseManagerPlugin,
  GitHubReleaseManagerPage,
} from '../src/plugin';

function DevWrapper({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 30 }}>{children}</div>;
}

createDevApp()
  .registerPlugin(gitHubReleaseManagerPlugin)
  .addPage({
    title: 'Dynamic',
    element: (
      <>
        <Alert severity="info">Configure via select inputs</Alert>

        <DevWrapper>
          <GitHubReleaseManagerPage />
        </DevWrapper>
      </>
    ),
  })
  .addPage({
    title: 'Static',
    element: (
      <DevWrapper>
        <Alert severity="info">Statically configured via props</Alert>

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
    element: (
      <DevWrapper>
        <Alert severity="info">Optionally omit components</Alert>

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
            promoteRc: { omit: true },
            patch: { omit: true },
          }}
        />
      </DevWrapper>
    ),
  })
  .render();
