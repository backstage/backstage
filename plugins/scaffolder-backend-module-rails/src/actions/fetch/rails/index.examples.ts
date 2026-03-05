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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Fetch and template a minimal Rails app',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:rails',
          name: 'Fetch and Template Rails App',
          input: {
            url: 'https://github.com/backstage/backstage',
            values: {
              railsArguments: {
                minimal: true,
                skipBundle: true,
                skipWebpackInstall: true,
                skipTest: true,
                skipActionCable: true,
                skipActionMailer: true,
                skipActionMailbox: true,
                skipActiveStorage: true,
                skipActionText: true,
                skipActiveRecord: true,
                force: true,
                api: true,
                webpacker: 'react',
                database: 'postgresql',
                railsVersion: 'dev',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Fetch and template a Rails app with custom options',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:rails',
          name: 'Fetch and Template Rails App',
          input: {
            url: 'https://github.com/backstage/backstage',
            targetPath: 'custom-path',
            values: {
              railsArguments: {
                minimal: false,
                skipBundle: false,
                skipWebpackInstall: false,
                skipTest: false,
                skipActionCable: false,
                skipActionMailer: false,
                skipActionMailbox: false,
                skipActiveStorage: false,
                skipActionText: false,
                skipActiveRecord: false,
                force: false,
                api: false,
                webpacker: 'vue',
                database: 'mysql',
                railsVersion: 'edge',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Fetch and template a Rails app with Docker image',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:rails',
          name: 'Fetch and Template Rails App',
          input: {
            url: 'https://github.com/backstage/backstage',
            values: {
              railsArguments: {
                minimal: true,
                skipBundle: true,
                skipWebpackInstall: true,
                skipTest: true,
                skipActionCable: true,
                skipActionMailer: true,
                skipActionMailbox: true,
                skipActiveStorage: true,
                skipActionText: true,
                skipActiveRecord: true,
                force: true,
                api: true,
                webpacker: 'react',
                database: 'postgresql',
                railsVersion: 'dev',
              },
              imageName: 'custom/rails-image',
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Fetch and template a Rails app with different database and action mailer settings',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:rails',
          name: 'Fetch and Template Rails App',
          input: {
            url: 'https://github.com/backstage/backstage',
            values: {
              railsArguments: {
                minimal: false,
                skipBundle: false,
                skipWebpackInstall: false,
                skipTest: false,
                skipActionCable: false,
                skipActionMailer: false,
                skipActionMailbox: true,
                skipActiveStorage: false,
                skipActionText: false,
                skipActiveRecord: false,
                force: true,
                api: true,
                webpacker: 'angular',
                database: 'sqlite3',
                railsVersion: 'master',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Fetch and template a Rails app with full options including action mailer and active storage',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:rails',
          name: 'Fetch and Template Rails App',
          input: {
            url: 'https://github.com/backstage/backstage',
            values: {
              railsArguments: {
                minimal: false,
                skipBundle: false,
                skipWebpackInstall: false,
                skipTest: false,
                skipActionCable: false,
                skipActionMailer: false,
                skipActionMailbox: false,
                skipActiveStorage: false,
                skipActionText: false,
                skipActiveRecord: false,
                force: false,
                api: false,
                webpacker: 'stimulus',
                database: 'postgresql',
                railsVersion: 'fromImage',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Fetch and template a Rails app with API-only stack and custom template path',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:rails',
          name: 'Fetch and Template Rails App',
          input: {
            url: 'https://github.com/backstage/backstage',
            values: {
              railsArguments: {
                minimal: false,
                skipBundle: true,
                skipWebpackInstall: true,
                skipTest: true,
                skipActionCable: true,
                skipActionMailer: true,
                skipActionMailbox: true,
                skipActiveStorage: true,
                skipActionText: true,
                skipActiveRecord: true,
                force: true,
                api: true,
                webpacker: 'elm',
                database: 'mysql',
                railsVersion: 'dev',
                template: 'path/to/custom/template',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Fetch and template a Rails app with custom Webpack setup',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:rails',
          name: 'Fetch and Template Rails App',
          input: {
            url: 'https://github.com/backstage/backstage',
            values: {
              railsArguments: {
                minimal: false,
                skipBundle: false,
                skipWebpackInstall: false,
                skipTest: false,
                skipActionCable: false,
                skipActionMailer: false,
                skipActionMailbox: false,
                skipActiveStorage: false,
                skipActionText: false,
                skipActiveRecord: false,
                force: false,
                api: false,
                webpacker: 'angular',
                database: 'postgresql',
                railsVersion: 'dev',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Fetch and template a Rails app with specific Rails version and Action Mailer enabled',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:rails',
          name: 'Fetch and Template Rails App',
          input: {
            url: 'https://github.com/backstage/backstage',
            values: {
              railsArguments: {
                minimal: false,
                skipBundle: false,
                skipWebpackInstall: false,
                skipTest: false,
                skipActionCable: false,
                skipActionMailer: false,
                skipActionMailbox: false,
                skipActiveStorage: false,
                skipActionText: false,
                skipActiveRecord: false,
                force: true,
                api: true,
                webpacker: 'react',
                database: 'sqlite3',
                railsVersion: 'master',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Fetch and template a Rails app with specific database and Active Storage enabled',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:rails',
          name: 'Fetch and Template Rails App',
          input: {
            url: 'https://github.com/backstage/backstage',
            values: {
              railsArguments: {
                minimal: false,
                skipBundle: false,
                skipWebpackInstall: false,
                skipTest: false,
                skipActionCable: false,
                skipActionMailer: false,
                skipActionMailbox: false,
                skipActiveStorage: false,
                skipActionText: false,
                skipActiveRecord: false,
                force: true,
                api: true,
                webpacker: 'vue',
                database: 'postgresql',
                railsVersion: 'fromImage',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Fetch and template a Rails app with full options including database and skip options',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:rails',
          name: 'Fetch and Template Rails App',
          input: {
            url: 'https://github.com/backstage/backstage',
            values: {
              railsArguments: {
                minimal: false,
                skipBundle: true,
                skipWebpackInstall: true,
                skipTest: true,
                skipActionCable: true,
                skipActionMailer: true,
                skipActionMailbox: true,
                skipActiveStorage: true,
                skipActionText: true,
                skipActiveRecord: true,
                force: false,
                api: false,
                webpacker: 'stimulus',
                database: 'sqlite3',
                railsVersion: 'dev',
              },
            },
          },
        },
      ],
    }),
  },
];
