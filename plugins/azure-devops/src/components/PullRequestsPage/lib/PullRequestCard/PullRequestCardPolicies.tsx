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
  PolicyInProgressIcon,
  PolicyIssueIcon,
  PolicyRequiredIcon,
  PullRequestCardPolicy,
} from './PullRequestCardPolicy';

import { Policy } from '../../../../api/types';
import React from 'react';

function getPullRequestCardPolicy(policy: Policy): JSX.Element | null {
  switch (policy.type) {
    case 'Build':
      switch (policy.status) {
        case 'Running':
          return (
            <PullRequestCardPolicy
              policy={policy}
              icon={<PolicyInProgressIcon />}
            />
          );
        case 'Rejected':
          return (
            <PullRequestCardPolicy policy={policy} icon={<PolicyIssueIcon />} />
          );
        case 'Queued':
          return (
            <PullRequestCardPolicy
              policy={policy}
              icon={<PolicyRequiredIcon />}
            />
          );
        default:
          return null;
      }
    case 'MinimumReviewers':
      return (
        <PullRequestCardPolicy policy={policy} icon={<PolicyRequiredIcon />} />
      );
    case 'Status':
    case 'Comments':
      return (
        <PullRequestCardPolicy policy={policy} icon={<PolicyIssueIcon />} />
      );
    default:
      return null;
  }
}

type PullRequestCardProps = {
  policies: Policy[];
  className: string;
};

export const PullRequestCardPolicies = ({
  policies,
  className,
}: PullRequestCardProps) => (
  <div className={className}>{policies.map(getPullRequestCardPolicy)}</div>
);
