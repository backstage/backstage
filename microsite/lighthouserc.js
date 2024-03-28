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

var sidebars = require('./sidebars.json');

module.exports = {
  ci: {
    collect: {
      url: [
        /** Home */
        'http://localhost:3000',
        /** Docs - Getting Started */
        'http://localhost:3000/docs/getting-started',
        /** Docs - Software Catalog */
        'http://localhost:3000/docs/features/software-catalog',
        /** Docs - Create a Plugin */
        'http://localhost:3000/docs/plugins/create-a-plugin',
        /** Docs - Designing for Backstage */
        'http://localhost:3000/docs/dls/design',
        /** Blog */
        'http://localhost:3000/blog',
        /** Plugins */
        'http://localhost:3000/plugins',
        /** Demos */
        'http://localhost:3000/demos',
        /** Community */
        'http://localhost:3000/community',
        /** Releases */
        ...sidebars.releases['Release Notes'].map(
          path => `http://localhost:3000/docs/${path}`,
        ),
      ],
      settings: {
        onlyCategories: ['accessibility'],
        output: ['html', 'json'],
        outputPath: './.lighthouseci/reports',
        preset: 'desktop',
      },
      // refers to root package scripts
      startServerCommand: 'yarn run start:microsite',
      startServerReadyPattern: 'compiled successfully',
      startServerReadyTimeout: 600000,
      numberOfRuns: 1,
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
