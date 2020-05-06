import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ContentHeader, SupportButton } from '@backstage/core';
import { Button } from '@material-ui/core';
import { Settings as SettingsIcon } from '@material-ui/icons';

export const PluginHeader = () => (
  <ContentHeader title="Circle CI">
    <Button
      component={RouterLink}
      to="/circleci/settings"
      startIcon={<SettingsIcon />}
    >
      Settings
    </Button>
    <SupportButton>A description of your plugin goes here.</SupportButton>
  </ContentHeader>
);
