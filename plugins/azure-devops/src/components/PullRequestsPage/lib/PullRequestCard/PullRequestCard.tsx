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
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

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
    avatar: { width: '2.5rem', height: '2.5rem' },
    avatarText: { fontSize: '1rem' },
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
  const classes = useStyles();

  const title = (
    <Link to={pullRequest.link ?? ''} title={pullRequest.description}>
      {pullRequest.title}
    </Link>
  );

  const repoLink = (
    <Link to={pullRequest.repository?.url ?? ''} color="inherit">
      {pullRequest.repository?.name}
    </Link>
  );

  const creationDate = pullRequest.creationDate
    ? DateTime.fromISO(pullRequest.creationDate).toRelative()
    : undefined;

  const subheader = (
    <Typography component="span">
      {repoLink} · {creationDate}
    </Typography>
  );

  const avatar = (
    <Avatar
      displayName={pullRequest.createdBy?.displayName}
      picture={pullRequest.createdBy?.imageUrl}
      classes={{ avatar: classes.avatar, avatarText: classes.avatarText }}
    />
  );

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
