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
import React, { FunctionComponent } from 'react';
import { Typography, Box, Tooltip, Chip } from '@material-ui/core';
import { getElapsedTime } from '../../utils/functions';
import { UserHeader } from '../UserHeader';
import { DraftPrIcon } from '../icons/DraftPr';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import { Labels } from '../../utils/types';
import { useFormClasses } from './styles';

type Props = {
  title: string;
  createdAt: string;
  updatedAt?: string;
  authorName: string;
  authorAvatar?: string;
  repositoryName: string;
  isDraft: boolean;
  repositoryIsArchived: boolean;
  labels?: Labels[];
};

const CardHeader: FunctionComponent<Props> = (props: Props) => {
  const classes = useFormClasses();

  const {
    title,
    createdAt,
    updatedAt,
    authorName,
    authorAvatar,
    repositoryName,
    isDraft,
    repositoryIsArchived,
    labels,
  } = props;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography color="textSecondary" variant="body2" component="p">
          {repositoryName}
        </Typography>
        <UserHeader name={authorName} avatar={authorAvatar} />
      </Box>
      <Box display="flex" justifyContent="left">
        {isDraft && (
          <Tooltip title="Draft PR">
            <Box display="flex" justifyContent="center" alignItems="center">
              <DraftPrIcon />
            </Box>
          </Tooltip>
        )}
        {repositoryIsArchived && (
          <Tooltip title="Repository is archived">
            <Box display="flex" justifyContent="center" alignItems="center">
              <UnarchiveIcon />
            </Box>
          </Tooltip>
        )}
      </Box>
      <Typography component="h3">
        <b>{title}</b>
      </Typography>
      <Box display="flex" justifyContent="space-between" marginY={1}>
        <Typography variant="body2" component="p">
          Created at: <strong>{getElapsedTime(createdAt)}</strong>
        </Typography>
        {updatedAt && (
          <Typography variant="body2" component="p">
            Last update: <strong>{getElapsedTime(updatedAt)}</strong>
          </Typography>
        )}
      </Box>
      {labels && (
        <Box display="flex" alignItems="center" flexWrap="wrap" paddingTop={1}>
          {labels.map(data => {
            return (
              <li key={data.id} className={classes.labelItem}>
                <Chip color="primary" label={data.name} size="small" />
              </li>
            );
          })}
        </Box>
      )}
    </>
  );
};

export default CardHeader;
