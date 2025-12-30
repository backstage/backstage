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
import { http, HttpResponse } from 'msw';
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
import { registerMswTestHooks } from '@backstage/test-utils';

function mockRepoEndpoint() {
  return http.get(
    'https://dev.azure.com/acme/project/_apis/git/repositories/:path',
    ({ params }) => {
      const { path } = params;
      if (path === 'success') {
        return HttpResponse.json({
          id: '01',
          name: 'success',
          defaultBranch: 'refs/heads/master',
        });
      }
      if (path === 'not-found') {
        return HttpResponse.json(
          {
            message: 'repository not found',
          },
          { status: 404 },
        );
      }
      return new HttpResponse(null, { status: 200 });
    },
  );
}

function mockRefsEndpoint() {
  return http.get(
    'https://dev.azure.com/acme/project/_apis/git/repositories/:repo/refs',
    ({ request, params }) => {
      const filter = new URL(request.url).searchParams.get('filter');
      const { repo } = params;
      if (repo !== 'success') {
        return HttpResponse.json(
          {
            message: 'repository not found',
          },
          { status: 404 },
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
        return HttpResponse.json(result);
      }
      return HttpResponse.json({ value: [] });
    },
  );
}

function mockPushEndpoint() {
  return http.post(
    'https://dev.azure.com/acme/project/_apis/git/repositories/:repo/pushes',
    ({ params }) => {
      const { repo } = params;
      if (repo === 'success') {
        return HttpResponse.json({
          refUpdates: [
            {
              repositoryId: '01',
              name: 'refs/heads/backstage-integration',
              oldObjectId: '0000000000000000000000000000000000000000',
              newObjectId: '0000000000000000000000000000000000000001',
            },
          ],
        } satisfies { refUpdates: AzureRefUpdate[] });
      }

      if (repo === 'error') {
        return HttpResponse.json(
          {
            message: 'internal error',
          },
          { status: 500 },
        );
      }

      return HttpResponse.json(
        {
          message: 'Unexpected call',
        },
        { status: 500 },
      );
    },
  );
}

function mockPrEndpoint() {
  return http.post(
    'https://dev.azure.com/acme/project/_apis/git/repositories/:repo/pullrequests',
    ({ params }) => {
      const { repo } = params;
      if (repo === 'success') {
        return HttpResponse.json({
          pullRequestId: 'PR01',
          repository: {
            name: 'success',
            webUrl: 'https://example.com',
          },
        } satisfies AzurePrResult);
      }

      return HttpResponse.json(
        {
          message: 'internal error',
        },
        { status: 500 },
      );
    },
  );
}

describe('RepoApiClient', () => {
  const server = setupServer();
  registerMswTestHooks(server);
  const testToken = new Date().toLocaleString('en-US');
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
      await expect(sut.getRepository('success', testToken)).resolves.toEqual({
        id: '01',
        name: 'success',
        defaultBranch: 'refs/heads/master',
      });
    });
    it('should throw when the repository repository does not exist', async () => {
      await expect(sut.getRepository('not-found', testToken)).rejects.toThrow(
        new Error('repository not found'),
      );
    });
  });
  describe('getDefaultBranch', () => {
    it('should return when correct branch', async () => {
      const foundRef = await sut.getDefaultBranch(
        {
          name: 'success',
          defaultBranch: 'refs/heads/main',
          id: '01',
        },
        testToken,
      );
      expect(foundRef).toEqual({
        name: 'refs/heads/main',
        objectId: '0000000000000000000000000000000000000000',
      });
    });

    it('should throw when the repository does not exist', async () => {
      const promise = sut.getDefaultBranch(
        {
          name: 'fail',
          defaultBranch: 'refs/heads/main',
          id: '01',
        },
        testToken,
      );
      await expect(promise).rejects.toThrow(new Error('repository not found'));
    });

    it('should throw when the default branch does not exist', async () => {
      const promise = sut.getDefaultBranch(
        {
          name: 'success',
          defaultBranch: 'refs/heads/missing_branch',
          id: '01',
        },
        testToken,
      );
      await expect(promise).rejects.toThrow(
        new Error(`The requested ref 'heads/missing_branch' was not found`),
      );
    });
  });
  describe('pushNewBranch', () => {
    let options: NewBranchOptions;
    let expectedResult: AzureRefUpdate;

    beforeEach(() => {
      options = {
        repoName: 'name',
        title: 'title',
        sourceBranch: {
          name: 'refs/heads/main',
          objectId: '0000000000000000000000000000000000000000',
        },
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
        sut.pushNewBranch(
          {
            ...options,
            repoName: 'success',
          },
          testToken,
        ),
      ).resolves.toEqual(expectedResult);
    });
    it('should throw when api call fails', async () => {
      await expect(
        sut.pushNewBranch(
          {
            ...options,
            repoName: 'error',
          },
          testToken,
        ),
      ).rejects.toThrow(new Error('internal error'));
    });
  });
  describe('createPullRequest', () => {
    const options: CreatePrOptions = {
      repoName: 'repoName',
      sourceName: 'refs/heads/main',
      targetName: 'refs/heads/backstage-integration',
      title: 'Title',
      description: 'Description',
    };
    it('should create a new Pull request', async () => {
      await expect(
        sut.createPullRequest(
          {
            ...options,
            repoName: 'success',
          },
          testToken,
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
        sut.createPullRequest({ ...options, repoName: 'error' }, testToken),
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
    const testToken = new Date().toLocaleString('en-US');
    const options: AzurePrOptions = {
      tenantUrl: 'https://dev.azure.com/acme',
      repository: 'test',
      project: 'project',
      fileName: 'catalog-info.yaml',
      title: 'Test Title',
      fileContent: 'content',
      branchName: 'backstage-integration',
      description: 'Test Description',
      token: testToken,
    };
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
    expect(clientMock.getRepository).toHaveBeenCalledWith(
      options.repository,
      testToken,
    );
    expect(clientMock.getDefaultBranch).toHaveBeenCalledWith(repo, testToken);
    const expectedBranchOptions: NewBranchOptions = {
      repoName: repo.name,
      sourceBranch: defaultBranch,
      branchName: options.branchName,
      fileContent: options.fileContent,
      fileName: options.fileName,
      title: options.title,
    };
    expect(clientMock.pushNewBranch).toHaveBeenCalledWith(
      expectedBranchOptions,
      testToken,
    );

    const expectedPrOptions: CreatePrOptions = {
      repoName: repo.name,
      description: options.description,
      title: options.title,
      sourceName: options.branchName,
      targetName: defaultBranch.name,
    };
    expect(clientMock.createPullRequest).toHaveBeenCalledWith(
      expectedPrOptions,
      testToken,
    );
  });
});
