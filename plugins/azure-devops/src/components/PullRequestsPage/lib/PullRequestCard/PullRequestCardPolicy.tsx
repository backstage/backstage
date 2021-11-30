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
  Policy,
  PolicyEvaluationStatus,
  PolicyType,
} from '@backstage/plugin-azure-devops-common';
import { styled, withStyles } from '@material-ui/core/styles';

import CancelIcon from '@material-ui/icons/Cancel';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import React from 'react';
import WatchLaterIcon from '@material-ui/icons/WatchLater';

const PolicyRequiredIcon = withStyles(
  theme => ({
    root: {
      color: theme.palette.info.main,
    },
  }),
  { name: 'PolicyRequiredIcon' },
)(WatchLaterIcon);

const PolicyIssueIcon = withStyles(
  theme => ({
    root: {
      color: theme.palette.error.main,
    },
  }),
  { name: 'PolicyIssueIcon' },
)(CancelIcon);

const PolicyInProgressIcon = withStyles(
  theme => ({
    root: {
      color: theme.palette.info.main,
    },
  }),
  { name: 'PolicyInProgressIcon' },
)(GroupWorkIcon);

function getPolicyIcon(policy: Policy): JSX.Element | null {
  switch (policy.type) {
    case PolicyType.Build:
      switch (policy.status) {
        case PolicyEvaluationStatus.Running:
          return <PolicyInProgressIcon />;
        case PolicyEvaluationStatus.Rejected:
          return <PolicyIssueIcon />;
        case PolicyEvaluationStatus.Queued:
          return <PolicyRequiredIcon />;
        default:
          return null;
      }
    case PolicyType.MinimumReviewers:
      return <PolicyRequiredIcon />;
    case PolicyType.Status:
    case PolicyType.Comments:
      return <PolicyIssueIcon />;
    default:
      return null;
  }
}

const PullRequestCardPolicyContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
});

type PullRequestCardPolicyProps = {
  policy: Policy;
};

export const PullRequestCardPolicy = ({
  policy,
}: PullRequestCardPolicyProps) => (
  <PullRequestCardPolicyContainer>
    {getPolicyIcon(policy)} <span>{policy.text}</span>
  </PullRequestCardPolicyContainer>
);
