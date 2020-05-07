import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ContentHeader, SupportButton } from '@backstage/core';
import { Button, IconButton, Box, Typography } from '@material-ui/core';
import { Settings as SettingsIcon, ArrowBack } from '@material-ui/icons';
export const PluginHeader: React.FC<{ title?: string }> = ({
  title = 'Circle CI',
}) => {
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
