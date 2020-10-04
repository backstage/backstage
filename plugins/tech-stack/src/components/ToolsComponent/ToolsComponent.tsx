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
// /*

import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core';

import ToolsCardComponent from '../ToolsCardComponent';

import { ToolsListConfig } from '../../config/ToolsListConfig';

import { toolsListConfigFill } from '../../utils/ToolsComponentUtils';

const ToolsListConfigFilled = toolsListConfigFill(ToolsListConfig);

const ToolsComponent: FC<{}> = () => {
  return (
    <Page theme={pageTheme.tool}>
      <Header title="Our Tech Stacks!" subtitle="">
        <HeaderLabel label="Owner" value="easylo" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Links of our tools">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="row">
          {ToolsListConfigFilled.map((tool: Tools, index: Number) => (
            <ToolsCardComponent tool={tool} key={index.toString()} />
          ))}
        </Grid>
      </Content>
    </Page>
  );
};

export default ToolsComponent;
