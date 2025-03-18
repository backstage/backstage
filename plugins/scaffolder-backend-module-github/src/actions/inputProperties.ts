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

const repoUrl = {
  title: 'Repository Location',
  description:
    'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the new repository name and `owner` is an organization or username',
  type: 'string',
};
const description = {
  title: 'Repository Description',
  type: 'string',
};
const homepage = {
  title: 'Repository Homepage',
  type: 'string',
};
const access = {
  title: 'Repository Access',
  description:
    'Sets an admin collaborator on the repository. Can either be a user reference different from `owner` in `repoUrl` or team reference, eg. `org/team-name`',
  type: 'string',
};
const requireCodeOwnerReviews = {
  title: 'Require CODEOWNER Reviews?',
  description:
    'Require an approved review in PR including files with a designated Code Owner',
  type: 'boolean',
};
const dismissStaleReviews = {
  title: 'Dismiss Stale Reviews',
  description:
    'New reviewable commits pushed to a matching branch will dismiss pull request review approvals.',
  type: 'boolean',
};
const requiredStatusCheckContexts = {
  title: 'Required Status Check Contexts',
  description:
    'The list of status checks to require in order to merge into this branch',
  type: 'array',
  items: {
    type: 'string',
  },
};
const requireBranchesToBeUpToDate = {
  title: 'Require Branches To Be Up To Date?',
  description:
    'Require branches to be up to date before merging. The default value is `true`',
  type: 'boolean',
  default: true,
};
const requiredConversationResolution = {
  title: 'Required Conversation Resolution',
  description:
    'Requires all conversations on code to be resolved before a pull request can be merged into this branch',
  type: 'boolean',
};
const requireLastPushApproval = {
  title: 'Require last push approval',
  type: 'boolean',
  default: false,
  description:
    'Whether the most recent push to a PR must be approved by someone other than the person who pushed it. The default value is `false`',
};
const repoVisibility = {
  title: 'Repository Visibility',
  type: 'string',
  enum: ['private', 'public', 'internal'],
};
const deleteBranchOnMerge = {
  title: 'Delete Branch On Merge',
  type: 'boolean',
  default: false,
  description:
    'Delete the branch after merging the PR. The default value is `false`',
};
const gitAuthorName = {
  title: 'Default Author Name',
  type: 'string',
  default: 'Scaffolder',
  description:
    'Sets the default author name for the commit. The default value is `Scaffolder`',
};
const gitAuthorEmail = {
  title: 'Default Author Email',
  type: 'string',
  description: `Sets the default author email for the commit.`,
};
const allowMergeCommit = {
  title: 'Allow Merge Commits',
  type: 'boolean',
  default: true,
  description: 'Allow merge commits. The default value is `true`',
};
const allowSquashMerge = {
  title: 'Allow Squash Merges',
  type: 'boolean',
  default: true,
  description: 'Allow squash merges. The default value is `true`',
};
const squashMergeCommitTitle = {
  title: 'Default squash merge commit title',
  enum: ['PR_TITLE', 'COMMIT_OR_PR_TITLE'],
  type: 'string',
  default: 'COMMIT_OR_PR_TITLE',
  description:
    'Sets the default value for a squash merge commit title. The default value is `COMMIT_OR_PR_TITLE`',
};
const squashMergeCommitMessage = {
  title: 'Default squash merge commit message',
  enum: ['PR_BODY', 'COMMIT_MESSAGES', 'BLANK'],
  type: 'string',
  default: 'COMMIT_MESSAGES',
  description:
    'Sets the default value for a squash merge commit message. The default value is `COMMIT_MESSAGES`',
};

const allowRebaseMerge = {
  title: 'Allow Rebase Merges',
  type: 'boolean',
  default: true,
  description: 'Allow rebase merges. The default value is `true`',
};
const allowAutoMerge = {
  title: 'Allow Auto Merges',
  type: 'boolean',
  default: false,
  description:
    'Allow individual PRs to merge automatically when all merge requirements are met. The default value is `false`',
};
const collaborators = {
  title: 'Collaborators',
  description: 'Provide additional users or teams with permissions',
  type: 'array',
  items: {
    type: 'object',
    additionalProperties: false,
    required: ['access'],
    properties: {
      access: {
        type: 'string',
        description: 'The type of access for the user',
      },
      user: {
        type: 'string',
        description:
          'The name of the user that will be added as a collaborator',
      },
      team: {
        type: 'string',
        description:
          'The name of the team that will be added as a collaborator',
      },
    },
    oneOf: [{ required: ['user'] }, { required: ['team'] }],
  },
};
const hasProjects = {
  title: 'Enable projects',
  type: 'boolean',
  description:
    'Enable projects for the repository. The default value is `true` unless the organization has disabled repository projects',
};
const hasWiki = {
  title: 'Enable the wiki',
  type: 'boolean',
  default: true,
  description:
    'Enable the wiki for the repository. The default value is `true`',
};
const hasIssues = {
  title: 'Enable issues',
  type: 'boolean',
  default: true,
  description: 'Enable issues for the repository. The default value is `true`',
};
const token = {
  title: 'Authentication Token',
  type: 'string',
  description: 'The token to use for authorization to GitHub',
};
const topics = {
  title: 'Topics',
  type: 'array',
  items: {
    type: 'string',
  },
};
const defaultBranch = {
  title: 'Default Branch',
  type: 'string',
  default: 'master',
  description:
    'Sets the default branch on the repository. The default value is `master`',
};
const protectDefaultBranch = {
  title: 'Protect Default Branch',
  type: 'boolean',
  default: true,
  description:
    'Protect the default branch after creating the repository. The default value is `true`',
};
const protectEnforceAdmins = {
  title: 'Enforce Admins On Protected Branches',
  type: 'boolean',
  default: true,
  description:
    'Enforce admins to adhere to default branch protection. The default value is `true`',
};

