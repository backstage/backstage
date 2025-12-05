/*
 * Copyright 2025 The Backstage Authors
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

import { Host, Remote, SharedDependencies } from './types';

/**
 * The list of default shared dependencies, expected to be the same
 * for both the module federation host and remotes.
 *
 * @internal
 */
const defaultSharedDependencies: SharedDependencies<{
  host: Host;
  remote: Remote;
}> = {
  // React
  react: {
    singleton: true,
    host: {
      eager: true,
      requiredVersion: '*',
    },
    remote: {
      import: false,
      requiredVersion: '*',
    },
  },
  'react-dom': {
    singleton: true,
    host: {
      eager: true,
      requiredVersion: '*',
    },
    remote: {
      import: false,
      requiredVersion: '*',
    },
  },
  // React Router
  'react-router': {
    singleton: true,
    host: {
      eager: true,
      requiredVersion: '*',
    },
    remote: {
      import: false,
      requiredVersion: '*',
    },
  },
  'react-router-dom': {
    singleton: true,
    host: {
      eager: true,
      requiredVersion: '*',
    },
    remote: {
      import: false,
      requiredVersion: '*',
    },
  },
  // MUI v4
  // not setting import: false for MUI packages as this
  // will break once Backstage moves to BUI
  '@material-ui/core/styles': {
    singleton: true,
    host: {
      eager: true,
      requiredVersion: '*',
    },
    remote: {
      requiredVersion: '*',
    },
  },
  '@material-ui/styles': {
    singleton: true,
    host: {
      eager: true,
      requiredVersion: '*',
    },
    remote: {
      requiredVersion: '*',
    },
  },
  // MUI v5
  // not setting import: false for MUI packages as this
  // will break once Backstage moves to BUI
  '@mui/material/styles/': {
    singleton: true,
    host: {
      eager: true,
      requiredVersion: '*',
    },
    remote: {
      requiredVersion: '*',
    },
  },
  '@emotion/react': {
    singleton: true,
    host: {
      eager: true,
      requiredVersion: '*',
    },
    remote: {
      requiredVersion: '*',
    },
  },
};

/**
 * Returns the list of default shared dependencies for the host, with host-only properties.
 *
 * @public
 */
export function defaultHostSharedDependencies(): SharedDependencies<Host> {
  return Object.fromEntries(
    Object.entries(defaultSharedDependencies).map(([name, p]) => [
      name,
      {
        singleton: p.singleton,
        ...p.host,
      },
    ]),
  );
}

/**
 * Returns the list of default shared dependencies for the remote, with remote-only properties.
 *
 * @public
 */
export function defaultRemoteSharedDependencies(): SharedDependencies<Remote> {
  return Object.fromEntries(
    Object.entries(defaultSharedDependencies).map(([name, p]) => [
      name,
      {
        singleton: p.singleton,
        ...p.remote,
      },
    ]),
  );
}
