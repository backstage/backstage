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
import React, { PropsWithChildren, FunctionComponent } from 'react';
import { Box, Paper, CardActionArea } from '@material-ui/core';
import CardHeader from './CardHeader';

type Props = {
  title: string;
  createdAt: string;
  updatedAt?: string;
  prUrl: string;
  authorName: string;
  authorAvatar?: string;
  repositoryName: string;
};

const Card: FunctionComponent<Props> = (props: PropsWithChildren<Props>) => {
  const {
    title,
    createdAt,
    updatedAt,
    prUrl,
    authorName,
    authorAvatar,
    repositoryName,
    children,
  } = props;

  return (
    <Box marginBottom={1}>
      <Paper variant="outlined">
        <CardActionArea href={prUrl} target="_blank">
          <Box padding={1}>
            <CardHeader
              title={title}
              createdAt={createdAt}
              updatedAt={updatedAt}
              authorName={authorName}
              authorAvatar={authorAvatar}
              repositoryName={repositoryName}
            />
            {children}
          </Box>
        </CardActionArea>
      </Paper>
    </Box>
  );
};

export default Card;
