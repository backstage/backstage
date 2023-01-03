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
export const backstageConfig = {
  backend: {
    listen: { port: 8800 },
    database: {
      prefix: 'graphql_tests_',
      client: 'pg',
      connection: {
        host: 'localhost',
        port: '5432',
        user: 'postgres',
        password: 'postgres',
      },
    },
    baseUrl: 'http://localhost:8800',
  },
  catalog: {
    rules: [
      {
        allow: [
          'Component',
          'System',
          'API',
          'Group',
          'User',
          'Resource',
          'Location',
        ],
      },
    ],
    locations: [
      {
        type: 'url',
        target:
          'https://github.com/thefrontside/backstage/blob/main/catalog-info.yaml',
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-components.yaml',
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-systems.yaml',
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-apis.yaml',
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-resources.yaml',
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/acme/org.yaml',
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/software-templates/blob/main/scaffolder-templates/react-ssr-template/template.yaml',
        rules: [{ allow: ['Template'] }],
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/software-templates/blob/main/scaffolder-templates/springboot-grpc-template/template.yaml',
        rules: [{ allow: ['Template'] }],
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/software-templates/blob/main/scaffolder-templates/docs-template/template.yaml',
        rules: [{ allow: ['Template'] }],
      },
    ],
  },
};
