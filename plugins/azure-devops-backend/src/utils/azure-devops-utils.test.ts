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

import {
  DashboardPullRequest,
  PullRequestStatus,
  PullRequestVoteStatus,
} from '@backstage/plugin-azure-devops-common';
import {
  convertDashboardPullRequest,
  extractAssets,
  extractPartsFromAsset,
  getArtifactId,
  getAvatarUrl,
  getPullRequestLink,
  replaceReadme,
  buildEncodedUrl,
  parseAzureDevOpsUrl,
} from './azure-devops-utils';
import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces';
import { UrlReader } from '@backstage/backend-common';

describe('convertDashboardPullRequest', () => {
  it('should return DashboardPullRequest', () => {
    const baseUrl = 'https://dev.azure.com';

    const pullRequest: GitPullRequest = {
      pullRequestId: 1,
      title: 'Pull Request 1',
      description: 'Test description',
      repository: {
        id: 'repo1',
        name: 'azure-devops',
        url: 'https://dev.azure.com/backstage/backstage/_apis/git/repositories/azure-devops',
        project: {
          name: 'backstage',
        },
      },
      createdBy: {
        id: 'user1',
        displayName: 'User 1',
        uniqueName: 'user1@backstage.io',
        _links: {
          avatar: {
            href: 'avatar-href',
          },
        },
        imageUrl: 'avatar-url',
      },
      reviewers: [
        {
          id: 'user2',
          displayName: 'User 2',
          _links: {
            avatar: {
              href: 'avatar-href',
            },
          },
          isRequired: true,
          isContainer: false,
          vote: 10,
        },
      ],
      creationDate: new Date('2021-10-15T09:30:00.0000000Z'),
      status: PullRequestStatus.Active,
      isDraft: false,
      completionOptions: {},
    };

    const expectedPullRequest: DashboardPullRequest = {
      pullRequestId: 1,
      title: 'Pull Request 1',
      description: 'Test description',
      repository: {
        id: 'repo1',
        name: 'azure-devops',
        url: 'https://dev.azure.com/backstage/backstage/_git/azure-devops',
      },
      createdBy: {
        id: 'user1',
        displayName: 'User 1',
        uniqueName: 'user1@backstage.io',
        imageUrl: 'avatar-href',
      },
      hasAutoComplete: true,
      policies: [],
      reviewers: [
        {
          id: 'user2',
          displayName: 'User 2',
          imageUrl: 'avatar-href',
          isRequired: true,
          isContainer: false,
          voteStatus: PullRequestVoteStatus.Approved,
        },
      ],
      creationDate: '2021-10-15T09:30:00.000Z',
      status: PullRequestStatus.Active,
      isDraft: false,
      link: 'https://dev.azure.com/backstage/_git/azure-devops/pullrequest/1',
    };

    const result = convertDashboardPullRequest(pullRequest, baseUrl, []);
    expect(result).toEqual(expectedPullRequest);
  });
});

describe('getPullRequestLink', () => {
  it('should return pull request link', () => {
    const baseUrl = 'dev.azure.com';
    const pullRequest = {
      pullRequestId: 1,
      repository: {
        name: 'azure-devops',
        project: {
          name: 'backstage',
        },
      },
    };
    const result = getPullRequestLink(baseUrl, pullRequest);
    expect(result).toBe(`${baseUrl}/backstage/_git/azure-devops/pullrequest/1`);
  });
});

describe('getAvatarUrl', () => {
  it('should return avatar href', () => {
    const identity = {
      _links: {
        avatar: {
          href: 'avatar-href',
        },
      },
      imageUrl: 'avatar-url',
    };
    const result = getAvatarUrl(identity);
    expect(result).toBe('avatar-href');
  });

  it('should return avatar image url', () => {
    const identity = {
      imageUrl: 'avatar-url',
    };
    const result = getAvatarUrl(identity);
    expect(result).toBe('avatar-url');
  });
});

describe('getArtifactId', () => {
  it('should return artifact id', () => {
    const result = getArtifactId('project1', 1);
    expect(result).toBe('vstfs:///CodeReview/CodeReviewId/project1/1');
  });
});

describe('extractAssets', () => {
  it('should return assets', () => {
    const readme = `  
    ## Images
    ![Image 1](./images/sample-4(2).PNG)
    ![Image 2](./images/cdCSj+-012340.jpg)             
    ![Image 3](/images/test-4(2)))).jpeg)       
    ![Image 4](./images/test-2211jd.webp)    
    ![Image 5](/images/sa)mple.GIf)
  `;
    const result = extractAssets(readme);
    expect(result).toEqual([
      '[Image 1](./images/sample-4(2).PNG)',
      '[Image 2](./images/cdCSj+-012340.jpg)',
      '[Image 3](/images/test-4(2)))).jpeg)',
      '[Image 4](./images/test-2211jd.webp)',
      '[Image 5](/images/sa)mple.GIf)',
    ]);
  });
});

