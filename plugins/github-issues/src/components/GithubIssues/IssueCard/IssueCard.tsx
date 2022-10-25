/*
 * Copyright 2022 The Backstage Authors
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

import { Link } from '@backstage/core-components';
import { Box, CardActionArea, Paper, Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { DateTime } from 'luxon';
import React from 'react';
import { Assignees } from './Assignees';
import { CommentsCount } from './CommentsCount';

type IssueCardProps = {
  title: string;
  createdAt: string;
  updatedAt?: string;
  url: string;
  authorName: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  authorAvatar?: string;
  repositoryName: string;
  commentsCount: number;
  even: boolean;
};

const getElapsedTime = (isoDate: string) =>
  DateTime.fromISO(isoDate).toRelative();

export const IssueCard = (props: IssueCardProps) => {
  const {
    title,
    createdAt,
    updatedAt,
    url,
    assigneeName,
    assigneeAvatar,
    authorName,
    repositoryName,
    commentsCount,
  } = props;

  return (
    <Box marginBottom={1} data-testid={`issue-${url}`}>
      <Paper variant="outlined">
        <CardActionArea href={url} target="_blank">
          <Box padding={1}>
            <Box display="flex" justifyContent="space-between">
              <Link to={`${url.substring(0, url.lastIndexOf('/'))}`}>
                {repositoryName}
              </Link>
              <Assignees name={assigneeName} avatar={assigneeAvatar} />
            </Box>
            <Box>
              <Typography component="h2">
                <b>{title}</b>
              </Typography>
            </Box>
            <Divider variant="middle" />
            <Box display="flex" justifyContent="space-between">
              <Box marginY={1}>
                <Typography variant="body2" component="p">
                  Created at: <strong>{getElapsedTime(createdAt)}</strong> by{' '}
                  <strong>{authorName}</strong>
                </Typography>
                {updatedAt && (
                  <Typography variant="body2" component="p">
                    Last update at: <strong>{getElapsedTime(updatedAt)}</strong>
                  </Typography>
                )}
              </Box>
              {commentsCount > 0 && (
                <CommentsCount commentsCount={commentsCount} />
              )}
            </Box>
          </Box>
        </CardActionArea>
      </Paper>
    </Box>
  );
};
