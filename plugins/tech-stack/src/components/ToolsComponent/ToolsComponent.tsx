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
//  * Copyright 2020 Spotify AB
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

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

import { ToolsListConfig } from '../../ToolsListConfig';

import * as ToolsDefaultConfig from '../../ToolsDefaultConfig.json';

ToolsListConfig.forEach(function loadToolsListConfig(ToolsListItem) {
  ToolsDefaultConfig.config.forEach(function loadToolsDefaultConfig(
    ToolsDefaultItem,
  ) {
    if (
      ToolsListItem.type !== 'custom' &&
      ToolsListItem.type.toLowerCase() === ToolsDefaultItem?.type.toLowerCase()
    ) {
      ToolsListItem.type = ToolsDefaultItem!.type;
      ToolsListItem.src = ToolsDefaultItem!.src;
      ToolsListItem.caption = ToolsDefaultItem!.caption!;
      ToolsListItem.homepage = ToolsDefaultItem!.homepage;
      if (
        typeof ToolsListItem.scm === 'undefined' ||
        ToolsListItem.scm?.length === 0
      ) {
        ToolsListItem.scm = '';
      }
    }
  });
});

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
          {ToolsListConfig.map(tool => (
            <ToolsCardComponent tool={tool} />
          ))}
        </Grid>
      </Content>
    </Page>
  );
};

export default ToolsComponent;
