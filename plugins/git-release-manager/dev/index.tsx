/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { Box, Button, Typography } from '@material-ui/core';

import { gitReleaseManagerPlugin, GitReleaseManagerPage } from '../src/plugin';
import { InfoCardPlus } from '../src/components/InfoCardPlus';

createDevApp()
  .registerPlugin(gitReleaseManagerPlugin)
  .addPage({
    title: 'Dynamic',
    path: '/dynamic',
    element: (
      <Box padding={4}>
        <InfoCardPlus>
          <Typography variant="h4">Dev notes</Typography>
          <Typography>Configure plugin via select inputs</Typography>
        </InfoCardPlus>

        <GitReleaseManagerPage />
      </Box>
    ),
  })
  .addPage({
    title: 'Static',
    path: '/static',
    element: (
      <Box padding={4}>
        <InfoCardPlus>
          <Typography variant="h4">Dev notes</Typography>

          <Typography>
            Configure plugin statically by passing props to the
            `GitHubReleaseManagerPage` component
          </Typography>

          <Typography variant="body2">
            Note that the static configuration points towards private
            repositories and will thus not work for everyone.
          </Typography>
        </InfoCardPlus>

        <GitReleaseManagerPage
          project={{
            owner: 'eengervall-playground',
            repo: 'RMaaS-semver',
            versioningStrategy: 'semver',
          }}
        />
      </Box>
    ),
  })
  .addPage({
    title: 'Omit',
    path: '/omit',
    element: (
      <Box padding={4}>
        <InfoCardPlus>
          <Typography variant="h4">Dev notes</Typography>
          <Typography>
            Each feature can be individually omitted as well as have success
            callback attached to them
          </Typography>
        </InfoCardPlus>

        <GitReleaseManagerPage
          project={{
            owner: 'eengervall-playground',
            repo: 'playground-semver',
            versioningStrategy: 'semver',
          }}
          features={{
            createRc: {
              onSuccess: args => {
                // eslint-disable-next-line no-console
                console.log(
                  'Custom success callback for Create RC with the following args',
                );
                console.log(JSON.stringify(args, null, 2)); // eslint-disable-line no-console
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
      </Box>
    ),
  })
  .addPage({
    title: 'Custom',
    path: '/custom',
    element: (
      <Box padding={4}>
        <InfoCardPlus>
          <Typography variant="h4">Dev notes</Typography>
          <Typography>
            The custom feature's return value can either be a React Element or
            an array of React Elements.
          </Typography>
        </InfoCardPlus>

        <GitReleaseManagerPage
          project={{
            owner: 'eengervall-playground',
            repo: 'playground-semver',
            versioningStrategy: 'semver',
          }}
          features={{
            custom: {
              factory: args => {
                return (
                  <InfoCardPlus>
                    <Typography variant="h4">I'm a custom feature</Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        console.log(`Here's my args 🚀`); // eslint-disable-line no-console
                        console.log(JSON.stringify(args, null, 2)); // eslint-disable-line no-console
                      }}
                    >
                      View the arguments for this feature in the console by
                      pressing this button
                    </Button>
                  </InfoCardPlus>
                );
              },
            },
          }}
        />
      </Box>
    ),
  })
  .render();
