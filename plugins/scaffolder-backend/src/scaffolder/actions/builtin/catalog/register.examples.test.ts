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

import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createCatalogRegisterAction } from './register';
import { Entity } from '@backstage/catalog-model';
import { examples } from './register.examples';
import yaml from 'yaml';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

describe('catalog:register', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );

  const catalogClient = catalogServiceMock.mock();

  const action = createCatalogRegisterAction({
    integrations,
    catalogClient,
    auth: mockServices.auth(),
  });

  const credentials = mockCredentials.user();

  const token = mockCredentials.service.token({
    onBehalfOf: credentials,
    targetPluginId: 'catalog',
  });

  const mockContext = createMockActionContext();
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should register location in catalog', async () => {
    catalogClient.addLocation
      .mockResolvedValueOnce({
        location: null as any,
        entities: [],
      })
      .mockResolvedValueOnce({
        location: null as any,
        entities: [
          {
            metadata: {
              namespace: 'default',
              name: 'test',
            },
            kind: 'Component',
          } as Entity,
        ],
      });
    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });

    expect(catalogClient.addLocation).toHaveBeenNthCalledWith(
      1,
      {
        type: 'url',
        target:
          'http://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      },
      { token },
    );
    expect(catalogClient.addLocation).toHaveBeenNthCalledWith(
      2,
      {
        dryRun: true,
        type: 'url',
        target:
          'http://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      },
      { token },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'entityRef',
      'component:default/test',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'catalogInfoUrl',
      'http://github.com/backstage/backstage/blob/master/catalog-info.yaml',
    );
  });
});
