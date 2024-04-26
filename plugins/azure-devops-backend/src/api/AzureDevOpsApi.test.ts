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

jest.mock('azure-devops-node-api', () => ({
  WebApi: jest.fn(),
  getHandlerFromToken: jest.fn().mockReturnValue(() => {}),
}));

import { UrlReader, getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { AzureDevOpsApi } from './AzureDevOpsApi';
import { WebApi } from 'azure-devops-node-api';
import { TeamProjectReference } from 'azure-devops-node-api/interfaces/CoreInterfaces';
import { GitRepository } from 'azure-devops-node-api/interfaces/TfvcInterfaces';
import {
  Build,
  BuildResult,
  BuildStatus,
} from 'azure-devops-node-api/interfaces/BuildInterfaces';
import {
  GitPullRequest,
  GitRef,
  PullRequestStatus,
} from 'azure-devops-node-api/interfaces/GitInterfaces';
import { PullRequestOptions } from '@backstage/plugin-azure-devops-common';

describe('AzureDevOpsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockConfig = new ConfigReader({
    azureDevOps: {
      host: 'dev.azure.com',
      token: 'token',
      organization: 'org',
    },
    integrations: {
      azure: [
        {
          host: 'dev.azure.com',
          credentials: [
            {
              personalAccessToken: 'pat',
            },
          ],
        },
      ],
    },
  });

  const mockLogger = getVoidLogger();

  const mockUrlReader: UrlReader = {
    readUrl: url =>
      Promise.resolve({
        buffer: async () => Buffer.from(url),
        etag: 'buffer',
        stream: jest.fn(),
      }),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  it('should get projects', async () => {
    const mockProjects: TeamProjectReference[] = [
      {
        id: 'one',
        name: 'one',
        description: 'one',
      },
      {
        id: 'two',
        name: 'two',
        description: 'two',
      },
      {
        id: 'three',
        name: 'three',
        description: 'three',
      },
    ];

    const mockCoreApiClient = {
      getProjects: jest.fn().mockResolvedValue(mockProjects),
    };

    const mockCoreApi = {
      getCoreApi: jest.fn().mockResolvedValue(mockCoreApiClient),
    };

    (WebApi as unknown as jest.Mock).mockImplementation(() => mockCoreApi);

    const api = AzureDevOpsApi.fromConfig(mockConfig, {
      logger: mockLogger,
      urlReader: mockUrlReader,
    });

    const result = await api.getProjects();

    expect(result).toEqual([
      {
        id: 'one',
        name: 'one',
        description: 'one',
      },
      {
        id: 'three',
        name: 'three',
        description: 'three',
      },
      {
        id: 'two',
        name: 'two',
        description: 'two',
      },
    ]);
  });

  it('should get git repository', async () => {
    const mockGitRepository: GitRepository = {
      id: 'repo',
    };

    const mockGitClient = {
      getRepository: jest.fn().mockResolvedValue(mockGitRepository),
    };
    const mockGitApi = {
      getGitApi: jest.fn().mockReturnValue(mockGitClient),
    };

    (WebApi as unknown as jest.Mock).mockImplementation(() => mockGitApi);

    const api = AzureDevOpsApi.fromConfig(mockConfig, {
      logger: mockLogger,
      urlReader: mockUrlReader,
    });

    const result = await api.getGitRepository('project', 'repo');

    expect(result).toEqual({ id: 'repo' });
  });

  it('should get build list', async () => {
    const mockBuilds: Build[] = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ];

    const mockBuildClient = {
      getBuilds: jest.fn().mockResolvedValue(mockBuilds),
    };
    const mockBuildApi = {
      getBuildApi: jest.fn().mockReturnValue(mockBuildClient),
    };

    (WebApi as unknown as jest.Mock).mockImplementation(() => mockBuildApi);

    const api = AzureDevOpsApi.fromConfig(mockConfig, {
      logger: mockLogger,
      urlReader: mockUrlReader,
    });

    const result = await api.getBuildList('project', 'repo', 10);

    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('should get repo builds', async () => {
    const mockGitRepository: GitRepository = {
      id: 'repo',
    };

    const mockBuilds: Build[] = [
      {
        id: 1,
        buildNumber: 'Build-1',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.932Z'),
        startTime: new Date('2020-09-12T06:15:23.932Z'),
        finishTime: new Date('2020-09-12T06:20:23.932Z'),
        sourceBranch: 'main',
        sourceVersion: 'abcd',
      },
      {
        id: 2,
        buildNumber: 'Build-2',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.932Z'),
        startTime: new Date('2020-09-12T06:15:23.932Z'),
        finishTime: new Date('2020-09-12T06:20:23.932Z'),
        sourceBranch: 'main',
        sourceVersion: 'abcd',
      },
      {
        id: 3,
        buildNumber: 'Build-3',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.932Z'),
        startTime: new Date('2020-09-12T06:15:23.932Z'),
        finishTime: new Date('2020-09-12T06:20:23.932Z'),
        sourceBranch: 'main',
        sourceVersion: 'abcd',
      },
    ];

    const mockBuildClient = {
      getBuilds: jest.fn().mockResolvedValue(mockBuilds),
    };
    const mockGitClient = {
      getRepository: jest.fn().mockResolvedValue(mockGitRepository),
    };
    const mockApi = {
      getGitApi: jest.fn().mockReturnValue(mockGitClient),
      getBuildApi: jest.fn().mockReturnValue(mockBuildClient),
    };

    (WebApi as unknown as jest.Mock).mockImplementation(() => mockApi);

    const api = AzureDevOpsApi.fromConfig(mockConfig, {
      logger: mockLogger,
      urlReader: mockUrlReader,
    });

    const result = await api.getRepoBuilds('project', 'repo', 10);

    expect(result).toEqual([
      {
        id: 1,
        title: 'Build-1',
        link: '',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: '2020-09-12T06:10:23.932Z',
        startTime: '2020-09-12T06:15:23.932Z',
        finishTime: '2020-09-12T06:20:23.932Z',
        source: 'main (abcd)',
        uniqueName: 'N/A',
      },
      {
        id: 2,
        title: 'Build-2',
        link: '',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: '2020-09-12T06:10:23.932Z',
        startTime: '2020-09-12T06:15:23.932Z',
        finishTime: '2020-09-12T06:20:23.932Z',
        source: 'main (abcd)',
        uniqueName: 'N/A',
      },
      {
        id: 3,
        title: 'Build-3',
        link: '',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: '2020-09-12T06:10:23.932Z',
        startTime: '2020-09-12T06:15:23.932Z',
        finishTime: '2020-09-12T06:20:23.932Z',
        source: 'main (abcd)',
        uniqueName: 'N/A',
      },
    ]);
  });

  it('should get git tags', async () => {
    const mockGitRepository: GitRepository = {
      id: 'repo',
    };

    const mockGitRefs: GitRef[] = [
      {
        objectId: '1.0',
        peeledObjectId: '1.0',
        name: 'v1.0',
      },
      {
        objectId: '2.0',
        peeledObjectId: '2.0',
        name: 'v2.0',
      },
      {
        objectId: '3.0',
        peeledObjectId: '3.0',
        name: 'v3.0',
      },
    ];

    const mockGitClient = {
      getRepository: jest.fn().mockResolvedValue(mockGitRepository),
      getRefs: jest.fn().mockResolvedValue(mockGitRefs),
    };
    const mockApi = {
      getGitApi: jest.fn().mockReturnValue(mockGitClient),
      serverUrl: 'serverUrl',
    };

    (WebApi as unknown as jest.Mock).mockImplementation(() => mockApi);

    const api = AzureDevOpsApi.fromConfig(mockConfig, {
      logger: mockLogger,
      urlReader: mockUrlReader,
    });

    const result = await api.getGitTags('project', 'repo');

    expect(result).toEqual([
      {
        objectId: '1.0',
        peeledObjectId: '1.0',
        name: 'v1.0',
        commitLink: 'serverUrl/project/_git/repo/commit/1.0',
        createdBy: 'N/A',
        link: 'serverUrl/project/_git/repo?version=GTv1.0',
      },
      {
        objectId: '2.0',
        peeledObjectId: '2.0',
        name: 'v2.0',
        commitLink: 'serverUrl/project/_git/repo/commit/2.0',
        createdBy: 'N/A',
        link: 'serverUrl/project/_git/repo?version=GTv2.0',
      },
      {
        objectId: '3.0',
        peeledObjectId: '3.0',
        name: 'v3.0',
        commitLink: 'serverUrl/project/_git/repo/commit/3.0',
        createdBy: 'N/A',
        link: 'serverUrl/project/_git/repo?version=GTv3.0',
      },
    ]);
  });

  it('should get pull requests', async () => {
    const mockGitRepository: GitRepository = {
      id: 'repo',
      name: 'repo',
    };

    const mockGitPullRequests: GitPullRequest[] = [
      {
        pullRequestId: 1,
        repository: mockGitRepository,
        title: 'PR1',
        creationDate: new Date('2020-09-12T06:10:23.932Z'),
        sourceRefName: 'refs/heads/topic/pr1',
        targetRefName: 'refs/heads/main',
        status: PullRequestStatus.Active,
        isDraft: false,
      },
      {
        pullRequestId: 2,
        repository: mockGitRepository,
        title: 'PR2',
        creationDate: new Date('2020-09-12T06:10:23.932Z'),
        sourceRefName: 'refs/heads/topic/pr2',
        targetRefName: 'refs/heads/main',
        status: PullRequestStatus.Active,
        isDraft: false,
      },
      {
        pullRequestId: 3,
        repository: mockGitRepository,
        title: 'PR3',
        creationDate: new Date('2020-09-12T06:10:23.932Z'),
        sourceRefName: 'refs/heads/topic/pr3',
        targetRefName: 'refs/heads/main',
        status: PullRequestStatus.Active,
        isDraft: false,
      },
    ];

    const mockGitClient = {
      getRepository: jest.fn().mockResolvedValue(mockGitRepository),
      getPullRequests: jest.fn().mockResolvedValue(mockGitPullRequests),
    };
    const mockApi = {
      getGitApi: jest.fn().mockReturnValue(mockGitClient),
      serverUrl: 'serverUrl',
    };

    (WebApi as unknown as jest.Mock).mockImplementation(() => mockApi);

    const api = AzureDevOpsApi.fromConfig(mockConfig, {
      logger: mockLogger,
      urlReader: mockUrlReader,
    });

    const pullRequestOptions: PullRequestOptions = {
      top: 10,
      status: PullRequestStatus.Active,
    };

    const result = await api.getPullRequests(
      'project',
      'repo',
      pullRequestOptions,
    );

    expect(result).toEqual([
      {
        pullRequestId: 1,
        repoName: 'repo',
        title: 'PR1',
        uniqueName: 'N/A',
        createdBy: 'N/A',
        creationDate: '2020-09-12T06:10:23.932Z',
        sourceRefName: 'refs/heads/topic/pr1',
        targetRefName: 'refs/heads/main',
        status: PullRequestStatus.Active,
        isDraft: false,
        link: 'serverUrl/project/_git/repo/pullrequest/1',
      },
      {
        pullRequestId: 2,
        repoName: 'repo',
        title: 'PR2',
        uniqueName: 'N/A',
        createdBy: 'N/A',
        creationDate: '2020-09-12T06:10:23.932Z',
        sourceRefName: 'refs/heads/topic/pr2',
        targetRefName: 'refs/heads/main',
        status: PullRequestStatus.Active,
        isDraft: false,
        link: 'serverUrl/project/_git/repo/pullrequest/2',
      },
      {
        pullRequestId: 3,
        repoName: 'repo',
        title: 'PR3',
        uniqueName: 'N/A',
        createdBy: 'N/A',
        creationDate: '2020-09-12T06:10:23.932Z',
        sourceRefName: 'refs/heads/topic/pr3',
        targetRefName: 'refs/heads/main',
        status: PullRequestStatus.Active,
        isDraft: false,
        link: 'serverUrl/project/_git/repo/pullrequest/3',
      },
    ]);
  });

  it('should get build definitions', async () => {
    const mockBuilds: Build[] = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ];

    const mockBuildClient = {
      getDefinitions: jest.fn().mockResolvedValue(mockBuilds),
    };
    const mockBuildApi = {
      getBuildApi: jest.fn().mockReturnValue(mockBuildClient),
    };

    (WebApi as unknown as jest.Mock).mockImplementation(() => mockBuildApi);

    const api = AzureDevOpsApi.fromConfig(mockConfig, {
      logger: mockLogger,
      urlReader: mockUrlReader,
    });

    const result = await api.getBuildDefinitions('project', 'definition');

    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('should get build builds with repoId', async () => {
    const mockBuilds: Build[] = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ];

    const mockBuildClient = {
      getBuilds: jest.fn().mockResolvedValue(mockBuilds),
    };
    const mockBuildApi = {
      getBuildApi: jest.fn().mockReturnValue(mockBuildClient),
    };

    (WebApi as unknown as jest.Mock).mockImplementation(() => mockBuildApi);

    const api = AzureDevOpsApi.fromConfig(mockConfig, {
      logger: mockLogger,
      urlReader: mockUrlReader,
    });

    const result = await api.getBuilds('project', 10, 'repo', undefined);

    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('should get build builds with definitions', async () => {
    const mockBuilds: Build[] = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ];

    const mockBuildClient = {
      getBuilds: jest.fn().mockResolvedValue(mockBuilds),
    };
    const mockBuildApi = {
      getBuildApi: jest.fn().mockReturnValue(mockBuildClient),
    };

    (WebApi as unknown as jest.Mock).mockImplementation(() => mockBuildApi);

    const api = AzureDevOpsApi.fromConfig(mockConfig, {
      logger: mockLogger,
      urlReader: mockUrlReader,
    });

    const result = await api.getBuilds('project', 10, undefined, [1, 2, 3]);

    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('should get build runs with repoName', async () => {
    const mockGitRepository: GitRepository = {
      id: 'repo',
    };

    const mockBuilds: Build[] = [
      {
        id: 1,
        buildNumber: 'Build-1',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.932Z'),
        startTime: new Date('2020-09-12T06:15:23.932Z'),
        finishTime: new Date('2020-09-12T06:20:23.932Z'),
        sourceBranch: 'main',
        sourceVersion: 'abcd',
      },
      {
        id: 2,
        buildNumber: 'Build-2',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.932Z'),
        startTime: new Date('2020-09-12T06:15:23.932Z'),
        finishTime: new Date('2020-09-12T06:20:23.932Z'),
        sourceBranch: 'main',
        sourceVersion: 'abcd',
      },
      {
        id: 3,
        buildNumber: 'Build-3',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.932Z'),
        startTime: new Date('2020-09-12T06:15:23.932Z'),
        finishTime: new Date('2020-09-12T06:20:23.932Z'),
        sourceBranch: 'main',
        sourceVersion: 'abcd',
      },
    ];

    const mockBuildClient = {
      getBuilds: jest.fn().mockResolvedValue(mockBuilds),
    };
    const mockGitClient = {
      getRepository: jest.fn().mockResolvedValue(mockGitRepository),
    };
    const mockApi = {
      getGitApi: jest.fn().mockReturnValue(mockGitClient),
      getBuildApi: jest.fn().mockReturnValue(mockBuildClient),
    };

    (WebApi as unknown as jest.Mock).mockImplementation(() => mockApi);

    const api = AzureDevOpsApi.fromConfig(mockConfig, {
      logger: mockLogger,
      urlReader: mockUrlReader,
    });

    const result = await api.getBuildRuns('project', 10, 'repo', undefined);

    expect(result).toEqual([
      {
        id: 1,
        title: 'Build-1',
        link: '',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: '2020-09-12T06:10:23.932Z',
        startTime: '2020-09-12T06:15:23.932Z',
        finishTime: '2020-09-12T06:20:23.932Z',
        source: 'main (abcd)',
        uniqueName: 'N/A',
      },
      {
        id: 2,
        title: 'Build-2',
        link: '',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: '2020-09-12T06:10:23.932Z',
        startTime: '2020-09-12T06:15:23.932Z',
        finishTime: '2020-09-12T06:20:23.932Z',
        source: 'main (abcd)',
        uniqueName: 'N/A',
      },
      {
        id: 3,
        title: 'Build-3',
        link: '',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: '2020-09-12T06:10:23.932Z',
        startTime: '2020-09-12T06:15:23.932Z',
        finishTime: '2020-09-12T06:20:23.932Z',
        source: 'main (abcd)',
        uniqueName: 'N/A',
      },
    ]);
  });

  it('should get build runs with definitionName', async () => {
    const mockBuilds: Build[] = [
      {
        id: 1,
        buildNumber: 'Build-1',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.932Z'),
        startTime: new Date('2020-09-12T06:15:23.932Z'),
        finishTime: new Date('2020-09-12T06:20:23.932Z'),
        sourceBranch: 'main',
        sourceVersion: 'abcd',
      },
      {
        id: 2,
        buildNumber: 'Build-2',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.932Z'),
        startTime: new Date('2020-09-12T06:15:23.932Z'),
        finishTime: new Date('2020-09-12T06:20:23.932Z'),
        sourceBranch: 'main',
        sourceVersion: 'abcd',
      },
      {
        id: 3,
        buildNumber: 'Build-3',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.932Z'),
        startTime: new Date('2020-09-12T06:15:23.932Z'),
        finishTime: new Date('2020-09-12T06:20:23.932Z'),
        sourceBranch: 'main',
        sourceVersion: 'abcd',
      },
    ];

    const mockBuildClient = {
      getBuilds: jest.fn().mockResolvedValue(mockBuilds),
      getDefinitions: jest.fn().mockResolvedValue(mockBuilds),
    };

    const mockApi = {
      getBuildApi: jest.fn().mockReturnValue(mockBuildClient),
    };

    (WebApi as unknown as jest.Mock).mockImplementation(() => mockApi);

    const api = AzureDevOpsApi.fromConfig(mockConfig, {
      logger: mockLogger,
      urlReader: mockUrlReader,
    });

    const result = await api.getBuildRuns(
      'project',
      10,
      undefined,
      'definition',
    );

    expect(result).toEqual([
      {
        id: 1,
        title: 'Build-1',
        link: '',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: '2020-09-12T06:10:23.932Z',
        startTime: '2020-09-12T06:15:23.932Z',
        finishTime: '2020-09-12T06:20:23.932Z',
        source: 'main (abcd)',
        uniqueName: 'N/A',
      },
      {
        id: 2,
        title: 'Build-2',
        link: '',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: '2020-09-12T06:10:23.932Z',
        startTime: '2020-09-12T06:15:23.932Z',
        finishTime: '2020-09-12T06:20:23.932Z',
        source: 'main (abcd)',
        uniqueName: 'N/A',
      },
      {
        id: 3,
        title: 'Build-3',
        link: '',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: '2020-09-12T06:10:23.932Z',
        startTime: '2020-09-12T06:15:23.932Z',
        finishTime: '2020-09-12T06:20:23.932Z',
        source: 'main (abcd)',
        uniqueName: 'N/A',
      },
    ]);
  });
});
