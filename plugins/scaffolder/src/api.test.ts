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
import { ScaffolderClient } from './api';

const MockedEventSource = global.EventSource as jest.MockedClass<
  typeof EventSource
>;

describe('api', () => {
  const mockBaseUrl = 'http://backstage/api';

  const discoveryApi = { getBaseUrl: async () => mockBaseUrl };
  const identityApi = {} as any;
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
      identityApi,
    });
  });

  it('should return default and custom integrations', async () => {
    const allowedHosts = [
      'hello.com',
      'gitlab.com',
      'github.com',
      'dev.azure.com',
      'bitbucket.org',
    ];
    const integrations = await apiClient.getIntegrationsList({ allowedHosts });
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

        const next = jest.fn();

        await new Promise<void>(complete => {
          apiClient
            .streamLogs({ taskId: 'a-random-task-id' })
            .subscribe({ next, complete });
        });

        expect(MockedEventSource).toBeCalledWith(
          'http://backstage/api/v2/tasks/a-random-task-id/eventstream',
          { withCredentials: true },
        );
        expect(MockedEventSource.prototype.close).toBeCalled();

        expect(next).toBeCalledTimes(2);
        expect(next).toBeCalledWith({
          id: 1,
          taskId: 'a-random-id',
          type: 'log',
          createdAt: '',
          body: { message: 'My log message' },
        });
        expect(next).toBeCalledWith({
          id: 2,
          taskId: 'a-random-id',
          type: 'completion',
          createdAt: '',
          body: { message: 'Finished!' },
        });
      });
    });
  });
});
