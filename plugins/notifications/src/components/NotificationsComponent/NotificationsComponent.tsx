/*
 * Copyright 2021 The Backstage Authors
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
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';
import { NotificationsFetchComponent } from '../NotificationsFetchComponent';

export const NotificationsComponent = () => {
  const identityApi = useApi(identityApiRef);
  const userId = identityApi.getUserId();
  const profile = identityApi.getProfile();
  const displayName = profile.displayName ?? userId;

  return (
    <Page themeId="tool">
      <Header title="Notifications!">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title={`Welcome, ${displayName}`}>
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Grid container>
          <Grid item xs={12}>
            <NotificationsFetchComponent userId={userId} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