const bypassPullRequestAllowances = {
  title: 'Bypass pull request requirements',
  description:
    'Allow specific users, teams, or apps to bypass pull request requirements.',
  type: 'object',
  additionalProperties: false,
  properties: {
    apps: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    users: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    teams: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};

const gitCommitMessage = {
  title: 'Git Commit Message',
  type: 'string',
  default: 'initial commit',
  description:
    'Sets the commit message on the repository. The default value is `initial commit`',
};
const sourcePath = {
  title: 'Source Path',
  description:
    'Path within the workspace that will be used as the repository root. If omitted, the entire workspace will be published as the repository.',
  type: 'string',
};

const requiredApprovingReviewCount = {
  title: 'Required approving review count',
  type: 'number',
  description:
    'Specify the number of reviewers required to approve pull requests. Use a number between `1` and `6` or `0` to not require reviewers. Defaults to `1`.',
};

const restrictions = {
  title: 'Restrict who can push to the protected branch',
  description:
    'Restrict who can push to the protected branch. User, app, and team restrictions are only available for organization-owned repositories.',
  type: 'object',
  additionalProperties: false,
  properties: {
    apps: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    users: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    teams: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};

const requiredCommitSigning = {
  title: 'Require commit signing',
  type: 'boolean',
  description: `Require commit signing so that you must sign commits on this branch.`,
};

const requiredLinearHistory = {
  title: 'Require linear history',
  type: 'boolean',
  description: `Prevent merge commits from being pushed to matching branches.`,
};

const repoVariables = {
  title: 'Repository Variables',
  description: `Variables attached to the repository`,
  type: 'object',
};

const secrets = {
  title: 'Repository Secrets',
  description: `Secrets attached to the repository`,
  type: 'object',
};

const oidcCustomization = {
  title: 'Repository OIDC customization template',
  description: `OIDC customization template attached to the repository.`,
  type: 'object',
  additionalProperties: false,
  properties: {
    useDefault: {
      title: 'Use Default',
      type: 'boolean',
      description: `Whether to use the default OIDC template or not.`,
    },
    includeClaimKeys: {
      title: 'Include claim keys',
      type: 'array',
      items: {
        type: 'string',
      },
      description: `Array of unique strings. Each claim key can only contain alphanumeric characters and underscores.`,
    },
  },
};

const customProperties = {
  title: 'Custom Repository Properties',
  description:
    'Custom properties to be added to the repository (note, this only works for organization repositories)',
  type: 'object',
};

const subscribe = {
  title: 'Subscribe to repository',
  description: `Subscribe to the repository. The default value is 'false'`,
  type: 'boolean',
};

export { access };
export { allowMergeCommit };
export { allowRebaseMerge };
export { allowSquashMerge };
export { squashMergeCommitTitle };
export { squashMergeCommitMessage };
export { allowAutoMerge };
export { collaborators };
export { defaultBranch };
export { deleteBranchOnMerge };
export { description };
export { gitAuthorEmail };
export { gitAuthorName };
export { gitCommitMessage };
export { homepage };
export { protectDefaultBranch };
export { protectEnforceAdmins };
export { bypassPullRequestAllowances };
export { requiredApprovingReviewCount };
export { restrictions };
export { repoUrl };
export { repoVisibility };
export { requireCodeOwnerReviews };
export { dismissStaleReviews };
export { requiredStatusCheckContexts };
export { requireBranchesToBeUpToDate };
export { requiredConversationResolution };
export { requireLastPushApproval };
export { hasProjects };
export { hasIssues };
export { hasWiki };
export { sourcePath };
export { token };
export { topics };
export { requiredCommitSigning };
export { requiredLinearHistory };
export { repoVariables };
export { secrets };
export { oidcCustomization };
export { customProperties };
export { subscribe };
