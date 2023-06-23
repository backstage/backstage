/*
 * Copyright 2023 The Backstage Authors
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
import React, { Fragment } from 'react';
import { IconButton } from '@material-ui/core';
import {
  Header,
  Page,
  HeaderLabel,
  TabbedLayout,
  Content,
} from '@backstage/core-components';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import { ExecutionsTable } from '../ExecutionsTable';
import { PacksTable } from '../PacksTable/PacksTable';
import { ActionsList } from '../ActionsList';

export type StackstormHomeProps = {
  title?: string;
  subtitle?: string;
  headerButtons?: React.ReactNode[];
};
export const StackstormHome = (props: StackstormHomeProps) => (
  <Page themeId="tool">
    <Header
      title={props.title || 'Welcome to StackStorm!'}
      subtitle={props.subtitle || 'Event-driven automation'}
    >
      {props.headerButtons ? (
        props.headerButtons.map((headerButton, idx) => (
          <Fragment key={idx}>{headerButton}</Fragment>
        ))
      ) : (
        <IconButton aria-label="Docs" href="https://docs.stackstorm.com/">
          <LibraryBooks htmlColor="white" />
        </IconButton>
      )}
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <TabbedLayout>
      <TabbedLayout.Route path="/history" title="Executions">
        <Content noPadding>
          <ExecutionsTable />
        </Content>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/packs" title="Packs">
        <Content noPadding>
          <PacksTable />
        </Content>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/actions" title="Actions">
        <Content noPadding>
          <ActionsList />
        </Content>
      </TabbedLayout.Route>
    </TabbedLayout>
  </Page>
);
