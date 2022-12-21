/*
 * Copyright 2022 The Backstage Authors
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
import { defineConfig } from 'cypress';

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    fixturesFolder: './cypress/fixtures/example.js',
    specPattern: './cypress/integration/**/*.js',
    supportFile: './cypress/support/index.js',
    viewportWidth: 1920,
    viewportHeight: 1080,
    includeShadowDom: true,
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    env: {
      backstageBaseUrl: 'http://localhost:3000',
      mkDocsBaseUrl: 'http://localhost:8000',
      'cypress-plugin-snapshots': {
        autoCleanUp: false,
        imageConfig: {
          resizeDevicePixelRatio: true,
          threshold: 0.01,
        },
      },
    },
  },
});
