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
import { z as zod } from 'zod';

const repoUrl = (z: typeof zod) =>
  z.string({
    description:
      'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the new repository name and `owner` is an organization or username',
  });

const description = (z: typeof zod) =>
  z
    .string({
      description: 'Repository Description',
    })
    .optional();

const homepage = (z: typeof zod) =>
  z
    .string({
      description: 'Repository Homepage',
    })
    .optional();

const access = (z: typeof zod) =>
  z
    .string({
      description:
        'Sets an admin collaborator on the repository. Can either be a user reference different from `owner` in `repoUrl` or team reference, eg. `org/team-name`',
    })
    .optional();

const requireCodeOwnerReviews = (z: typeof zod) =>
  z
    .boolean({
      description:
        'Require an approved review in PR including files with a designated Code Owner',
    })
    .optional();

const dismissStaleReviews = (z: typeof zod) =>
  z
    .boolean({
      description:
        'New reviewable commits pushed to a matching branch will dismiss pull request review approvals.',
    })
    .optional();

const requiredStatusCheckContexts = (z: typeof zod) =>
  z
    .array(z.string(), {
      description:
        'The list of status checks to require in order to merge into this branch',
    })
    .optional();

const requireBranchesToBeUpToDate = (z: typeof zod) =>
  z
    .boolean({
      description:
        'Require branches to be up to date before merging. The default value is `true`',
    })
    .default(true)
    .optional();

const requiredConversationResolution = (z: typeof zod) =>
  z
    .boolean({
      description:
        'Requires all conversations on code to be resolved before a pull request can be merged into this branch',
    })
    .optional();

const requireLastPushApproval = (z: typeof zod) =>
  z
    .boolean({
      description:
        'Whether the most recent push to a PR must be approved by someone other than the person who pushed it. The default value is `false`',
    })
    .default(false)
    .optional();

const repoVisibility = (z: typeof zod) =>
  z
    .enum(['private', 'public', 'internal'], {
      description: 'Repository Visibility',
    })
    .optional();

const deleteBranchOnMerge = (z: typeof zod) =>
  z
    .boolean({
      description:
        'Delete the branch after merging the PR. The default value is `false`',
    })
    .default(false)
    .optional();

const gitAuthorName = (z: typeof zod) =>
  z
    .string({
      description:
        'Sets the default author name for the commit. The default value is `Scaffolder`',
    })
    .default('Scaffolder')
    .optional();

const gitAuthorEmail = (z: typeof zod) =>
  z
    .string({
      description: `Sets the default author email for the commit.`,
    })
    .optional();

const allowMergeCommit = (z: typeof zod) =>
  z
    .boolean({
      description: 'Allow merge commits. The default value is `true`',
    })
    .default(true)
    .optional();

const allowSquashMerge = (z: typeof zod) =>
  z
    .boolean({
      description: 'Allow squash merges. The default value is `true`',
    })
    .default(true)
    .optional();

const allowUpdateBranch = (z: typeof zod) =>
  z
    .boolean({
      description: 'Allow branch to be updated. The default value is `false`',
    })
    .default(false)
    .optional();

const squashMergeCommitTitle = (z: typeof zod) =>
  z
    .enum(['PR_TITLE', 'COMMIT_OR_PR_TITLE'], {
      description:
        'Sets the default value for a squash merge commit title. The default value is `COMMIT_OR_PR_TITLE`',
    })
    .default('COMMIT_OR_PR_TITLE')
    .optional();

const squashMergeCommitMessage = (z: typeof zod) =>
  z
    .enum(['PR_BODY', 'COMMIT_MESSAGES', 'BLANK'], {
      description:
        'Sets the default value for a squash merge commit message. The default value is `COMMIT_MESSAGES`',
    })
    .default('COMMIT_MESSAGES')
    .optional();

const allowRebaseMerge = (z: typeof zod) =>
  z
    .boolean({
      description: 'Allow rebase merges. The default value is `true`',
    })
    .default(true)
    .optional();

const allowAutoMerge = (z: typeof zod) =>
  z
    .boolean({
      description:
        'Allow individual PRs to merge automatically when all merge requirements are met. The default value is `false`',
    })
    .default(false)
    .optional();

const collaborators = (z: typeof zod) =>
  z
    .array(
      z.union([
        z.object({
          access: z.string({
            description: 'The type of access for the user',
          }),
          user: z.string({
            description:
              'The name of the user that will be added as a collaborator',
          }),
        }),
        z.object({
          access: z.string({
            description: 'The type of access for the team',
          }),
          team: z.string({
            description:
              'The name of the team that will be added as a collaborator',
          }),
        }),
      ]),
      {
        description: 'Provide additional users or teams with permissions',
      },
    )
    .optional();

const hasProjects = (z: typeof zod) =>
  z
    .boolean({
      description:
        'Enable projects for the repository. The default value is `true` unless the organization has disabled repository projects',
    })
    .optional();

const hasWiki = (z: typeof zod) =>
  z
    .boolean({
      description:
        'Enable the wiki for the repository. The default value is `true`',
    })
    .default(true)
    .optional();

const hasIssues = (z: typeof zod) =>
  z
    .boolean({
      description:
        'Enable issues for the repository. The default value is `true`',
    })
    .default(true)
    .optional();

const token = (z: typeof zod) =>
  z
    .string({
      description: 'The token to use for authorization to GitHub',
    })
    .optional();

