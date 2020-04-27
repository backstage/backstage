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
import {
  Header,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core';
import { useSettings } from 'hooks/useSettings';
import { Context } from 'contexts/Context';
import Dashboard from 'components/Dashboard';

const Home: FC<{}> = () => {
  const settings = useSettings();

  return (
    <Page theme={pageTheme.tool}>
      <Header
        title="Google Analytics Dashboard"
        subtitle="Quick glance at your GA metrics"
      >
        <HeaderLabel label="Owner" value="Spotify" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <Context.Provider value={settings}>
          <ContentHeader title={settings?.view?.name ?? 'Home'}>
            <SupportButton>
              A description of your plugin goes here.
            </SupportButton>
            <button
              className="g-signin2"
              style={{
                border: 'none',
                backgroundColor: 'inherit',
                display: 'none',
              }}
              id="loginButton"
            >
              Login with Google
            </button>
          </ContentHeader>
          <Dashboard />
        </Context.Provider>
      </Content>
    </Page>
  );
};

export default Home;
