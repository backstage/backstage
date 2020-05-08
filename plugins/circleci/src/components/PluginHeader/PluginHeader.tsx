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
import React, { FC } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ContentHeader, SupportButton } from '@backstage/core';
import { Button, IconButton, Box, Typography } from '@material-ui/core';
import { Settings as SettingsIcon, ArrowBack } from '@material-ui/icons';

export type Props = { title?: string };
export const PluginHeader: FC<Props> = ({ title = 'Circle CI' }) => {
  const location = useLocation();
  const notRoot = !location.pathname.match(/\/circleci\/?$/);
  const isSettingsPage = location.pathname.match(/\/circleci\/settings\/?/);
  return (
    <ContentHeader
      title={title}
      titleComponent={() => (
        <Box alignItems="center" display="flex">
          {notRoot && (
            <IconButton component={RouterLink} to="/circleci">
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h4">{title}</Typography>
        </Box>
      )}
    >
      {!isSettingsPage && (
        <Button
          component={RouterLink}
          to="/circleci/settings"
          startIcon={<SettingsIcon />}
        >
          Settings
        </Button>
      )}
      <SupportButton>A description of your plugin goes here.</SupportButton>
    </ContentHeader>
  );
};
