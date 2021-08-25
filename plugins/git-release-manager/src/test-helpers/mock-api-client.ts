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

import { GitReleaseApi } from '../api/GitReleaseClient';
import {
  createMockBranch,
  createMockRecentCommit,
  createMockRelease,
  mockDefaultBranch,
  mockEmail,
  mockOwner,
  mockRepo,
  MOCK_RELEASE_CANDIDATE_TAG_NAME_CALVER,
} from './test-helpers';

export const mockApiClient: GitReleaseApi = {
  getHost: jest.fn(() => 'github.com'),

  getRepoPath: jest.fn(() => `${mockOwner}/${mockRepo}`),

  getOwners: jest.fn(async () => ({
    owners: [mockOwner, `${mockOwner}2`],
  })),

  getRepositories: jest.fn(async () => ({
    repositories: [mockRepo, `${mockRepo}2`],
  })),

  getUser: jest.fn(async () => ({
    user: {
      username: mockOwner,
      email: mockEmail,
    },
  })),

  getRecentCommits: jest.fn(async () => ({
    recentCommits: [
      createMockRecentCommit({ sha: 'mock_sha_recent_commits_1' }),
      createMockRecentCommit({ sha: 'mock_sha_recent_commits_2' }),
    ],
  })),

  getLatestRelease: jest.fn(async () => ({
    latestRelease: createMockRelease(),
  })),

  getRepository: jest.fn(async () => ({
    repository: {
      pushPermissions: true,
      defaultBranch: mockDefaultBranch,
      name: mockRepo,
    },
  })),

  getCommit: jest.fn(async () => ({
    commit: {
      sha: 'latestCommit.sha',
      htmlUrl: 'https://latestCommit.html_url',
      commit: {
        message: 'latestCommit.commit.message',
      },
      createdAt: '2021-01-01T10:11:12Z',
    },
  })),

  getBranch: jest.fn(async () => ({
    branch: createMockBranch(),
  })),

  createRef: jest.fn(async () => ({
    reference: {
      ref: 'mock_createRef_ref',
      objectSha: 'mock_createRef_objectSha',
    },
  })),

  createRelease: jest.fn(async () => ({
    release: {
      name: 'mock_createRelease_name',
      htmlUrl: 'https://mock_createRelease_html_url',
      tagName: 'mock_createRelease_tag_name',
    },
  })),

  getComparison: jest.fn(async () => ({
    comparison: {
      htmlUrl: 'https://mock_compareCommits_html_url',
      aheadBy: 1,
    },
  })),

  createTagObject: jest.fn(async () => ({
    tagObject: {
      tagName: 'mock_tag_object_tag',
      tagSha: 'mock_tag_object_sha',
    },
  })),

  createCommit: jest.fn(async () => ({
    commit: {
      message: 'mock_commit_message',
      sha: 'mock_commit_sha',
    },
  })),

  updateRef: jest.fn(async () => ({
    reference: {
      ref: 'mock_update_ref_ref',
      object: {
        sha: 'mock_update_ref_object_sha',
      },
    },
  })),

  merge: jest.fn(async () => ({
    merge: {
      htmlUrl: 'https://mock_merge_html_url',
      commit: {
        message: 'mock_merge_commit_message',
        tree: {
          sha: 'mock_merge_commit_tree_sha',
        },
      },
    },
  })),

  updateRelease: jest.fn(async () => ({
    release: {
      name: 'mock_update_release_name',
      tagName: 'mock_update_release_tag_name',
      htmlUrl: 'https://mock_update_release_html_url',
    },
  })),

  getAllTags: jest.fn(async () => ({
    tags: [
      {
        tagName: MOCK_RELEASE_CANDIDATE_TAG_NAME_CALVER,
        tagSha: 'mock_sha',
        tagType: 'tag' as const,
      },
    ],
  })),

  getAllReleases: jest.fn(async () => ({
    releases: [
      {
        id: 1,
        name: 'mock_release_name',
        tagName: 'mock_release_tag_name',
        createdAt: 'mock_release_published_at',
        htmlUrl: 'https://mock_release_html_url',
      },
    ],
  })),

  getTag: jest.fn(async () => ({
    tag: {
      date: '2021-04-29T12:48:30.120Z',
      username: 'mock_user_single_tag_name',
      userEmail: 'mock_user_single_tag_email',
      objectSha: 'mock_single_tag_object_sha',
    },
  })),
};
