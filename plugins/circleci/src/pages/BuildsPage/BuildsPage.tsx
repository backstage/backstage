import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Content,
  ContentHeader,
  SupportButton,
  InfoCard,
} from '@backstage/core';
import { Button, Grid } from '@material-ui/core';
import { CircleCIFetch } from 'components/CircleCIFetch';
import { Settings as SettingsIcon } from '@material-ui/icons';

export const BuildsPage: FC<{}> = () => (
  <Content>
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
    <Grid container spacing={3} direction="column">
      <Grid item>
        <InfoCard title="Pipelines">
          <CircleCIFetch />
        </InfoCard>
      </Grid>
    </Grid>
  </Content>
);
