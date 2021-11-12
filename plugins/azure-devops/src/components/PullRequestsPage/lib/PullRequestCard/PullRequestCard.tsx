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

import { Avatar, Link } from '@backstage/core-components';
import { Card, CardContent, CardHeader } from '@material-ui/core';

import { AutoCompleteIcon } from '../AutoCompleteIcon';
import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
import { DateTime } from 'luxon';
import { PullRequestCardPolicies } from './PullRequestCardPolicies';
import { PullRequestCardReviewers } from './PullRequestCardReviewers';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  theme => ({
    card: {
      backgroundColor:
        theme.palette.type === 'dark'
          ? theme.palette.grey[700]
          : theme.palette.common.white,
    },
    cardHeaderSimplified: {
      paddingBottom: theme.spacing(2),
    },
    cardHeaderAction: {
      display: 'flex',
      alignSelf: 'center',
      margin: 0,
    },
    content: {
      display: 'flex',
      flexDirection: 'row',
    },
    policies: {
      flex: 1,
    },
  }),
  { name: 'PullRequestCard' },
);

type PullRequestCardProps = {
  pullRequest: DashboardPullRequest;
  simplified?: boolean;
};

export const PullRequestCard = ({
  pullRequest,
  simplified,
}: PullRequestCardProps) => {
  const title = (
    <Link to={pullRequest.link ?? ''} title={pullRequest.description}>
      {pullRequest.title}
    </Link>
  );

  const subheader = (
    <span>
      <Link to={pullRequest.repository?.url ?? ''} color="inherit">
        {pullRequest.repository?.name}
      </Link>{' '}
      ·{' '}
      {pullRequest.creationDate &&
        DateTime.fromISO(pullRequest.creationDate).toRelative()}
    </span>
  );

  const avatar = (
    <Avatar
      displayName={pullRequest.createdBy?.displayName}
      picture={pullRequest.createdBy?.imageUrl}
      customStyles={{ width: '2.5rem', height: '2.5rem', fontSize: '1rem' }}
    />
  );

  const classes = useStyles();

  return (
    <Card
      classes={{ root: classes.card }}
      data-pull-request-id={pullRequest.pullRequestId}
    >
      <CardHeader
        avatar={avatar}
        title={title}
        subheader={subheader}
        action={
          <AutoCompleteIcon hasAutoComplete={pullRequest.hasAutoComplete} />
        }
        classes={{
          ...(simplified && { root: classes.cardHeaderSimplified }),
          action: classes.cardHeaderAction,
        }}
      />

      {!simplified && (
        <CardContent className={classes.content}>
          {pullRequest.policies && (
            <PullRequestCardPolicies
              policies={pullRequest.policies}
              className={classes.policies}
            />
          )}

          {pullRequest.reviewers && (
            <PullRequestCardReviewers reviewers={pullRequest.reviewers} />
          )}
        </CardContent>
      )}
    </Card>
  );
};
