/*
 * Copyright 2024 The Backstage Authors
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
import { Typography, Grid, Card, CardContent } from '@material-ui/core';
import { InfoCard, Header, Page, Content } from '@backstage/core-components';
import { WelcomeOutlined } from '@material-ui/icons';

export const WelcomePage = () => (
  <Page themeId="tool">
    <Header title="Welcome" subtitle="Welcome to your Backstage portal">
      <WelcomeOutlined />
    </Header>
    <Content>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <InfoCard title="Welcome to Backstage!">
            <Typography variant="body1" paragraph>
              Welcome to your developer portal! This is a simple example plugin
              that demonstrates the basic structure of a Backstage frontend plugin.
            </Typography>
            <Typography variant="body1" paragraph>
              Backstage is an open source framework for building developer portals.
              It helps you manage your microservices and infrastructure, and provides
              a unified developer experience.
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Getting Started
              </Typography>
              <Typography variant="body2">
                Explore the different sections of this portal to discover tools,
                documentation, and services available to your team.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Plugin Development
              </Typography>
              <Typography variant="body2">
                This welcome plugin serves as an example of how to create
                new plugins for your Backstage instance.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Content>
  </Page>
);