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
import { Layout } from 'components/Layout';

export const BuildsPage: FC<{}> = () => (
  <Layout>
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
          <InfoCard>
            <CircleCIFetch />
          </InfoCard>
        </Grid>
      </Grid>
    </Content>
  </Layout>
);
