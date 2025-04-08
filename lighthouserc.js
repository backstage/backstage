/*
 * Copyright 2023 The Backstage Authors
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
module.exports = {
  ci: {
    collect: {
      url: [
        /** Software Catalog */
        'http://localhost:3000/catalog',
        'http://localhost:3000/catalog-import',
        'http://localhost:3000/catalog/default/component/backstage',
        /** TechDocs */
        'http://localhost:3000/docs',
        'http://localhost:3000/docs/default/component/backstage',
        /** Software Templates */
        'http://localhost:3000/create',
        'http://localhost:3000/create/tasks',
        'http://localhost:3000/create/actions',
        'http://localhost:3000/create/edit',
        'http://localhost:3000/create/templates/default/react-ssr-template',
        /** Search */
        'http://localhost:3000/search',
        /** Miscellaneous */
        'http://localhost:3000/settings',
        /** plugin-devtools */
        'http://localhost:3000/devtools',
        'http://localhost:3000/devtools/config',
        /** plugin-explore */
        'http://localhost:3000/explore',
        'http://localhost:3000/explore/groups',
        'http://localhost:3000/explore/tools',
        /** plugin-tech-radar */
        'http://localhost:3000/tech-radar',
      ],
      settings: {
        onlyCategories: ['accessibility'],
        // need to disable storage reset because of auth
        disableStorageReset: true,
        output: ['html', 'json'],
        outputPath: './.lighthouseci/reports',
        preset: 'desktop',
      },
      startServerCommand: 'yarn start:lighthouse',
      startServerReadyPattern: 'webpack compiled successfully',
      startServerReadyTimeout: 600000,
      numberOfRuns: 1,
      puppeteerScript: './.lighthouseci/scripts/guest-auth.js',
    },
    assert: {
      assertions: {
        'categories:performance': 'off',
        'categories:pwa': 'off',
        'categories:best-practices': 'off',
        'categories:seo': 'off',
        'categories:accessibility': ['error', { minScore: 0.95 }],
      },
    },
  },
};
