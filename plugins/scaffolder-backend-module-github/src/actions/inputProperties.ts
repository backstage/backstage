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
  description: `Accepts the format 'github.com?repo=reponame&owner=owner' where 'reponame' is the new repository name and 'owner' is an organization or username`,
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
  description: `Sets an admin collaborator on the repository. Can either be a user reference different from 'owner' in 'repoUrl' or team reference, eg. 'org/team-name'`,
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
  description: `Require branches to be up to date before merging. The default value is 'true'`,
  type: 'boolean',
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
  description: `Whether the most recent push to a PR must be approved by someone other than the person who pushed it. The default value is 'false'`,
};
const repoVisibility = {
  title: 'Repository Visibility',
  type: 'string',
  enum: ['private', 'public', 'internal'],
};
const deleteBranchOnMerge = {
  title: 'Delete Branch On Merge',
  type: 'boolean',
  description: `Delete the branch after merging the PR. The default value is 'false'`,
};
const gitAuthorName = {
  title: 'Default Author Name',
  type: 'string',
  description: `Sets the default author name for the commit. The default value is 'Scaffolder'`,
};
const gitAuthorEmail = {
  title: 'Default Author Email',
  type: 'string',
  description: `Sets the default author email for the commit.`,
};
const allowMergeCommit = {
  title: 'Allow Merge Commits',
  type: 'boolean',
  description: `Allow merge commits. The default value is 'true'`,
};
const allowSquashMerge = {
  title: 'Allow Squash Merges',
  type: 'boolean',
  description: `Allow squash merges. The default value is 'true'`,
};
const squashMergeCommitTitle = {
  title: 'Default squash merge commit title',
  enum: ['PR_TITLE', 'COMMIT_OR_PR_TITLE'],
  description: `Sets the default value for a squash merge commit title. The default value is 'COMMIT_OR_PR_TITLE'`,
};
const squashMergeCommitMessage = {
  title: 'Default squash merge commit message',
  enum: ['PR_BODY', 'COMMIT_MESSAGES', 'BLANK'],
  description: `Sets the default value for a squash merge commit message. The default value is 'COMMIT_MESSAGES'`,
};

