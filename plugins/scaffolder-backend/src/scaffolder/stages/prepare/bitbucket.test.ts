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

import { BitbucketPreparer } from './bitbucket';
import {
  TemplateEntityV1alpha1,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import { getVoidLogger, Git } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';

describe('BitbucketPreparer', () => {
  let mockEntity: TemplateEntityV1alpha1;
  const mockGitClient = {
    clone: jest.fn(),
  };

  jest.spyOn(Git, 'fromAuth').mockReturnValue(mockGitClient as any);

  beforeEach(() => {
    jest.clearAllMocks();
    mockEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Template',
      metadata: {
        annotations: {
          [LOCATION_ANNOTATION]:
            'bitbucket:https://bitbucket.org/backstage-project/backstage-repo',
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

  it('calls the clone command with the correct arguments for a repository', async () => {
    const preparer = new BitbucketPreparer(new ConfigReader({}));
    await preparer.prepare(mockEntity, { logger: getVoidLogger() });
    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url: 'https://bitbucket.org/backstage-project/backstage-repo',
      dir: expect.any(String),
    });
  });

  it('calls the clone command with the correct arguments if an app password is provided for a repository', async () => {
    const preparer = new BitbucketPreparer(
      new ConfigReader({
        integrations: {
          bitbucket: [
            {
              host: 'bitbucket.org',
              username: 'fake-user',
              appPassword: 'fake-password',
            },
          ],
        },
      }),
    );
    await preparer.prepare(mockEntity, { logger: getVoidLogger() });
    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url: 'https://bitbucket.org/backstage-project/backstage-repo',
      dir: expect.any(String),
    });
  });

  it('calls the clone command with the correct arguments for a repository when no path is provided', async () => {
    const preparer = new BitbucketPreparer(new ConfigReader({}));
    delete mockEntity.spec.path;
    await preparer.prepare(mockEntity, { logger: getVoidLogger() });
    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url: 'https://bitbucket.org/backstage-project/backstage-repo',
      dir: expect.any(String),
    });
  });

  it('return the temp directory with the path to the folder if it is specified', async () => {
    const preparer = new BitbucketPreparer(new ConfigReader({}));
    mockEntity.spec.path = './template/test/1/2/3';
    const response = await preparer.prepare(mockEntity, {
      logger: getVoidLogger(),
    });

    expect(response.split('\\').join('/')).toMatch(
      /\/template\/test\/1\/2\/3$/,
    );
  });

  it('return the working directory with the path to the folder if it is specified', async () => {
    const preparer = new BitbucketPreparer(new ConfigReader({}));
    mockEntity.spec.path = './template/test/1/2/3';
    const response = await preparer.prepare(mockEntity, {
      logger: getVoidLogger(),
      workingDirectory: '/workDir',
    });

    expect(response.split('\\').join('/')).toMatch(
      /\/workDir\/graphql-starter-static\/template\/test\/1\/2\/3$/,
    );
  });
});
