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
import { createDevApp } from '@backstage/dev-utils';
import { EntityAirbrakeContent, airbrakePlugin } from '../src/plugin';
import {
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  Page,
  SupportButton,
} from '@backstage/core-components';

createDevApp()
  .registerPlugin(airbrakePlugin)
  .addPage({
    element: (
      <Page themeId="tool">
        <Header
          title="Airbrake demo application"
          subtitle="Test the plugin below"
        >
          <HeaderLabel label="Owner" value="Owner" />
          <HeaderLabel label="Lifecycle" value="Alpha" />
        </Header>
        <Content>
          <ContentHeader title="Airbrake">
            <SupportButton>
              A description of your plugin goes here.
            </SupportButton>
          </ContentHeader>
          <EntityAirbrakeContent />
        </Content>
      </Page>
    ),
    title: 'Root Page',
    path: '/airbrake',
  })
  .render();