const allowRebaseMerge = {
  title: 'Allow Rebase Merges',
  type: 'boolean',
  description: `Allow rebase merges. The default value is 'true'`,
};
const allowAutoMerge = {
  title: 'Allow Auto Merges',
  type: 'boolean',
  description: `Allow individual PRs to merge automatically when all merge requirements are met. The default value is 'false'`,
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
  description: `Enable projects for the repository. The default value is 'true' unless the organization has disabled repository projects`,
};
const hasWiki = {
  title: 'Enable the wiki',
  type: 'boolean',
  description: `Enable the wiki for the repository. The default value is 'true'`,
};
const hasIssues = {
  title: 'Enable issues',
  type: 'boolean',
  description: `Enable issues for the repository. The default value is 'true'`,
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
  description: `Sets the default branch on the repository. The default value is 'master'`,
};
const protectDefaultBranch = {
  title: 'Protect Default Branch',
  type: 'boolean',
  description: `Protect the default branch after creating the repository. The default value is 'true'`,
};
const protectEnforceAdmins = {
  title: 'Enforce Admins On Protected Branches',
  type: 'boolean',
  description: `Enforce admins to adhere to default branch protection. The default value is 'true'`,
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
  description: `Sets the commit message on the repository. The default value is 'initial commit'`,
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
  description: `Specify the number of reviewers required to approve pull requests. Use a number between 1 and 6 or 0 to not require reviewers. Defaults to 1.`,
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

const patternMatchingProperties = {
  name: {
    description: 'How this rule will appear to users.',
    type: 'string',
  },
  negate: {
    description: 'If true, the rule will fail if the pattern matches.',
    type: 'boolean',
  },
  operator: {
    description: 'The operator to use for matching.',
    enum: ['starts_with', 'ends_with', 'contains', 'regex'],
    type: 'string',
  },
  pattern: {
    description: 'The pattern to match with.',
    type: 'string',
  },
};
const rulesets = {
  title: 'Repository Rulesets.',
  description: 'Rulesets definitions for the repository.',
  items: {
    additionalProperties: false,
    properties: {
      bypass_actors: {
        title: 'Bypass Actors',
        description: 'The actors that can bypass the rules in this ruleset.',
        items: {
          additionalProperties: false,
          properties: {
            actor_id: {
              title: 'Actor ID',
              description:
                'The ID of the actor that can bypass a ruleset. If `actor_type` is `OrganizationAdmin`, this should be `1`. If `actor_type` is `DeployKey`, this should be null. `OrganizationAdmin` is not applicable for personal repositories.',
              type: ['number', 'null'],
            },
            actor_type: {
              title: 'Actor Type',
              description: 'The type of actor that can bypass a ruleset.',
              enum: [
                'OrganizationAdmin',
                'Integration',
                'RepositoryRole',
                'Team',
                'DeployKey',
              ],
              type: 'string',
            },
            bypass_mode: {
              title: 'Bypass Mode',
              description:
                'When the specified actor can bypass the ruleset. `pull_request` means that an actor can only bypass rules on pull requests. `pull_request` is not applicable for the `DeployKey` actor type. Also, `pull_request` is only applicable to branch rulesets. Default: `always`',
              enum: ['always', 'pull_request'],
              type: 'string',
            },
          },
          required: ['actor_type', 'bypass_mode'],
          type: 'object',
        },
        type: 'array',
      },
      conditions: {
        title: 'Ruleset Conditions',
        description: 'Parameters for a repository ruleset ref name condition',
        additionalProperties: false,
        properties: {
          ref_name: {
            title: 'Ref Name conditions',
            description:
              'Parameters for a repository ruleset ref name condition',
            additionalProperties: false,
            properties: {
              exclude: {
                title: 'Exclude',
                description:
                  'Array of ref names or patterns to include. One of these patterns must match for the condition to pass. Also accepts `~DEFAULT_BRANCH` to include the default branch or `~ALL` to include all branches.',
                items: {
                  type: 'string',
                },
                type: 'array',
              },
              include: {
                title: 'Include',
                description:
                  'Array of ref names or patterns to exclude. The condition will not pass if any of these patterns match.',
                items: {
                  type: 'string',
                },
                type: 'array',
              },
            },
            type: 'object',
          },
        },
        type: 'object',
      },
      enforcement: {
        title: 'Ruleset Enforcement',
        description:
          'The enforcement level of the ruleset. evaluate allows admins to test rules before enforcing them. Admins can view insights on the Rule Insights page (`evaluate` is only available with GitHub Enterprise).',
        enum: ['active', 'disabled', 'evaluate'],
        type: 'string',
      },
      name: {
        title: 'Ruleset Name',
        description: `The name of the ruleset.`,
        type: 'string',
      },
      rules: {
        title: 'Ruleset Rules',
        description: 'An array of rules within the ruleset.',
        items: {
          anyOf: [
            {
              title: 'Creation Rule',
              description:
                'Only allow users with bypass permission to create matching refs.',
              additionalProperties: false,
              properties: {
                type: {
                  const: 'creation',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'Update Rule',
              description:
                'Only allow users with bypass permission to update matching refs.',
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: {
                    update_allows_fetch_and_merge: {
                      description:
                        'Branch can pull changes from its upstream repository',
                      type: 'boolean',
                    },
                  },
                  required: ['update_allows_fetch_and_merge'],
                  type: 'object',
                },
                type: {
                  const: 'update',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'Deletion Rule',
              description:
                'Only allow users with bypass permissions to delete matching refs.',
              additionalProperties: false,
              properties: {
                type: {
                  const: 'deletion',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'Required Linear History Rule',
              description:
                'Prevent merge commits from being pushed to matching refs.',
              additionalProperties: false,
              properties: {
                type: {
                  const: 'required_linear_history',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'Required Deployments Rule',
              description:
                'Choose which environments must be successfully deployed to before refs can be pushed into a ref that matches this rule.',
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: {
                    required_deployment_environments: {
                      title: 'Required Deployment Environments',
                      description:
                        'The environments that must be successfully deployed to before branches can be merged.',
                      items: {
                        type: 'string',
                      },
                      type: 'array',
                    },
                  },
                  required: ['required_deployment_environments'],
                  type: 'object',
                },
                type: {
                  const: 'required_deployments',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'Required Signatures Rule',
              description:
                'Commits pushed to matching refs must have verified signatures.',
              additionalProperties: false,
              properties: {
                type: {
                  const: 'required_signatures',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'Pull Request Rule',
              description:
                'Require all commits be made to a non-target branch and submitted via a pull request before they can be merged.',
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: {
                    dismiss_stale_reviews_on_push: {
                      description:
                        'New, reviewable commits pushed will dismiss previous pull request review approvals.',
                      type: 'boolean',
                    },
                    require_code_owner_review: {
                      description:
                        'Require an approving review in pull requests that modify files that have a designated code owner.',
                      type: 'boolean',
                    },
                    require_last_push_approval: {
                      description:
                        'Whether the most recent reviewable push must be approved by someone other than the person who pushed it.',
                      type: 'boolean',
                    },
                    required_approving_review_count: {
                      description:
                        'The number of approving reviews that are required before a pull request can be merged.',
                      type: 'number',
                    },
                    required_review_thread_resolution: {
                      description:
                        'All conversations on code must be resolved before a pull request can be merged.',
                      type: 'boolean',
                    },
                  },
                  required: [
                    'dismiss_stale_reviews_on_push',
                    'require_code_owner_review',
                    'require_last_push_approval',
                    'required_approving_review_count',
                    'required_review_thread_resolution',
                  ],
                  type: 'object',
                },
                type: {
                  const: 'pull_request',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'Required Status Checks Rule',
              description:
                'Choose which status checks must pass before the ref is updated. When enabled, commits must first be pushed to another ref where the checks pass.',
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: {
                    required_status_checks: {
                      items: {
                        additionalProperties: false,
                        properties: {
                          context: {
                            description:
                              'The status check context name that must be present on the commit.',
                            type: 'string',
                          },
                          integration_id: {
                            description:
                              'The optional integration ID that this status check must originate from.',
                            type: 'number',
                          },
                        },
                        required: ['context'],
                        type: 'object',
                      },
                      type: 'array',
                    },
                    strict_required_status_checks_policy: {
                      description:
                        'Whether pull requests targeting a matching branch must be tested with the latest code. This setting will not take effect unless at least one status check is enabled.',
                      type: 'boolean',
                    },
                  },
                  required: [
                    'required_status_checks',
                    'strict_required_status_checks_policy',
                  ],
                  type: 'object',
                },
                type: {
                  const: 'required_status_checks',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'Non Fast Forward Rule',
              description:
                'Prevent users with push access from force pushing to refs.',
              additionalProperties: false,
              properties: {
                type: {
                  const: 'non_fast_forward',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'Commit Message Pattern Rule',
              description:
                'Parameters to be used for the commit_message_pattern rule',
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: patternMatchingProperties,
                  required: ['operator', 'pattern'],
                  type: 'object',
                },
                type: {
                  const: 'commit_message_pattern',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'Commit Author Email Pattern Rule',
              description:
                'Parameters to be used for the commit_author_email_pattern rule',
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: patternMatchingProperties,
                  required: ['operator', 'pattern'],
                  type: 'object',
                },
                type: {
                  const: 'commit_author_email_pattern',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: patternMatchingProperties,
                  required: ['operator', 'pattern'],
                  type: 'object',
                },
                type: {
                  const: 'committer_email_pattern',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: patternMatchingProperties,
                  required: ['operator', 'pattern'],
                  type: 'object',
                },
                type: {
                  const: 'branch_name_pattern',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: patternMatchingProperties,
                  required: ['operator', 'pattern'],
                  type: 'object',
                },
                type: {
                  const: 'tag_name_pattern',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'File Path Restriction Rule',
              description:
                'Prevent commits that include changes in specified file paths from being pushed to the commit graph.',
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: {
                    restricted_file_paths: {
                      description:
                        'The file paths that are restricted from being pushed to the commit graph.',
                      items: {
                        type: 'string',
                      },
                      type: 'array',
                    },
                  },
                  required: ['restricted_file_paths'],
                  type: 'object',
                },
                type: {
                  const: 'file_path_restriction',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'Max File Path Length Rule',
              description:
                'Prevent commits that include file paths that exceed a specified character limit from being pushed to the commit graph.',
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: {
                    max_file_path_length: {
                      type: 'number',
                    },
                  },
                  required: ['max_file_path_length'],
                  type: 'object',
                },
                type: {
                  const: 'max_file_path_length',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'File Extension Restriction Rule',
              description:
                'Prevent commits that include files with specified file extensions from being pushed to the commit graph.',
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: {
                    restricted_file_extensions: {
                      description:
                        'The file extensions that are restricted from being pushed to the commit graph.',
                      items: {
                        type: 'string',
                      },
                      type: 'array',
                    },
                  },
                  required: ['restricted_file_extensions'],
                  type: 'object',
                },
                type: {
                  const: 'file_extension_restriction',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'Max File Size Rule',
              description:
                'Prevent commits that exceed a specified file size limit from being pushed to the commit.',
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: {
                    max_file_size: {
                      description:
                        'The maximum file size allowed in megabytes. This limit does not apply to Git Large File Storage (Git LFS).',
                      type: 'number',
                    },
                  },
                  required: ['max_file_size'],
                  type: 'object',
                },
                type: {
                  const: 'max_file_size',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
            {
              title: 'Workflows Rule',
              description:
                'Require all changes made to a targeted branch to pass the specified workflows before they can be merged.',
              additionalProperties: false,
              properties: {
                parameters: {
                  additionalProperties: false,
                  properties: {
                    workflows: {
                      description:
                        'Workflows that must pass for this rule to pass.',
                      items: {
                        additionalProperties: false,
                        properties: {
                          path: {
                            description: 'The path to the workflow file',
                            type: 'string',
                          },
                          ref: {
                            description:
                              'The ref (branch or tag) of the workflow file to use',
                            type: 'string',
                          },
                          repository_id: {
                            description:
                              'The ID of the repository where the workflow is defined',
                            type: 'number',
                          },
                          sha: {
                            description:
                              'The commit SHA of the workflow file to use',
                            type: 'string',
                          },
                        },
                        required: ['path', 'repository_id'],
                        type: 'object',
                      },
                      type: 'array',
                    },
                  },
                  required: ['workflows'],
                  type: 'object',
                },
                type: {
                  const: 'workflows',
                  type: 'string',
                },
              },
              required: ['type'],
              type: 'object',
            },
          ],
        },
        type: 'array',
      },
      target: {
        title: 'Ruleset Target',
        description: `The target of the ruleset.`,
        enum: ['branch', 'tag', 'push'],
        type: 'string',
      },
    },
    required: ['name', 'enforcement'],
    type: 'object',
  },
  type: 'array',
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
export { repoVariables };
export { secrets };
export { oidcCustomization };
export { customProperties };
export { rulesets };