describe('extractPartsFromAsset', () => {
  it('should return parts from asset - PNG', () => {
    const result = extractPartsFromAsset('[Image 1](./images/sample-4(2).PNG)');
    expect(result).toEqual({
      label: 'Image 1',
      path: '/images/sample-4(2)',
      ext: '.PNG',
    });
  });

  it('should return parts from asset - JPG', () => {
    const result = extractPartsFromAsset(
      '[Image 2](./images/cdCSj+-012340.jpg)',
    );
    expect(result).toEqual({
      label: 'Image 2',
      path: '/images/cdCSj+-012340',
      ext: '.jpg',
    });
  });

  it('should return parts from asset - JPEG', () => {
    const result = extractPartsFromAsset(
      '[Image 2](/images/test-4(2)))).JpEg)',
    );
    expect(result).toEqual({
      label: 'Image 2',
      path: '/images/test-4(2))))',
      ext: '.JpEg',
    });
  });

  it('should return parts from asset - WEBP', () => {
    const result = extractPartsFromAsset('[Image 2](/images/test-2211jd.webp)');
    expect(result).toEqual({
      label: 'Image 2',
      path: '/images/test-2211jd',
      ext: '.webp',
    });
  });

  it('should return parts from asset - GIF', () => {
    const result = extractPartsFromAsset('[Image 2](/images/test-4(2)))).gif)');
    expect(result).toEqual({
      label: 'Image 2',
      path: '/images/test-4(2))))',
      ext: '.gif',
    });
  });

  it('should return parts from asset with leading . without /', () => {
    const result = extractPartsFromAsset('[Image 1](.images/sample-1.PNG)');
    expect(result).toEqual({
      label: 'Image 1',
      path: '.images/sample-1',
      ext: '.PNG',
    });
  });
});

describe('replaceReadme', () => {
  it('should return mime type', async () => {
    const readme = `  
      ## Images
        ![Image 1](./images/sample-4(2).png)
        ![Image 2](./images/cdCSj+-012340.jpg)
        ![Image 3](/images/test-4(2)))).jpeg)
        ![Image 4](./images/test-2211jd.webp)
        ![Image 5](/images/sa)mple.gif)
    `;

    const reader: UrlReader = {
      readUrl: url =>
        Promise.resolve({
          buffer: async () => Buffer.from(url),
          etag: 'buffer',
          stream: jest.fn(),
        }),
      readTree: jest.fn(),
      search: jest.fn(),
    };

    const result = await replaceReadme(
      reader,
      'host',
      'org',
      'project',
      'repo',
      readme,
    );

    const expected = `  
      ## Images
        ![Image 1](data:image/png;base64,aHR0cHM6Ly9ob3N0L29yZy9wcm9qZWN0L19naXQvcmVwbz9wYXRoPSUyRmltYWdlcyUyRnNhbXBsZS00KDIpLnBuZw==)
        ![Image 2](data:image/jpeg;base64,aHR0cHM6Ly9ob3N0L29yZy9wcm9qZWN0L19naXQvcmVwbz9wYXRoPSUyRmltYWdlcyUyRmNkQ1NqJTJCLTAxMjM0MC5qcGc=)
        ![Image 3](data:image/jpeg;base64,aHR0cHM6Ly9ob3N0L29yZy9wcm9qZWN0L19naXQvcmVwbz9wYXRoPSUyRmltYWdlcyUyRnRlc3QtNCgyKSkpKS5qcGVn)
        ![Image 4](data:image/webp;base64,aHR0cHM6Ly9ob3N0L29yZy9wcm9qZWN0L19naXQvcmVwbz9wYXRoPSUyRmltYWdlcyUyRnRlc3QtMjIxMWpkLndlYnA=)
        ![Image 5](data:image/gif;base64,aHR0cHM6Ly9ob3N0L29yZy9wcm9qZWN0L19naXQvcmVwbz9wYXRoPSUyRmltYWdlcyUyRnNhKW1wbGUuZ2lm)
    `;

    expect(expected).toBe(result);
  });
});

describe('buildEncodedUrl', () => {
  it('should not encode the colon between host and port', async () => {
    const result = await buildEncodedUrl(
      'tfs.myorg.com:8443',
      'org',
      'project',
      'repo',
      'path',
    );

    expect(result).toBe(
      'https://tfs.myorg.com:8443/org/project/_git/repo?path=path',
    );
  });
});

describe('parseAzureDevOpsUrl', () => {
  it('parses Azure DevOps Cloud url', async () => {
    const result = parseAzureDevOpsUrl(
      'https://dev.azure.com/organization/project/_git/repository?path=%2Fcatalog-info.yaml',
    );

    expect(result.host).toEqual('dev.azure.com');
    expect(result.org).toEqual('organization');
    expect(result.project).toEqual('project');
    expect(result.repo).toEqual('repository');
  });

  it('parses Azure DevOps Server url', async () => {
    const result = parseAzureDevOpsUrl(
      'https://server.com/organization/project/_git/repository?path=%2Fcatalog-info.yaml',
    );

    expect(result.host).toEqual('server.com');
    expect(result.org).toEqual('organization');
    expect(result.project).toEqual('project');
    expect(result.repo).toEqual('repository');
  });

  it('parses TFS subpath Url', async () => {
    const result = parseAzureDevOpsUrl(
      'https://server.com/tfs/organization/project/_git/repository?path=%2Fcatalog-info.yaml',
    );

    expect(result.host).toEqual('server.com/tfs');
    expect(result.org).toEqual('organization');
    expect(result.project).toEqual('project');
    expect(result.repo).toEqual('repository');
  });
});
