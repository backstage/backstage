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

import { parseGitlabYamlFilesAction } from './parseGitlabYamlFilesAction';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';

const mockGitlabClient = {
  RepositoryFiles: {
    show: jest.fn(),
  },
};
jest.mock('@gitbeaker/node', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('gitlab:projectVariable:get', () => {
  const config = new ConfigReader({
    integrations: {
      gitlab: [
        {
          host: 'gitlab.com',
          token: 'tokentest',
          apiBaseUrl: 'https://api.gitlab.com',
        },
        {
          host: 'hosted.gitlab.com',
          apiBaseUrl: 'https://api.hosted.gitlab.com',
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = parseGitlabYamlFilesAction({ integrations });
  const mockContext = {
    input: {
      repoUrl: 'gitlab.com?repo=repo&owner=owner',
      projectId: '123',
      filePath: 'path/to/file.yaml',
      propPath: '.clusters[0].name',
      split: '',
    },
    output: jest.fn(),
    workspacePath: 'test',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    createTemporaryDirectory: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should retrieve the variable value from a .yaml file', async () => {
    const fileContent = `
    apiVersion: v1
    clusters:
      - cluster:
          certificate-authority-data: 
          server: https://testoidcnumber.gr.eu-central-x.eks.amazonaws.com
        name: test-dev-abc1d
    contexts:
      - context:
          cluster: test-dev-abc1d
          namespace: test-dev
          user: oidc
        name: test-dev-abc1d
    current-context: test-dev-abc1d
    kind: Config
    `;
    mockGitlabClient.RepositoryFiles.show.mockResolvedValue({
      content: Buffer.from(fileContent),
    });

    await action.handler(mockContext);

    expect(mockGitlabClient.RepositoryFiles.show).toHaveBeenCalledWith(
      '123',
      'path/to/file.yaml',
      'master',
    );
    expect(mockContext.output).toHaveBeenCalledWith('value', 'test-dev-abc1d');
  });

  it('should retrieve the modified variable value from a .yaml file', async () => {
    const fileContent = `
    apiVersion: v1
    clusters:
      - cluster:
          certificate-authority-data: 
          server: https://testoidcnumber.gr.eu-central-x.eks.amazonaws.com
        name: test-dev-abc1d
    contexts:
      - context:
          cluster: test-dev-abc1d
          namespace: test-dev
          user: oidc
        name: test-dev-abc1d
    current-context: test-dev-abc1d
    kind: Config
    `;

    mockContext.input.propPath = '.clusters[0].cluster.server';
    mockContext.input.split = "split('/')[2].split('.')[0]";
    mockGitlabClient.RepositoryFiles.show.mockResolvedValue({
      content: Buffer.from(fileContent),
    });
    await action.handler(mockContext);
    expect(mockGitlabClient.RepositoryFiles.show).toHaveBeenCalledWith(
      '123',
      'path/to/file.yaml',
      'master',
    );
    expect(mockContext.output).toHaveBeenCalledWith('value', 'testoidcnumber');
  });

  it('should retrieve the yaml file in json format', async () => {
    const fileContent = `
    apiVersion: v1
    clusters:
      - cluster:
          certificate-authority-data:
          server: https://testoidcnumber.gr.eu-central-x.eks.amazonaws.com
        name: test-dev-abc1d
    contexts:
      - context:
          cluster: test-dev-abc1d
          namespace: test-dev
          user: oidc
        name: test-dev-abc1d
    current-context: test-dev-abc1d
    kind: Config
    `;
    mockContext.input.propPath = '';
    mockContext.input.split = '';
    mockGitlabClient.RepositoryFiles.show.mockResolvedValue({
      content: Buffer.from(fileContent),
    });
    await action.handler(mockContext);
    expect(mockGitlabClient.RepositoryFiles.show).toHaveBeenCalledWith(
      '123',
      'path/to/file.yaml',
      'master',
    );
    expect(mockContext.output).toHaveBeenCalledWith('value', {
      apiVersion: 'v1',
      clusters: [
        {
          cluster: {
            'certificate-authority-data': null,
            server: 'https://testoidcnumber.gr.eu-central-x.eks.amazonaws.com',
          },
          name: 'test-dev-abc1d',
        },
      ],
      contexts: [
        {
          context: {
            cluster: 'test-dev-abc1d',
            namespace: 'test-dev',
            user: 'oidc',
          },
          name: 'test-dev-abc1d',
        },
      ],
      'current-context': 'test-dev-abc1d',
      kind: 'Config',
    });
  });

  it('should throw an error if the .yaml file is not found', async () => {
    mockGitlabClient.RepositoryFiles.show.mockResolvedValue({
      content: null,
    });

    await expect(action.handler(mockContext)).rejects.toThrow(
      /File not found: path\/to\/file.yaml/,
    );
  });

  it('should throw an error if the key is not found in the .yaml file', async () => {
    const fileContent = `
    apiVersion: v1
    clusters:
      - cluster:
          certificate-authority-data: 
          server: https://testoidcnumber.gr.eu-central-x.eks.amazonaws.com
        name: test-dev-abc1d
    contexts:
      - context:
          cluster: test-dev-abc1d
          namespace: test-dev
          user: oidc
        name: test-dev-abc1d
    current-context: test-dev-abc1d
    kind: Config
    `;
    mockContext.input.propPath = 'none';
    mockGitlabClient.RepositoryFiles.show.mockResolvedValue({
      content: Buffer.from(fileContent),
    });

    await expect(action.handler(mockContext)).rejects.toThrow(
      'Key not found: none',
    );
  });

  it('should throw an error if theres a wrong split functions', async () => {
    const fileContent = `
    apiVersion: v1
    clusters:
      - cluster:
          certificate-authority-data: 
          server: https://testoidcnumber.gr.eu-central-x.eks.amazonaws.com
        name: test-dev-abc1d
    contexts:
      - context:
          cluster: test-dev-abc1d
          namespace: test-dev
          user: oidc
        name: test-dev-abc1d
    current-context: test-dev-abc1d
    kind: Config
    `;
    mockContext.input.propPath = '.clusters[0]';
    mockContext.input.split = "split('wrong).test()";
    mockGitlabClient.RepositoryFiles.show.mockResolvedValue({
      content: Buffer.from(fileContent),
    });

    await expect(action.handler(mockContext)).rejects.toThrow(
      'Invalid manipulation argument. Only correct split functions are allowed',
    );
  });
});
