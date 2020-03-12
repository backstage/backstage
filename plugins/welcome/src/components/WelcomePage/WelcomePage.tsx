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
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Grid } from '@material-ui/core';
import Timer from '../Timer';
import {
  Content,
  InfoCard,
  Header,
  Page,
  pageTheme,
  ContentHeader,
  SupportButton,
} from '@spotify-backstage/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const WelcomePage: FC<{}> = () => {
  const profile = { givenName: '' };

  return (
    <Page theme={pageTheme.home}>
      <Header
        title={`Welcome ${profile.givenName || 'to Backstage'}`}
        subtitle="Some quick intro and links."
      >
        <Timer />
      </Header>
      <Content>
        <ContentHeader title="Getting Started">
          <SupportButton />
        </ContentHeader>
        <Grid container>
          <Grid item xs={12} md={6}>
            <InfoCard maxWidth>
              <Typography variant="body1" gutterBottom>
                You now have a running instance of Backstage!
                <span role="img" aria-label="confetti">
                  🎉
                </span>
                Let's make sure you get the most out of this platform by walking
                you through the basics.
              </Typography>
              <Typography variant="h6" gutterBottom>
                The Setup
              </Typography>
              <Typography variant="body1" paragraph>
                Backstage is put together from three base concepts: the core,
                the app and the plugins.
              </Typography>
              <ul>
                <li>The core is responsible for base functionality.</li>
                <li>The app provides the base UI and connects the plugins.</li>
                <li>
                  The plugins make Backstage useful for the end users with
                  specific views and functionality.
                </li>
              </ul>
              <Typography variant="h6" gutterBottom>
                Try It Out
              </Typography>
              <Typography variant="body1" paragraph>
                We suggest you either check out the documentation for{' '}
                <Link href="https://github.com/spotify/backstage#plugins">
                  creating a plugin
                </Link>{' '}
                or have a look in the code for the{' '}
                <Link component={RouterLink} to="/home">
                  Home Page
                </Link>{' '}
                in the directory "plugins/home-page/src".
              </Typography>
            </InfoCard>
          </Grid>
          <Grid item>
            <InfoCard>
              <Typography variant="h5">Quick Links</Typography>
              <List>
                <ListItem>
                  <Link href="https://backstage.io">backstage.io</Link>
                </ListItem>
                <ListItem>
                  <Link href="https://github.com/spotify/backstage#plugins">
                    Create a plugin
                  </Link>
                </ListItem>
              </List>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export default WelcomePage;
