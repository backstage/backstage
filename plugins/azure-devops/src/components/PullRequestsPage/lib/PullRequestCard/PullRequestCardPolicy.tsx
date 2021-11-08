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

import { styled, withStyles } from '@material-ui/core/styles';

import CancelIcon from '@material-ui/icons/Cancel';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import { Policy } from '../../../../api/types';
import React from 'react';
import WatchLaterIcon from '@material-ui/icons/WatchLater';

export const PolicyRequiredIcon = withStyles(
  theme => ({
    root: {
      color: theme.palette.info.main,
    },
  }),
  { name: 'PolicyRequiredIcon' },
)(WatchLaterIcon);

export const PolicyIssueIcon = withStyles(
  theme => ({
    root: {
      color: theme.palette.error.main,
    },
  }),
  { name: 'PolicyIssueIcon' },
)(CancelIcon);

export const PolicyInProgressIcon = withStyles(
  theme => ({
    root: {
      color: theme.palette.info.main,
    },
  }),
  { name: 'PolicyInProgressIcon' },
)(GroupWorkIcon);

const PullRequestCardPolicyContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
});

type PullRequestCardPolicyProps = {
  policy: Policy;
  icon: React.ReactNode;
};

export const PullRequestCardPolicy = ({
  policy,
  icon,
}: PullRequestCardPolicyProps) => (
  <PullRequestCardPolicyContainer>
    {icon} <span>{policy.text}</span>
  </PullRequestCardPolicyContainer>
);
