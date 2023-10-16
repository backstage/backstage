/*
 * Copyright 2020 The Backstage Authors
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

import { ConfigReader } from '@backstage/core-app-api';
import { ScmIntegrations } from '@backstage/integration';
import { MockFetchApi, setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ScaffolderClient } from './api';
import { EventSourcePolyfill } from 'event-source-polyfill';
import {
  SerializedTask,
  SerializedTaskEvent,
} from '@backstage/plugin-scaffolder-node';
import { ScaffolderStep } from '@backstage/plugin-scaffolder-react';

const MockedEventSource = EventSourcePolyfill as jest.MockedClass<
  typeof EventSourcePolyfill
>;

jest.mock('event-source-polyfill');

const server = setupServer();

describe('api', () => {
  setupRequestMockHandlers(server);
  const mockBaseUrl = 'http://backstage/api';

  const discoveryApi = { getBaseUrl: async () => mockBaseUrl };
  const fetchApi = new MockFetchApi();
  const identityApi = {
    getBackstageIdentity: jest.fn(),
    getProfileInfo: jest.fn(),
    getCredentials: jest.fn(),
    signOut: jest.fn(),
  };

  const scmIntegrationsApi = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [
          {
            host: 'hello.com',
          },
        ],
      },
    }),
  );

  let apiClient: ScaffolderClient;
  beforeEach(() => {
    apiClient = new ScaffolderClient({
      scmIntegrationsApi,
      discoveryApi,
      fetchApi,
      identityApi,
    });

    jest.restoreAllMocks();
    identityApi.getBackstageIdentity.mockReturnValue({});
  });

  it('should return default and custom integrations', async () => {
    const allowedHosts = [
      'hello.com',
      'gitlab.com',
      'github.com',
      'dev.azure.com',
      'bitbucket.org',
    ];
    const { integrations } = await apiClient.getIntegrationsList({
      allowedHosts,
    });
    integrations.forEach(integration =>
      expect(allowedHosts).toContain(integration.host),
    );
  });

  describe('streamEvents', () => {
    describe('eventsource', () => {
      it('should work', async () => {
        MockedEventSource.prototype.addEventListener.mockImplementation(
          (type, fn) => {
            if (typeof fn !== 'function') {
              return;
            }

            if (type === 'log') {
              fn({
                data: '{"id":1,"taskId":"a-random-id","type":"log","createdAt":"","body":{"message":"My log message"}}',
              } as any);
            } else if (type === 'completion') {
              fn({
                data: '{"id":2,"taskId":"a-random-id","type":"completion","createdAt":"","body":{"message":"Finished!"}}',
              } as any);
            }
          },
        );

        const token = 'fake-token';
        identityApi.getCredentials.mockResolvedValue({ token: token });

        const next = jest.fn();

        await new Promise<void>(complete => {
          apiClient
            .streamLogs({ taskId: 'a-random-task-id' })
            .subscribe({ next, complete });
        });

        expect(MockedEventSource).toHaveBeenCalledWith(
          'http://backstage/api/v2/tasks/a-random-task-id/eventstream',
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        expect(MockedEventSource.prototype.close).toHaveBeenCalled();

        expect(next).toHaveBeenCalledTimes(2);
        expect(next).toHaveBeenCalledWith({
          id: 1,
          taskId: 'a-random-id',
          type: 'log',
          createdAt: '',
          body: { message: 'My log message' },
        });
        expect(next).toHaveBeenCalledWith({
          id: 2,
          taskId: 'a-random-id',
          type: 'completion',
          createdAt: '',
          body: { message: 'Finished!' },
        });
      });
    });

    describe('longPolling', () => {
      beforeEach(() => {
        apiClient = new ScaffolderClient({
          scmIntegrationsApi,
          discoveryApi,
          fetchApi,
          identityApi,
          useLongPollingLogs: true,
        });
      });

      it('should work', async () => {
        server.use(
          rest.get(
            `${mockBaseUrl}/v2/tasks/:taskId/events`,
            (req, res, ctx) => {
              const { taskId } = req.params;
              const after = req.url.searchParams.get('after');

              if (taskId === 'a-random-task-id') {
                if (!after) {
                  return res(
                    ctx.json([
                      {
                        id: 1,
                        taskId: 'a-random-id',
                        type: 'log',
                        createdAt: '',
                        body: { message: 'My log message' },
                      },
                    ]),
                  );
                } else if (after === '1') {
                  return res(
                    ctx.json([
                      {
                        id: 2,
                        taskId: 'a-random-id',
                        type: 'completion',
                        createdAt: '',
                        body: { message: 'Finished!' },
                      },
                    ]),
                  );
                }
              }

              return res(ctx.status(500));
            },
          ),
        );

        const next = jest.fn();

        await new Promise<void>(complete =>
          apiClient
            .streamLogs({ taskId: 'a-random-task-id' })
            .subscribe({ next, complete }),
        );

        expect(next).toHaveBeenCalledTimes(2);
        expect(next).toHaveBeenCalledWith({
          id: 1,
          taskId: 'a-random-id',
          type: 'log',
          createdAt: '',
          body: { message: 'My log message' },
        });
        expect(next).toHaveBeenCalledWith({
          id: 2,
          taskId: 'a-random-id',
          type: 'completion',
          createdAt: '',
          body: { message: 'Finished!' },
        });
      });

      it('should unsubscribe', async () => {
        expect.assertions(3);

        server.use(
          rest.get(
            `${mockBaseUrl}/v2/tasks/:taskId/events`,
            (req, res, ctx) => {
              const { taskId } = req.params;

              const after = req.url.searchParams.get('after');

              // use assertion to make sure it is not called after unsubscribing
              expect(after).toBe(null);

              if (taskId === 'a-random-task-id') {
                return res(
                  ctx.json([
                    {
                      id: 1,
                      taskId: 'a-random-id',
                      type: 'log',
                      createdAt: '',
                      body: { message: 'My log message' },
                    },
                  ]),
                );
              }

              return res(ctx.status(500));
            },
          ),
        );

        const next = jest.fn();

        await new Promise<void>(complete => {
          const subscription = apiClient
            .streamLogs({ taskId: 'a-random-task-id' })
            .subscribe({
              next: (...args) => {
                next(...args);
                subscription.unsubscribe();
                complete();
              },
            });
        });

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({
          id: 1,
          taskId: 'a-random-id',
          type: 'log',
          createdAt: '',
          body: { message: 'My log message' },
        });
      });

      it('should continue after error', async () => {
        const called = jest.fn();

        server.use(
          rest.get(
            `${mockBaseUrl}/v2/tasks/:taskId/events`,
            (_req, res, ctx) => {
              called();

              if (called.mock.calls.length > 1) {
                return res(
                  ctx.json([
                    {
                      id: 2,
                      taskId: 'a-random-id',
                      type: 'completion',
                      createdAt: '',
                      body: { message: 'Finished!' },
                    },
                  ]),
                );
              }

              return res(ctx.status(500));
            },
          ),
        );

        const next = jest.fn();

        await new Promise<void>(complete =>
          apiClient
            .streamLogs({ taskId: 'a-random-task-id' })
            .subscribe({ next, complete }),
        );

        expect(called).toHaveBeenCalledTimes(2);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({
          id: 2,
          taskId: 'a-random-id',
          type: 'completion',
          createdAt: '',
          body: { message: 'Finished!' },
        });
      });
    });
  });

  describe('getTask', () => {
    it('should return the task enriched with timestamps', async () => {
      const taskId = 'e4e4cb25-e743-4b79-8572-87e9d35aa998';
      server.use(
        rest.get(`${mockBaseUrl}/v2/tasks/:taskId`, (_req, res, ctx) => {
          return res(
            ctx.json({
              createdAt: '2023-10-16T08:21:32.038Z',
              id: taskId,
              lastHeartbeatAt: '2023-10-16T08:21:54.304Z',
              spec: {
                apiVersion: 'scaffolder.backstage.io/v1beta3',
                steps: [
                  {
                    action: 'fetch:template',
                    id: 'fetch',
                  },
                  {
                    action: 'debug:wait',
                    id: 'mock-step-1',
                  },
                  {
                    action: 'debug:wait',
                    id: 'mock-step-2',
                  },
                ],
                templateInfo: {
                  entityRef: 'template:default/docs-long-running-template',
                },
              },
            } as SerializedTask),
          );
        }),
        rest.get(`${mockBaseUrl}/v2/tasks/:taskId/events`, (_req, res, ctx) => {
          return res(
            ctx.json([
              {
                createdAt: '2023-10-16T08:21:32.062Z',
                body: {},
                id: 109,
                taskId,
                type: 'log',
              },
              {
                body: { stepId: 'fetch' },
                createdAt: '2023-10-16T08:21:32.062Z',
                id: 110,
                taskId,
                type: 'log',
              },
              {
                body: { stepId: 'fetch' },
                createdAt: '2023-10-16T08:21:33.062Z',
                id: 111,
                taskId,
                type: 'log',
              },
              {
                body: { stepId: 'fetch' },
                createdAt: '2023-10-16T08:21:34.062Z',
                id: 112,
                taskId,
                type: 'log',
              },
              {
                body: { stepId: 'mock-step-1' },
                createdAt: '2023-10-16T08:21:37.062Z',
                id: 120,
                taskId,
                type: 'log',
              },
            ] as SerializedTaskEvent[]),
          );
        }),
      );

      const task = await apiClient.getTask(taskId);

      const getStep = (stepId: string) =>
        task.spec.steps.find(
          step => step.id === stepId,
        ) as unknown as ScaffolderStep;

      expect(getStep('fetch').startedAt).toBe('2023-10-16T08:21:32.062Z');
      expect(getStep('fetch').endedAt).toBe('2023-10-16T08:21:34.062Z');
      expect(getStep('mock-step-1').startedAt).toBe('2023-10-16T08:21:37.062Z');
      expect(getStep('mock-step-1').endedAt).toBe('2023-10-16T08:21:37.062Z');
      expect(getStep('mock-step-2').startedAt).toBeUndefined();
      expect(getStep('mock-step-2').endedAt).toBeUndefined();
    });
  });

  describe('listTasks', () => {
    it('should list all tasks', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/v2/tasks`, (req, res, ctx) => {
          const createdBy = req.url.searchParams.get('createdBy');

          if (createdBy) {
            return res(
              ctx.json([
                {
                  createdBy,
                },
              ]),
            );
          }

          return res(
            ctx.json([
              {
                createdBy: null,
              },
              {
                createdBy: null,
              },
            ]),
          );
        }),
      );

      const result = await apiClient.listTasks({ filterByOwnership: 'all' });
      expect(result).toHaveLength(2);
    });
    it('should list task using the current user as owner', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/v2/tasks`, (req, res, ctx) => {
          const createdBy = req.url.searchParams.get('createdBy');

          if (createdBy) {
            return res(
              ctx.json({
                tasks: [
                  {
                    createdBy,
                  },
                ],
              }),
            );
          }

          return res(
            ctx.json({
              tasks: [
                {
                  createdBy: null,
                },
                {
                  createdBy: null,
                },
              ],
            }),
          );
        }),
      );

      identityApi.getBackstageIdentity.mockResolvedValueOnce({
        userEntityRef: 'user:default/foo',
      });

      const result = await apiClient.listTasks({ filterByOwnership: 'owned' });
      expect(identityApi.getBackstageIdentity).toHaveBeenCalled();
      expect(result.tasks).toHaveLength(1);
    });
  });
});
