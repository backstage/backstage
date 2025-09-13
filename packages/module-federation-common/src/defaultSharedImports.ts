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

import { SharedImport } from './types';

/**
 * @public
 */
export const defaultSharedImports: SharedImport[] = [
  // React
  {
    name: 'react',
    module: () => import('react'),
    version: '18.3.1',
    import: false,
  },
  {
    name: 'react-dom',
    module: () => import('react-dom'),
    version: '18.3.1',
    import: false,
  },
  // React Router
  {
    name: 'react-router',
    module: () => import('react-router'),
    version: '6.28.2',
    import: false,
  },
  {
    name: 'react-router-dom',
    module: () => import('react-router-dom'),
    version: '6.28.2',
    import: false,
  },
  // MUI v4
  // not setting import: false for MUI packages as this
  // will break once Backstage moves to BUI
  {
    name: '@material-ui/core/styles',
    module: () => import('@material-ui/core/styles'),
    version: '4.12.4',
  },
  {
    name: '@material-ui/styles',
    module: () => import('@material-ui/styles'),
    version: '4.11.5',
  },
  // MUI v5
  // not setting import: false for MUI packages as this
  // will break once Backstage moves to BUI
  {
    name: '@mui/material/styles/',
    module: () => import('@mui/material/styles/'),
    version: '5.16.14',
  },
  {
    name: '@emotion/react',
    module: () => import('@emotion/react'),
    version: '11.13.5',
  },
];
