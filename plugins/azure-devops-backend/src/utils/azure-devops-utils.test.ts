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
  getMimeByExtension,
  getPullRequestLink,
  replaceReadme,
} from './azure-devops-utils';

import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces';

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
    ![Image 1](./images/sample-4(2).png)
    ![Image 2](./images/cdCSj+-012340.jpg)             
    ![Image 3](/images/test-4(2)))).jpeg)       
    ![Image 4](./images/test-2211jd.webp)    
    ![Image 5](/images/sa)mple.gif)
  `;
    const result = extractAssets(readme);
    expect(result).toEqual([
      '[Image 1](./images/sample-4(2).png)',
      '[Image 2](./images/cdCSj+-012340.jpg)',
      '[Image 3](/images/test-4(2)))).jpeg)',
      '[Image 4](./images/test-2211jd.webp)',
      '[Image 5](/images/sa)mple.gif)',
    ]);
  });
});

describe('extractPartsFromAsset', () => {
  it('should return parts from asset - PNG', () => {
    const result = extractPartsFromAsset('[Image 1](./images/sample-4(2).png)');
    expect(result).toEqual({
      label: 'Image 1',
      path: '/images/sample-4(2)',
      ext: '.png',
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
      '[Image 2](/images/test-4(2)))).jpeg)',
    );
    expect(result).toEqual({
      label: 'Image 2',
      path: '/images/test-4(2))))',
      ext: '.jpeg',
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
});

describe('getMimeByExtension', () => {
  it('should return mime type', () => {
    expect(getMimeByExtension('.png')).toBe('image/png');
    expect(getMimeByExtension('.jpg')).toBe('image/jpeg');
    expect(getMimeByExtension('.jpeg')).toBe('image/jpeg');
    expect(getMimeByExtension('.webp')).toBe('image/webp');
    expect(getMimeByExtension('.gif')).toBe('image/gif');
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

    async function mockFileContent(
      path: string,
      encoding?: BufferEncoding,
    ): Promise<{
      url: string;
      content: string;
    }> {
      expect(encoding).toBe('base64');
      return new Promise(resolve =>
        resolve({
          url: '',
          content: Buffer.from(path).toString(encoding),
        }),
      );
    }

    const result = await replaceReadme(readme, mockFileContent);

    const expected = `  
      ## Images
        ![Image 1](data:image/png;base64,L2ltYWdlcy9zYW1wbGUtNCgyKS5wbmc=)
        ![Image 2](data:image/jpeg;base64,L2ltYWdlcy9jZENTaistMDEyMzQwLmpwZw==)
        ![Image 3](data:image/jpeg;base64,L2ltYWdlcy90ZXN0LTQoMikpKSkuanBlZw==)
        ![Image 4](data:image/webp;base64,L2ltYWdlcy90ZXN0LTIyMTFqZC53ZWJw)
        ![Image 5](data:image/gif;base64,L2ltYWdlcy9zYSltcGxlLmdpZg==)
    `;

    expect(expected).toBe(result);
  });
});