const topics = (z: typeof zod) =>
  z
    .array(z.string(), {
      description: 'Adds topics to the repository',
    })
    .optional();

const defaultBranch = (z: typeof zod) =>
  z
    .string({
      description: `Sets the default branch on the repository. The default value is 'master'`,
    })
    .default('master')
    .optional();

const protectDefaultBranch = (z: typeof zod) =>
  z
    .boolean({
      description:
        'Protect the default branch after creating the repository. The default value is `true`',
    })
    .default(true)
    .optional();

const protectEnforceAdmins = (z: typeof zod) =>
  z
    .boolean({
      description:
        'Enforce admins to adhere to default branch protection. The default value is `true`',
    })
    .default(true)
    .optional();

const bypassPullRequestAllowances = (z: typeof zod) =>
  z
    .object(
      {
        apps: z.array(z.string()).optional(),
        users: z.array(z.string()).optional(),
        teams: z.array(z.string()).optional(),
      },
      {
        description:
          'Allow specific users, teams, or apps to bypass pull request requirements.',
      },
    )
    .optional();

const gitCommitMessage = (z: typeof zod) =>
  z
    .string({
      description:
        'Sets the commit message on the repository. The default value is `initial commit`',
    })
    .default('initial commit')
    .optional();

const sourcePath = (z: typeof zod) =>
  z
    .string({
      description:
        'Path within the workspace that will be used as the repository root. If omitted, the entire workspace will be published as the repository.',
    })
    .optional();

const requiredApprovingReviewCount = (z: typeof zod) =>
  z
    .number({
      description:
        'Specify the number of reviewers required to approve pull requests. Use a number between `1` and `6` or `0` to not require reviewers. Defaults to `1`.',
    })
    .optional();

const restrictions = (z: typeof zod) =>
  z
    .object(
      {
        apps: z.array(z.string()).optional(),
        users: z.array(z.string()),
        teams: z.array(z.string()),
      },
      {
        description:
          'Restrict who can push to the protected branch. User, app, and team restrictions are only available for organization-owned repositories.',
      },
    )
    .optional();

const requiredCommitSigning = (z: typeof zod) =>
  z
    .boolean({
      description: `Require commit signing so that you must sign commits on this branch.`,
    })
    .optional();

const requiredLinearHistory = (z: typeof zod) =>
  z
    .boolean({
      description: `Prevent merge commits from being pushed to matching branches.`,
    })
    .optional();

const blockCreations = (z: typeof zod) =>
  z
    .boolean({
      description: `Prevents creation of new branches during push, unless the push is initiated by a user, team, or app (defined in restrictions) which has the ability to push.`,
    })
    .default(false)
    .optional();

const repoVariables = (z: typeof zod) =>
  z
    .record(z.string(), {
      description: 'Variables attached to the repository',
    })
    .optional();

const secrets = (z: typeof zod) =>
  z
    .record(z.string(), {
      description: 'Secrets attached to the repository',
    })
    .optional();

const oidcCustomization = (z: typeof zod) =>
  z
    .object(
      {
        useDefault: z
          .boolean({
            description: `Whether to use the default template or not. If true, includeClaimKeys must not be set.`,
          })
          .default(true),
        includeClaimKeys: z
          .array(z.string(), {
            description: `Array of unique strings. Each claim key can only contain alphanumeric characters and underscores.`,
          })
          .optional(),
      },
      {
        description: `OIDC customization template attached to the repository.`,
      },
    )
    .optional();

const customProperties = (z: typeof zod) =>
  z
    .record(z.union([z.string(), z.array(z.string())]), {
      description:
        'Custom properties to be added to the repository (note, this only works for organization repositories). All values must be strings',
    })
    .optional();

const subscribe = (z: typeof zod) =>
  z
    .boolean({
      description: `Subscribe to the repository. The default value is 'false'`,
    })
    .optional();

const branch = (z: typeof zod) =>
  z
    .string({
      description: `The branch to protect. Defaults to the repository's default branch`,
    })
    .optional();

const autoInit = (z: typeof zod) =>
  z
    .boolean({
      description: `Create an initial commit with empty README. Default is 'false'`,
    })
    .default(false)
    .optional();

const workflowAccess = (z: typeof zod) =>
  z
    .enum(['none', 'organization', 'user'], {
      description:
        'Level of access for workflows outside of the repository. Default is "none".',
    })
    .optional();

export {
  access,
  allowAutoMerge,
  allowMergeCommit,
  allowRebaseMerge,
  allowSquashMerge,
  allowUpdateBranch,
  autoInit,
  blockCreations,
  branch,
  bypassPullRequestAllowances,
  collaborators,
  customProperties,
  defaultBranch,
  deleteBranchOnMerge,
  description,
  dismissStaleReviews,
  gitAuthorEmail,
  gitAuthorName,
  gitCommitMessage,
  hasIssues,
  hasProjects,
  hasWiki,
  homepage,
  oidcCustomization,
  protectDefaultBranch,
  protectEnforceAdmins,
  repoUrl,
  repoVariables,
  repoVisibility,
  requireBranchesToBeUpToDate,
  requireCodeOwnerReviews,
  requiredApprovingReviewCount,
  requiredCommitSigning,
  requiredConversationResolution,
  requiredLinearHistory,
  requiredStatusCheckContexts,
  requireLastPushApproval,
  restrictions,
  secrets,
  sourcePath,
  squashMergeCommitMessage,
  squashMergeCommitTitle,
  subscribe,
  token,
  topics,
  workflowAccess,
};
