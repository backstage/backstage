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
import {
  GhCompareCommitsResponse,
  GhCreateCommitResponse,
  GhCreateReferenceResponse,
  GhCreateReleaseResponse,
  GhCreateTagObjectResponse,
  GhGetBranchResponse,
  GhGetCommitResponse,
  GhGetReleaseResponse,
  GhMergeResponse,
  GhUpdateReferenceResponse,
  GhUpdateReleaseResponse,
  Project,
} from '../types/types';

export const mockSemverProject: Project = {
  github: {
    org: 'mock_org',
    repo: 'mock_repo',
  },
  name: 'mock_name',
  versioningStrategy: 'semver',
};

export const mockCalverProject: Project = {
  github: {
    org: 'mock_org',
    repo: 'mock_repo',
  },
  name: 'mock_name',
  versioningStrategy: 'calver',
};

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
}: Partial<GhGetReleaseResponse> = {}) =>
  ({
    id: 1,
    body: 'mock_body',
    html_url: 'mock_release_html_url',
    prerelease,
    ...rest,
  } as GhGetReleaseResponse);
export const mockRcRelease = createMockRelease({
  prerelease: true,
  tag_name: 'rc-2020.01.01_1',
  target_commitish: 'rc/1.2.3',
});
export const mockReleaseVersion = createMockRelease({
  prerelease: false,
  tag_name: 'version-2020.01.01_1',
  target_commitish: 'rc/1.2.3',
});

/**
 * MOCK BRANCH
 */
const createMockBranch = ({ ...rest }: Partial<GhGetBranchResponse> = {}) =>
  ({
    name: 'rc/1.2.3',
    commit: {
      sha: 'mock_branch_commit_sha',
      commit: { tree: { sha: 'mock_branch_commit_commit_tree_sha' } },
    },
    _links: { html: 'mock_branch__links_html' },
    ...rest,
  } as GhGetBranchResponse);
export const mockReleaseBranch = createMockBranch();

/**
 * MOCK COMMIT
 */
const createMockCommit = ({ node_id = '1' }: Partial<GhGetCommitResponse>) =>
  ({
    node_id,
    author: {
      html_url: 'mock_recentCommits_author_html_url',
      login: 'mock_recentCommit_author_login',
    },
    commit: {
      message: 'mock_latestCommit_message',
    },
    html_url: 'mock_latestCommit_html_url',
    sha: 'mock_latestCommit_sha',
  } as GhGetCommitResponse);
export const mockRecentCommits = [
  createMockCommit({ node_id: '1' }),
  createMockCommit({ node_id: '2' }),
] as GhGetCommitResponse[];

export const mockSelectedPatchCommit = createMockCommit({
  node_id: 'mock_selected_patch_commit',
});

/**
 * MOCK API CLIENT
 */
export const mockApiClient = {
  pluginApiClient: {
    getOctokit: jest.fn(),
    baseUrl: 'http://mock_base_url.hehe',
  },

  getRepoPath: jest.fn(() => 'erikengervall/playground'),

  getRecentCommits: jest.fn().mockResolvedValue({
    recentCommits: mockRecentCommits,
  }),
  getReleases: jest.fn().mockResolvedValue({
    releases: [
      createMockRelease({ id: 1, body: 'mock_releases[0]' }),
      createMockRelease({ id: 2, body: 'mock_releases[1]' }),
    ],
  }),
  getRelease: jest.fn().mockResolvedValue({
    latestRelease: createMockRelease({ id: 1, body: 'mock_latest_release' }),
  }),

  getBranch: jest.fn().mockResolvedValue({
    branch: mockReleaseBranch,
  }),
  getLatestCommit: jest.fn().mockResolvedValue({
    latestCommit: createMockCommit({ node_id: 'mock_latest_commit' }),
  }),
  getOctokit: () => ({
    octokit: {
      request: jest.fn(),
    },
  }),
  getProject: jest.fn(),

  getRepository: jest.fn(),
  githubAuthApi: {
    getAccessToken: jest.fn(),
  },
  createRc: {
    createRef: jest.fn().mockResolvedValue({
      createdRef: {
        ref: 'mock_createRef_ref',
      } as GhCreateReferenceResponse,
    }),
    createRelease: jest.fn().mockResolvedValue({
      createReleaseResponse: {
        name: 'mock_createRelease_name',
        html_url: 'mock_createRelease_html_url',
        tag_name: 'mock_createRelease_tag_name',
      } as GhCreateReleaseResponse,
    }),
    getComparison: jest.fn().mockResolvedValue({
      comparison: {
        html_url: 'mock_compareCommits_html_url',
        ahead_by: 1,
      } as GhCompareCommitsResponse,
    }),
  },
  patch: {
    createCherryPickCommit: jest.fn().mockResolvedValue({
      cherryPickCommit: {
        commit: {
          message: 'mock_merge_commit_message',
          tree: { sha: 'mock_merge_commit_tree_sha' },
        },
        html_url: 'mock_merge_html_url',
      } as GhMergeResponse,
    }),
    createReference: jest.fn().mockResolvedValue({
      reference: {
        ref: 'mock_reference_ref',
      } as GhCreateReferenceResponse,
    }),
    createTagObject: jest.fn().mockResolvedValue({
      tagObjectResponse: {
        tag: 'mock_tag_object_tag',
        sha: 'mock_tag_object_sha',
      } as GhCreateTagObjectResponse,
    }),
    createTempCommit: jest.fn().mockResolvedValue({
      tempCommit: {
        message: 'mock_commit_message',
        sha: 'mock_commit_sha',
      } as GhCreateCommitResponse,
    }),
    forceBranchHeadToTempCommit: jest.fn().mockResolvedValue(undefined),
    merge: jest.fn().mockResolvedValue({
      merge: {
        commit: {
          message: 'mock_merge_commit_message',
          tree: { sha: 'mock_merge_commit_tree_sha' },
        },
        html_url: 'mock_merge_html_url',
      } as GhMergeResponse,
    }),
    replaceTempCommit: jest.fn().mockResolvedValue({
      updatedReference: {
        ref: 'mock_reference_ref',
        object: { sha: 'mock_reference_object_sha' },
      } as GhUpdateReferenceResponse,
    }),
    updateRelease: jest.fn().mockResolvedValue({
      release: {
        name: 'mock_update_release_name',
        tag_name: 'mock_update_release_tag_name',
        html_url: 'mock_update_release_html_url',
      } as GhUpdateReleaseResponse,
    }),
  },
  promoteRc: {
    promoteRelease: jest.fn().mockResolvedValue({
      release: {
        name: 'mock_release_name',
        tag_name: 'mock_release_tag_name',
        html_url: 'mock_release_html_url',
      } as GhGetReleaseResponse,
    }),
  },
  project: mockSemverProject,
} as any;
