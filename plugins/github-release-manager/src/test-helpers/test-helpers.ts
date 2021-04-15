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
  GhCreateCommitResponse,
  GhCreateReferenceResponse,
  GhCreateTagObjectResponse,
  GhGetBranchResponse,
  GhGetCommitResponse,
  GhGetReleaseResponse,
  GhMergeResponse,
  GhUpdateReferenceResponse,
  GhUpdateReleaseResponse,
} from '../types/types';
import { Project } from '../contexts/ProjectContext';
import { ApiMethodRetval, IPluginApiClient } from '../api/PluginApiClient';

export const mockSemverProject: Project = {
  owner: 'mock_owner',
  repo: 'mock_repo',
  versioningStrategy: 'semver',
};

export const mockCalverProject: Project = {
  owner: 'mock_owner',
  repo: 'mock_repo',
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
}: Partial<
  NonNullable<
    ApiMethodRetval<IPluginApiClient['getLatestRelease']>['latestRelease']
  >
> = {}) =>
  ({
    id: 1,
    htmlUrl: 'mock_release_html_url',
    prerelease,
    ...rest,
  } as NonNullable<
    ApiMethodRetval<IPluginApiClient['getLatestRelease']>['latestRelease']
  >);
export const mockRcRelease = createMockRelease({
  prerelease: true,
  tagName: 'rc-2020.01.01_1',
  targetCommitish: 'rc/1.2.3',
});
export const mockReleaseVersion = createMockRelease({
  prerelease: false,
  tagName: 'version-2020.01.01_1',
  targetCommitish: 'rc/1.2.3',
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
export const mockApiClient: IPluginApiClient = {
  getHost: jest.fn(() => 'github.com'),
  getRepoPath: jest.fn(() => 'erikengervall/playground'),
  getOrganizations: jest.fn(),
  getRepositories: jest.fn(),
  getUsername: jest.fn(),
  getRecentCommits: jest.fn().mockResolvedValue({
    recentCommits: mockRecentCommits,
  }),
  getLatestRelease: jest.fn(), // TODO:
  getRepository: jest.fn(),
  getLatestCommit: jest.fn().mockResolvedValue({
    latestCommit: createMockCommit({ node_id: 'mock_latest_commit' }),
  }),
  getBranch: jest.fn().mockResolvedValue({
    branch: mockReleaseBranch,
  }),

  createRc: {
    createRef: jest.fn().mockResolvedValue({
      ref: 'mock_createRef_ref',
    } as NonNullable<ApiMethodRetval<IPluginApiClient['createRc']['createRef']>>),
    createRelease: jest.fn().mockResolvedValue({
      createReleaseResponse: {
        name: 'mock_createRelease_name',
        htmlUrl: 'mock_createRelease_html_url',
        tagName: 'mock_createRelease_tag_name',
      },
    } as NonNullable<ApiMethodRetval<IPluginApiClient['createRc']['createRelease']>>),
    getComparison: jest.fn().mockResolvedValue({
      htmlUrl: 'mock_compareCommits_html_url',
      aheadBy: 1,
    } as NonNullable<ApiMethodRetval<IPluginApiClient['createRc']['getComparison']>>),
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
  // project: mockSemverProject,
};
