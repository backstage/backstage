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
  GetBranchResult,
  GetLatestReleaseResult,
  GetRecentCommitsResultSingle,
  GetTagResult,
  GetCommitResult,
} from '../api/GitReleaseClient';
import { CalverTagParts } from '../helpers/tagParts/getCalverTagParts';
import { Project } from '../contexts/ProjectContext';
import { getReleaseCandidateGitInfo } from '../helpers/getReleaseCandidateGitInfo';

export const mockUsername = 'mock_username';
export const mockEmail = 'mock_email';
export const mockOwner = 'mock_owner';
export const mockRepo = 'mock_repo';

export const A_CALVER_VERSION = '2020.01.01_1';
export const MOCK_RELEASE_NAME_CALVER = `Version ${A_CALVER_VERSION}`;
export const MOCK_RELEASE_BRANCH_NAME_CALVER = `rc/${A_CALVER_VERSION}`;
export const MOCK_RELEASE_CANDIDATE_TAG_NAME_CALVER = `rc-${A_CALVER_VERSION}`;
export const MOCK_RELEASE_VERSION_TAG_NAME_CALVER = `version-${A_CALVER_VERSION}`;

export const A_SEMVER_VERSION = '1.2.3';
export const MOCK_RELEASE_NAME_SEMVER = `Version ${A_SEMVER_VERSION}`;
export const MOCK_RELEASE_BRANCH_NAME_SEMVER = `rc/${A_SEMVER_VERSION}`;
export const MOCK_RELEASE_CANDIDATE_TAG_NAME_SEMVER = `rc-${A_SEMVER_VERSION}`;
export const MOCK_RELEASE_VERSION_TAG_NAME_SEMVER = `version-${A_SEMVER_VERSION}`;

export const createMockTag = (
  overrides: Partial<GetTagResult['tag']>,
): GetTagResult => ({
  tag: {
    date: '2000-01-01T10:00:00.000Z',
    objectSha: 'mock_tag_object_sha',
    userEmail: mockEmail,
    username: mockUsername,
    ...overrides,
  },
});

export const createMockCommit = (
  overrides: Partial<GetCommitResult['commit']>,
): GetCommitResult => ({
  commit: {
    commit: {
      message: 'mock_commit_commit_message',
    },
    htmlUrl: 'https://mock_commit_html_url',
    sha: 'mock_commit_sha',
    createdAt: '2000-01-01T10:00:00.000Z',
    ...overrides,
  },
});

export const mockUser = {
  username: mockUsername,
  email: mockEmail,
};

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

export const mockNextGitInfoSemver: ReturnType<
  typeof getReleaseCandidateGitInfo
> = {
  rcBranch: MOCK_RELEASE_BRANCH_NAME_SEMVER,
  rcReleaseTag: MOCK_RELEASE_CANDIDATE_TAG_NAME_SEMVER,
  releaseName: MOCK_RELEASE_NAME_SEMVER,
};

export const mockNextGitInfoCalver: ReturnType<
  typeof getReleaseCandidateGitInfo
> = {
  rcBranch: MOCK_RELEASE_BRANCH_NAME_CALVER,
  rcReleaseTag: MOCK_RELEASE_CANDIDATE_TAG_NAME_CALVER,
  releaseName: MOCK_RELEASE_NAME_CALVER,
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
export const createMockRelease = ({
  id = 1,
  prerelease = false,
  ...rest
}: Partial<
  NonNullable<GetLatestReleaseResult['latestRelease']>
> = {}): NonNullable<GetLatestReleaseResult['latestRelease']> => ({
  id,
  htmlUrl: 'https://mock_release_html_url',
  prerelease,
  tagName: MOCK_RELEASE_CANDIDATE_TAG_NAME_CALVER,
  targetCommitish: MOCK_RELEASE_BRANCH_NAME_CALVER,
  ...rest,
});

export const mockReleaseCandidateCalver = createMockRelease({
  prerelease: true,
  tagName: MOCK_RELEASE_CANDIDATE_TAG_NAME_CALVER,
  targetCommitish: MOCK_RELEASE_BRANCH_NAME_CALVER,
});

export const mockReleaseVersionCalver = createMockRelease({
  prerelease: false,
  tagName: MOCK_RELEASE_VERSION_TAG_NAME_CALVER,
  targetCommitish: MOCK_RELEASE_BRANCH_NAME_CALVER,
});

export const mockReleaseCandidateSemver = createMockRelease({
  prerelease: true,
  tagName: MOCK_RELEASE_CANDIDATE_TAG_NAME_SEMVER,
  targetCommitish: MOCK_RELEASE_BRANCH_NAME_SEMVER,
});
export const mockReleaseVersionSemver = createMockRelease({
  prerelease: false,
  tagName: MOCK_RELEASE_VERSION_TAG_NAME_SEMVER,
  targetCommitish: MOCK_RELEASE_BRANCH_NAME_SEMVER,
});

/**
 * MOCK BRANCH
 */
export const createMockBranch = ({
  ...rest
}: Partial<GetBranchResult> = {}): GetBranchResult['branch'] => ({
  name: MOCK_RELEASE_BRANCH_NAME_SEMVER,
  commit: {
    sha: 'mock_branch_commit_sha',
    commit: {
      tree: {
        sha: 'mock_branch_commit_commit_tree_sha',
      },
    },
  },
  links: {
    html: 'https://mock_branch_links_html',
  },
  ...rest,
});
export const mockReleaseBranch = createMockBranch();

/**
 * MOCK COMMIT
 */
export const createMockRecentCommit = ({
  ...rest
}: Partial<GetRecentCommitsResultSingle>): GetRecentCommitsResultSingle => ({
  author: {
    htmlUrl: 'https://author_html_url',
    login: 'author_login',
  },
  commit: {
    message: 'commit_message',
  },
  sha: 'mock_sha',
  firstParentSha: 'mock_first_parent_sha',
  htmlUrl: 'https://mock_htmlUrl',
  ...rest,
});

export const mockSelectedPatchCommit = createMockRecentCommit({
  sha: 'mock_sha_selected_patch_commit',
});
