/*
 * Copyright 2020 Spotify AB
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
import { ContentHeader, SupportButton } from '@backstage/core';
import { Box, Typography } from '@material-ui/core';

export type Props = { title?: string };
export const PluginHeader = ({ title = 'Jenkins' }) => {
  return (
    <ContentHeader
      title={title}
      titleComponent={() => (
        <Box alignItems="center" display="flex">
          <Typography variant="h4">{title}</Typography>
        </Box>
      )}
    >
      <SupportButton>
        This plugin allows you to view and interact with your builds in Jenkins.
      </SupportButton>
    </ContentHeader>
  );
};
