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

import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';
import { ActionContext } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import { createSentryFetchDSNAction } from './fetchDSN';
import yaml from 'yaml';
import { examples } from './fetchDSN.examples';

describe('sentry:fetch:dsn action', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  const createScaffolderConfig = (configData: JsonObject = {}) => ({
    config: new ConfigReader({
      scaffolder: {
        ...configData,
      },
    }),
  });
  const getActionContext = (
    authToken: string | null,
  ): ActionContext<{
    organizationSlug: string;
    projectSlug: string;
    authToken?: string;
    apiBaseUrl?: string;
  }> =>
    createMockActionContext({
      workspacePath: './dev/proj',
      logger: jest.createMockFromModule('winston'),
      input: {
        organizationSlug: 'my-org',
        projectSlug: 'my-project',
        ...(authToken ? { authToken } : {}),
      },
    });

  const mockSentryKeysResponse = [
    {
      id: '12345',
      name: 'Default',
      public: 'abcdef1234567890',
      secret: 'secret1234567890',
      projectId: 67890,
      isActive: true,
      dateCreated: '2021-01-01T00:00:00.000Z',
      dsn: {
        secret: 'https://abcdef1234567890:secret1234567890@sentry.io/67890',
        public: 'https://abcdef1234567890@sentry.io/67890',
        csp: 'https://sentry.io/api/67890/csp-report/?sentry_key=abcdef1234567890',
        security:
          'https://sentry.io/api/67890/security-report/?sentry_key=abcdef1234567890',
        minidump:
          'https://sentry.io/api/67890/minidump/?sentry_key=abcdef1234567890',
        nel: 'https://sentry.io/api/67890/nel-report/?sentry_key=abcdef1234567890',
        unreal: 'https://sentry.io/api/67890/unreal/abcdef1234567890/',
        cdn: 'https://sentry.io/js-sdk-loader/abcdef1234567890.min.js',
      },
      browserSdkVersion: '6.x',
      browserSdk: {
        choices: [
          ['latest', 'latest'],
          ['6.x', '6.x'],
          ['5.x', '5.x'],
          ['4.x', '4.x'],
        ],
      },
    },
  ];

  it.each([
    {
      templateExample: examples[0],
      expectedToken:
        'a14711beb516e1e910d2ede554dc1bf725654ef3c75e5a9106de9aec13d5df96',
    },
    {
      templateExample: examples[1],
      expectedToken:
        'b15711beb516e1e910d2ede554dc1bf725654ef3c75e5a9106de9aec13d4gf93',
    },
  ])(
    `should $templateExample.description`,
    async ({ templateExample, expectedToken }) => {
      expect.assertions(3);

      let input;
      try {
        input = yaml.parse(templateExample.example).steps[0].input;
      } catch (error) {
        console.error('Failed to parse YAML:', error);
      }

      const action = createSentryFetchDSNAction(
        createScaffolderConfig({
          sentry: {
            token:
              'b15711beb516e1e910d2ede554dc1bf725654ef3c75e5a9106de9aec13d4gf93',
          },
        }),
      );
      const actionContext = getActionContext(input.authToken);

      worker.use(
        http.get(
          `https://sentry.io/api/0/projects/${input.organizationSlug}/${input.projectSlug}/keys/`,
          async ({ request }) => {
            expect(request.headers.get('Authorization')).toBe(
              `Bearer ${expectedToken}`,
            );
            expect(request.headers.get('Content-Type')).toBe(
              `application/json`,
            );
            return HttpResponse.json(mockSentryKeysResponse, { status: 200 });
          },
        ),
      );

      await action.handler({
        ...actionContext,
        input: {
          ...actionContext.input,
          ...input,
        },
      });
      expect(actionContext.output).toHaveBeenCalledWith(
        'dsn',
        'https://abcdef1234567890@sentry.io/67890',
      );
    },
  );

  it(`should ${examples[2].description}`, async () => {
    expect.assertions(3);

    let input;
    try {
      input = yaml.parse(examples[2].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const action = createSentryFetchDSNAction(createScaffolderConfig());
    const actionContext = getActionContext(null);

    worker.use(
      http.get(
        `${input.apiBaseUrl || 'https://sentry.io/api/0'}/projects/${
          input.organizationSlug
        }/${input.projectSlug}/keys/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer b14711beb516e1e910d2ede554dc1bf725654ef3c75e5a9106de9aec13d5df97`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          return HttpResponse.json(
            [{ dsn: { public: 'https://abcdef1234567890@sentry.io/67890' } }],
            {
              status: 200,
            },
          );
        },
      ),
    );

    await action.handler({
      ...actionContext,
      input: {
        ...actionContext.input,
        ...input,
      },
    });
    expect(actionContext.output).toHaveBeenCalledWith(
      'dsn',
      'https://abcdef1234567890@sentry.io/67890',
    );
  });
});
