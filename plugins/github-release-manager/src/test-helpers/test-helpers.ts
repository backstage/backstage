/*
 * Copyright 2021 Spotify AB
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

import { CalverTagParts } from '../helpers/tagParts/getCalverTagParts';
import { getRcGitHubInfo } from '../cards/createRc/getRcGitHubInfo';
import { Project } from '../contexts/ProjectContext';
import {
  GetBranchResult,
  GetLatestReleaseResult,
  GetRecentCommitsResultSingle,
  IPluginApiClient,
} from '../api/PluginApiClient';

const mockOwner = 'mock_owner';
const mockRepo = 'mock_repo';

export const mockSemverProject: Project = {
  owner: mockOwner,
  repo: mockRepo,
  versioningStrategy: 'semver',
  isProvidedViaProps: false,
};

export const mockCalverProject: Project = {
  owner: mockOwner,
  repo: mockRepo,
  versioningStrategy: 'calver',
  isProvidedViaProps: false,
};

export const mockSearchCalver = `?versioningStrategy=${mockCalverProject.versioningStrategy}&owner=${mockCalverProject.owner}&repo=${mockCalverProject.repo}`;

export const mockSearchSemver = `?versioningStrategy=${mockSemverProject.versioningStrategy}&owner=${mockSemverProject.owner}&repo=${mockSemverProject.repo}`;

export const mockDefaultBranch = 'mock_defaultBranch';

export const mockNextGitHubInfo: ReturnType<typeof getRcGitHubInfo> = {
  rcBranch: 'rc/1.2.3',
  rcReleaseTag: 'rc-1.2.3',
  releaseName: 'Version 1.2.3',
};

export const mockTagParts = {
  prefix: 'rc',
  calver: '2020.01.01',
  patch: 1,
} as CalverTagParts;

export const mockBumpedTag = 'rc-2020.01.01_1337';

/**
 * MOCK RELEASE
 */
const createMockRelease = ({
  id = 1,
  prerelease = false,
  ...rest
}: Partial<
  NonNullable<GetLatestReleaseResult>
> = {}): NonNullable<GetLatestReleaseResult> => ({
  id: 1,
  htmlUrl: 'mock_release_html_url',
  prerelease,
  tagName: 'rc-2020.01.01_1',
  targetCommitish: 'rc/1.2.3',
  ...rest,
});
export const mockReleaseCandidateCalver = createMockRelease({
  prerelease: true,
  tagName: 'rc-2020.01.01_1',
  targetCommitish: 'rc/1.2.3',
});
export const mockReleaseVersionCalver = createMockRelease({
  prerelease: false,
  tagName: 'version-2020.01.01_1',
  targetCommitish: 'rc/1.2.3',
});
export const mockReleaseVersionSemver = createMockRelease({
  prerelease: false,
  tagName: 'version-1.2.3',
  targetCommitish: 'rc/1.2.3',
});

/**
 * MOCK BRANCH
 */
const createMockBranch = ({
  ...rest
}: Partial<GetBranchResult> = {}): GetBranchResult => ({
  name: 'rc/1.2.3',
  commit: {
    sha: 'mock_branch_commit_sha',
    commit: { tree: { sha: 'mock_branch_commit_commit_tree_sha' } },
  },
  links: { html: 'mock_branch_links_html' },
  ...rest,
});
export const mockReleaseBranch = createMockBranch();

/**
 * MOCK COMMIT
 */
const createMockRecentCommit = ({
  ...rest
}: Partial<GetRecentCommitsResultSingle>): GetRecentCommitsResultSingle => ({
  author: {
    htmlUrl: 'author_html_url',
    login: 'author_login',
  },
  commit: {
    message: 'commit_message',
  },
  sha: 'mock_sha',
  firstParentSha: 'mock_first_parent_sha',
  htmlUrl: 'mock_htmlUrl',
  ...rest,
});

export const mockSelectedPatchCommit = createMockRecentCommit({
  sha: 'mock_sha_selected_patch_commit',
});

/**
 * MOCK API CLIENT
 */
export const mockApiClient: IPluginApiClient = {
  getHost: jest.fn(() => 'github.com'),

  getRepoPath: jest.fn(() => `${mockOwner}/${mockRepo}`),

  getOwners: jest.fn(async () => ({
    owners: [mockOwner, `${mockOwner}2`],
  })),

  getRepositories: jest.fn(async () => ({
    repositories: [mockRepo, `${mockRepo}2`],
  })),

  getUsername: jest.fn(async () => ({
    username: mockOwner,
  })),

  getRecentCommits: jest.fn(async () => [
    createMockRecentCommit({ sha: 'mock_sha_recent_commits_1' }),
    createMockRecentCommit({ sha: 'mock_sha_recent_commits_2' }),
  ]),

  getLatestRelease: jest.fn(),

  getRepository: jest.fn(),

  getLatestCommit: jest.fn(async () => ({
    sha: 'latestCommit.sha',
    htmlUrl: 'latestCommit.html_url',
    commit: {
      message: 'latestCommit.commit.message',
    },
  })),

  getBranch: jest.fn(async () => createMockBranch()),

  createRc: {
    createRef: jest.fn(async () => ({
      ref: 'mock_createRef_ref',
    })),

    createRelease: jest.fn(async () => ({
      name: 'mock_createRelease_name',
      htmlUrl: 'mock_createRelease_html_url',
      tagName: 'mock_createRelease_tag_name',
    })),

    getComparison: jest.fn(async () => ({
      htmlUrl: 'mock_compareCommits_html_url',
      aheadBy: 1,
    })),
  },

  patch: {
    createCherryPickCommit: jest.fn(async () => ({
      message: 'mock_cherrypick_message',
      sha: 'mock_cherrypick_sha',
    })),

    createReference: jest.fn(async () => ({
      ref: 'mock_reference_ref',
    })),

    createTagObject: jest.fn(async () => ({
      tag: 'mock_tag_object_tag',
      sha: 'mock_tag_object_sha',
    })),

    createTempCommit: jest.fn(async () => ({
      message: 'mock_commit_message',
      sha: 'mock_commit_sha',
    })),

    forceBranchHeadToTempCommit: jest.fn(async () => undefined),

    merge: jest.fn(async () => ({
      htmlUrl: 'mock_merge_html_url',
      commit: {
        message: 'mock_merge_commit_message',
        tree: {
          sha: 'mock_merge_commit_tree_sha',
        },
      },
    })),

    replaceTempCommit: jest.fn(async () => ({
      ref: 'mock_reference_ref',
      object: {
        sha: 'mock_reference_object_sha',
      },
    })),

    updateRelease: jest.fn(async () => ({
      name: 'mock_update_release_name',
      tagName: 'mock_update_release_tag_name',
      htmlUrl: 'mock_update_release_html_url',
    })),
  },

  promoteRc: {
    promoteRelease: jest.fn(async () => ({
      name: 'mock_release_name',
      tagName: 'mock_release_tag_name',
      htmlUrl: 'mock_release_html_url',
    })),
  },
};
