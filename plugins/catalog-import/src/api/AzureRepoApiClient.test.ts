/*
 * Copyright 2024 The Backstage Authors
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
import { rest } from 'msw';
import {
  AzurePrOptions,
  AzurePrResult,
  AzureRef,
  AzureRefUpdate,
  AzureRepo,
  createAzurePullRequest,
  CreatePrOptions,
  NewBranchOptions,
  RepoApiClient,
} from './AzureRepoApiClient';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/test-utils';

function mockRepoEndpoint() {
  return rest.get(
    'https://dev.azure.com/acme/project/_apis/git/repositories/:path',
    (req, res, ctx) => {
      const { path } = req.params;
      if (path === 'success') {
        return res(
          ctx.json({
            id: '01',
            name: 'success',
            defaultBranch: 'refs/heads/master',
          }),
        );
      }
      if (path === 'not-found') {
        return res(
          ctx.status(404),
          ctx.json({
            message: 'repository not found',
          }),
        );
      }
      return res(ctx.status(200));
    },
  );
}

function mockRefsEndpoint() {
  return rest.get(
    'https://dev.azure.com/acme/project/_apis/git/repositories/:repo/refs',
    (req, res, ctx) => {
      const filter = req.url.searchParams.get('filter');
      const { repo } = req.params;
      if (repo !== 'success') {
        return res(
          ctx.status(404),
          ctx.json({
            message: 'repository not found',
          }),
        );
      }
      if (filter === 'heads/main') {
        const result = {
          value: [
            {
              name: 'refs/heads/main',
              objectId: '0000000000000000000000000000000000000000',
            },
          ],
        };
        return res(ctx.json(result));
      }
      return res(ctx.json({ value: [] }));
    },
  );
}

function mockPushEndpoint() {
  return rest.post(
    'https://dev.azure.com/acme/project/_apis/git/repositories/:repo/pushes',
    (req, res, ctx) => {
      const { repo } = req.params;
      if (repo === 'success') {
        return res(
          ctx.json({
            refUpdates: [
              {
                repositoryId: '01',
                name: 'refs/heads/backstage-integration',
                oldObjectId: '0000000000000000000000000000000000000000',
                newObjectId: '0000000000000000000000000000000000000001',
              },
            ],
          } satisfies { refUpdates: AzureRefUpdate[] }),
        );
      }

      if (repo === 'error') {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'internal error',
          }),
        );
      }

      return res(
        ctx.status(500),
        ctx.json({
          message: 'Unexpected call',
        }),
      );
    },
  );
}

function mockPrEndpoint() {
  return rest.post(
    'https://dev.azure.com/acme/project/_apis/git/repositories/:repo/pullrequests',
    (req, res, ctx) => {
      const { repo } = req.params;
      if (repo === 'success') {
        return res(
          ctx.json({
            pullRequestId: 'PR01',
            repository: {
              name: 'success',
              webUrl: 'https://example.com',
            },
          } satisfies AzurePrResult),
        );
      }

      return res(
        ctx.status(500),
        ctx.json({
          message: 'internal error',
        }),
      );
    },
  );
}

describe('RepoApiClient', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);
  const sut = new RepoApiClient({
    project: 'project',
    tenantUrl: 'https://dev.azure.com/acme',
  } as any);
  beforeEach(() => {
    server.use(
      mockPrEndpoint(),
      mockRefsEndpoint(),
      mockPushEndpoint(),
      mockRepoEndpoint(),
    );
  });
  describe('getRepository', () => {
    it('should get an existing repository', async () => {
      await expect(sut.getRepository('success')).resolves.toEqual({
        id: '01',
        name: 'success',
        defaultBranch: 'refs/heads/master',
      });
    });
    it('should throw when the repository repository does not exist', async () => {
      await expect(sut.getRepository('not-found')).rejects.toThrow(
        new Error('repository not found'),
      );
    });
  });
  describe('getDefaultBranch', () => {
    it('should return when correct branch', async () => {
      const foundRef = await sut.getDefaultBranch({
        name: 'success',
        defaultBranch: 'refs/heads/main',
        id: '01',
      });
      expect(foundRef).toEqual({
        name: 'refs/heads/main',
        objectId: '0000000000000000000000000000000000000000',
      });
    });

    it('should throw when the repository does not exist', async () => {
      const promise = sut.getDefaultBranch({
        name: 'fail',
        defaultBranch: 'refs/heads/main',
        id: '01',
      });
      await expect(promise).rejects.toThrow(new Error('repository not found'));
    });

    it('should throw when the default branch does not exist', async () => {
      const promise = sut.getDefaultBranch({
        name: 'success',
        defaultBranch: 'refs/heads/missing_branch',
        id: '01',
      });
      await expect(promise).rejects.toThrow(
        new Error(`The requested ref 'heads/missing_branch' was not found`),
      );
    });
  });
  describe('pushNewBranch', () => {
    let sourceBranch: AzureRef;
    let options: NewBranchOptions;
    let expectedResult: AzureRefUpdate;

    beforeEach(() => {
      sourceBranch = {
        name: 'refs/heads/main',
        objectId: '0000000000000000000000000000000000000000',
      };
      options = {
        title: 'title',
        branchName: 'backstage-integration',
        fileName: 'catalog-info.yaml',
        fileContent: 'This is a test',
      };
      expectedResult = {
        repositoryId: '01',
        name: 'refs/heads/backstage-integration',
        oldObjectId: '0000000000000000000000000000000000000000',
        newObjectId: '0000000000000000000000000000000000000001',
      };
    });
    it('should create a new branch', async () => {
      await expect(
        sut.pushNewBranch('success', sourceBranch, options),
      ).resolves.toEqual(expectedResult);
    });
    it('should throw when api call fails', async () => {
      await expect(
        sut.pushNewBranch('error', sourceBranch, options),
      ).rejects.toThrow(new Error('internal error'));
    });
  });
  describe('createPullRequest', () => {
    const sourceBranchName = 'refs/heads/main';
    const targetBranchName = 'refs/heads/backstage-integration';
    const options: CreatePrOptions = {
      title: 'Title',
      description: 'Description',
    };
    it('should create a new Pull request', async () => {
      await expect(
        sut.createPullRequest(
          'success',
          sourceBranchName,
          targetBranchName,
          options,
        ),
      ).resolves.toEqual({
        pullRequestId: 'PR01',
        repository: {
          name: 'success',
          webUrl: 'https://example.com',
        },
      } satisfies AzurePrResult);
    });
    it('should throw when api call fails', async () => {
      await expect(
        sut.createPullRequest(
          'error',
          sourceBranchName,
          targetBranchName,
          options,
        ),
      ).rejects.toThrow(new Error('internal error'));
    });
  });
});
describe('createAzurePullRequest', () => {
  let client: RepoApiClient;
  let clientMock: Record<keyof RepoApiClient, jest.Mock>;

  beforeEach(() => {
    clientMock = {
      createPullRequest: jest.fn(),
      pushNewBranch: jest.fn(),
      getRepository: jest.fn(),
      getDefaultBranch: jest.fn(),
    };
    client = clientMock as any as RepoApiClient;
  });

  it('should create a new Pull request', async () => {
    const options: AzurePrOptions = {
      tenantUrl: 'https://dev.azure.com/acme',
      repository: 'test',
      project: 'project',
      fileName: 'catalog-info.yaml',
      title: 'Test Title',
      fileContent: 'content',
      branchName: 'backstage-integration',
      description: 'Test Description',
    } as any;
    const repo: AzureRepo = {
      name: options.repository,
      defaultBranch: 'ref/heads/main',
      id: '01',
    };
    const defaultBranch: AzureRef = {
      name: 'ref/heads/main',
      objectId: '000000000000000000000000000000000000000',
    };
    const expectedResult: AzurePrResult = {
      pullRequestId: 'PR01',
      repository: {
        name: options.repository,
        webUrl: 'https://dev.azure.com/acme/project',
      },
    };

    clientMock.getRepository.mockResolvedValue(repo);
    clientMock.getDefaultBranch.mockResolvedValue(defaultBranch);
    clientMock.pushNewBranch.mockResolvedValue({
      name: options.branchName,
      oldObjectId: '000000000000000000000000000000000000000',
      newObjectId: '000000000000000000000000000000000000001',
      repositoryId: '01',
    } satisfies AzureRefUpdate);
    clientMock.createPullRequest.mockResolvedValue(expectedResult);

    await expect(createAzurePullRequest(options, client)).resolves.toEqual(
      expectedResult,
    );
    expect(clientMock.getRepository).toHaveBeenCalledWith(options.repository);
    expect(clientMock.getDefaultBranch).toHaveBeenCalledWith(repo);
    expect(clientMock.pushNewBranch).toHaveBeenCalledWith(
      repo.name,
      defaultBranch,
      options,
    );
    expect(clientMock.createPullRequest).toHaveBeenCalledWith(
      repo.name,
      options.branchName,
      defaultBranch.name,
      options,
    );
  });
});
