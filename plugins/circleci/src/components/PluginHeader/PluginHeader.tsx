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
      <SupportButton>
        This plugin allows you to view and interact with your builds within the
        Circle CI environment.
      </SupportButton>
    </ContentHeader>
  );
};
