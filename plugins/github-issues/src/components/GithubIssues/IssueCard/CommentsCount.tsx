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

import React from 'react';
import { ChatIcon } from '@backstage/core-components';
import { Box, Badge } from '@material-ui/core';

type CommentsCountProps = {
  commentsCount: number;
};

export const CommentsCount = (props: CommentsCountProps) => {
  const { commentsCount } = props;

  return (
    <Box
      marginBottom={1}
      style={{ marginRight: '12px' }}
      display="flex"
      justifyContent="flex-start"
      alignSelf="flex-end"
    >
      <Badge badgeContent={commentsCount} color="primary">
        <ChatIcon />
      </Badge>
    </Box>
  );
};
