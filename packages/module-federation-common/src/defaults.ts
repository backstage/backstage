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

import { RemoteSharedDependencies, HostSharedDependencies } from './types';

/**
 * The list of default shared dependencies, expected to be the same
 * for both the module federation host and remotes.
 *
 * @internal
 */
const defaultSharedDependencies = {
  // React
  react: {
    host: {},
    remote: { import: false },
  },
  'react-dom': {
    host: {},
    remote: { import: false },
  },
  // React Router
  'react-router': {
    host: {},
    remote: { import: false },
  },
  'react-router-dom': {
    host: {},
    remote: { import: false },
  },
  // MUI v4
  // not setting import: false for MUI packages as this
  // will break once Backstage moves to BUI
  '@material-ui/core/styles': {
    host: {},
    remote: {},
  },
  '@material-ui/styles': {
    host: {},
    remote: {},
  },
  // MUI v5
  // not setting import: false for MUI packages as this
  // will break once Backstage moves to BUI
  '@mui/material/styles/': {
    host: {},
    remote: {},
  },
  '@emotion/react': {
    host: {},
    remote: {},
  },
} as const;

/**
 * Returns the list of default shared dependencies for the host, with host-only properties.
 *
 * @public
 */
export function defaultHostSharedDependencies(): HostSharedDependencies {
  return Object.fromEntries(
    Object.entries(defaultSharedDependencies).map(([name, p]) => [
      name,
      {
        eager: true,
        singleton: true,
        requiredVersion: '*',
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
export function defaultRemoteSharedDependencies(): RemoteSharedDependencies {
  return Object.fromEntries(
    Object.entries(defaultSharedDependencies).map(([name, p]) => [
      name,
      {
        eager: false,
        singleton: true,
        requiredVersion: '*',
        ...p.remote,
      },
    ]),
  );
}
