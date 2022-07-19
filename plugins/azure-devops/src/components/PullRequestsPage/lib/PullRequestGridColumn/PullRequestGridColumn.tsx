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

import { Paper, Typography, styled, withStyles } from '@material-ui/core';

import { PullRequestCard } from '../PullRequestCard';
import { PullRequestGroup } from '../types';
import React from 'react';

const ColumnPaper = withStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: theme.spacing(2),
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.grey[800]
        : theme.palette.grey[300],
    height: '100%',
  },
}))(Paper);

const ColumnTitleDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

export const PullRequestCardContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  '& > *': {
    marginBottom: theme.spacing(2),
  },
  '& > :last-of-type': {
    marginBottom: 0,
  },
}));

type PullRequestGridColumnProps = {
  pullRequestGroup: PullRequestGroup;
};

export const PullRequestGridColumn = ({
  pullRequestGroup,
}: PullRequestGridColumnProps) => {
  const columnTitle = (
    <ColumnTitleDiv>
      <Typography variant="h5">{pullRequestGroup.title}</Typography>
    </ColumnTitleDiv>
  );

  const pullRequests = (
    <PullRequestCardContainer>
      {pullRequestGroup.pullRequests.map(pullRequest => (
        <PullRequestCard
          key={pullRequest.pullRequestId}
          pullRequest={pullRequest}
          simplified={pullRequestGroup.simplified}
        />
      ))}
    </PullRequestCardContainer>
  );

  return (
    <ColumnPaper>
      {columnTitle}
      {pullRequests}
    </ColumnPaper>
  );
};
