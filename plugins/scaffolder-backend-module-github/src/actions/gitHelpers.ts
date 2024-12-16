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

import { assertError } from '@backstage/errors';
import { Octokit } from 'octokit';
import { LoggerService } from '@backstage/backend-plugin-api';

type BranchProtectionOptions = {
  client: Octokit;
  owner: string;
  repoName: string;
  logger: LoggerService;
  requireCodeOwnerReviews: boolean;
  requiredStatusCheckContexts?: string[];
  bypassPullRequestAllowances?: {
    users?: string[];
    teams?: string[];
    apps?: string[];
  };
  requiredApprovingReviewCount?: number;
  restrictions?: {
    users: string[];
    teams: string[];
    apps?: string[];
  };
  requireBranchesToBeUpToDate?: boolean;
  requiredConversationResolution?: boolean;
  requireLastPushApproval: boolean;
  defaultBranch?: string;
  enforceAdmins?: boolean;
  dismissStaleReviews?: boolean;
  requiredCommitSigning?: boolean;
  requiredLinearHistory?: boolean;
};

export const enableBranchProtectionOnDefaultRepoBranch = async ({
  repoName,
  client,
  owner,
  logger,
  requireCodeOwnerReviews,
  bypassPullRequestAllowances,
  requiredApprovingReviewCount,
  restrictions,
  requiredStatusCheckContexts = [],
  requireBranchesToBeUpToDate = true,
  requiredConversationResolution = false,
  requireLastPushApproval = false,
  defaultBranch = 'master',
  enforceAdmins = true,
  dismissStaleReviews = false,
  requiredCommitSigning = false,
  requiredLinearHistory = false,
}: BranchProtectionOptions): Promise<void> => {
  const tryOnce = async () => {
    try {
      await client.rest.repos.updateBranchProtection({
        mediaType: {
          /**
           * 👇 we need this preview because allowing a custom
           * reviewer count on branch protection is a preview
           * feature
           *
           * More here: https://docs.github.com/en/rest/overview/api-previews#require-multiple-approving-reviews
           */
          previews: ['luke-cage-preview'],
        },
        owner,
        repo: repoName,
        branch: defaultBranch,
        required_status_checks: {
          strict: requireBranchesToBeUpToDate,
          contexts: requiredStatusCheckContexts,
        },
        restrictions: restrictions ?? null,
        enforce_admins: enforceAdmins,
        required_pull_request_reviews: {
          required_approving_review_count: requiredApprovingReviewCount,
          require_code_owner_reviews: requireCodeOwnerReviews,
          bypass_pull_request_allowances: bypassPullRequestAllowances,
          dismiss_stale_reviews: dismissStaleReviews,
          require_last_push_approval: requireLastPushApproval,
        },
        required_conversation_resolution: requiredConversationResolution,
        required_linear_history: requiredLinearHistory,
      });

      if (requiredCommitSigning) {
        await client.rest.repos.createCommitSignatureProtection({
          owner,
          repo: repoName,
          branch: defaultBranch,
        });
      }
    } catch (e) {
      assertError(e);
      if (
        e.message.includes(
          'Upgrade to GitHub Pro or make this repository public to enable this feature',
        )
      ) {
        logger.warn(
          'Branch protection was not enabled as it requires GitHub Pro for private repositories',
        );
      } else {
        throw e;
      }
    }
  };

  try {
    await tryOnce();
  } catch (e) {
    if (!e.message.includes('Branch not found')) {
      throw e;
    }

    // GitHub has eventual consistency. Fail silently, wait, and try again.
    await new Promise(resolve => setTimeout(resolve, 600));
    await tryOnce();
  }
};

export function entityRefToName(name: string): string {
  return name.replace(/^.*[:/]/g, '');
}
