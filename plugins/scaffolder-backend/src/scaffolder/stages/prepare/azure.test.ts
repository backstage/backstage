/*
 * Copyright 2020 Spotify AB
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

jest.doMock('fs-extra', () => ({
  promises: {
    mkdtemp: jest.fn(dir => `${dir}-static`),
  },
}));

import { AzurePreparer } from './azure';
import {
  TemplateEntityV1alpha1,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import { getVoidLogger, Git } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';

describe('AzurePreparer', () => {
  const mockGitClient = {
    clone: jest.fn(),
  };

  const logger = getVoidLogger();

  jest.spyOn(Git, 'fromAuth').mockReturnValue(mockGitClient as any);

  let mockEntity: TemplateEntityV1alpha1;
  beforeEach(() => {
    jest.clearAllMocks();
    mockEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Template',
      metadata: {
        annotations: {
          [LOCATION_ANNOTATION]:
            'azure/api:https://dev.azure.com/backstage-org/backstage-project/_git/template-repo?path=%2Ftemplate.yaml',
        },
        name: 'graphql-starter',
        title: 'GraphQL Service',
        description:
          'A GraphQL starter template for backstage to get you up and running\nthe best pracices with GraphQL\n',
        uid: '9cf16bad-16e0-4213-b314-c4eec773c50b',
        etag: 'ZTkxMjUxMjUtYWY3Yi00MjU2LWFkYWMtZTZjNjU5ZjJhOWM2',
        generation: 1,
      },
      spec: {
        type: 'website',
        templater: 'cookiecutter',
        path: './template',
        schema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          required: ['storePath', 'owner'],
          properties: {
            owner: {
              type: 'string',
              title: 'Owner',
              description: 'Who is going to own this component',
            },
            storePath: {
              type: 'string',
              title: 'Store path',
              description: 'GitHub store path in org/repo format',
            },
          },
        },
      },
    };
  });

  // TODO(blam): Here's a test that will fail when the deprecation is complete
  it('calls the clone command with deprecated token', async () => {
    const preparer = new AzurePreparer(
      new ConfigReader({
        scaffolder: {
          azure: {
            api: {
              token: 'fake-azure-token',
            },
          },
        },
      }),
      { logger },
    );

    await preparer.prepare(mockEntity);

    expect(Git.fromAuth).toHaveBeenCalledWith({
      logger,
      password: 'fake-azure-token',
      username: 'notempty',
    });
  });

  it('calls the clone command with token from integrations config', async () => {
    const preparer = new AzurePreparer(
      new ConfigReader({
        integrations: {
          azure: [
            { host: 'dev.azure.com', token: 'fake-azure-token-integration' },
          ],
        },
      }),
      { logger },
    );

    await preparer.prepare(mockEntity);

    expect(Git.fromAuth).toHaveBeenCalledWith({
      logger,
      password: 'fake-azure-token-integration',
      username: 'notempty',
    });
  });

  it('calls the clone command with the correct arguments for a repository', async () => {
    const preparer = new AzurePreparer(new ConfigReader({}), { logger });

    await preparer.prepare(mockEntity);

    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url:
        'https://dev.azure.com/backstage-org/backstage-project/_git/template-repo',
      dir: expect.any(String),
    });
  });

  it('calls the clone command with the correct arguments for a repository when no path is provided', async () => {
    const preparer = new AzurePreparer(new ConfigReader({}), { logger });
    delete mockEntity.spec.path;

    await preparer.prepare(mockEntity);

    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url:
        'https://dev.azure.com/backstage-org/backstage-project/_git/template-repo',
      dir: expect.any(String),
    });
  });

  it('return the temp directory with the path to the folder if it is specified', async () => {
    const preparer = new AzurePreparer(new ConfigReader({}), { logger });
    mockEntity.spec.path = './template/test/1/2/3';

    const response = await preparer.prepare(mockEntity);

    expect(response.split('\\').join('/')).toMatch(
      /\/template\/test\/1\/2\/3$/,
    );
  });

  it('return the working directory with the path to the folder if it is specified', async () => {
    const preparer = new AzurePreparer(new ConfigReader({}), { logger });
    mockEntity.spec.path = './template/test/1/2/3';

    const response = await preparer.prepare(mockEntity, {
      workingDirectory: '/workDir',
    });

    expect(response.split('\\').join('/')).toMatch(
      /\/workDir\/graphql-starter-static\/template\/test\/1\/2\/3$/,
    );
  });
});
