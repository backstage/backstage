/*
 * Copyright 2022 The Backstage Authors
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
import { ScoreCardTable } from '../ScoreCardTable';

export const ScoreBoardPage = () => (
  <Page themeId="tool">
    <Header title="Score board" subtitle="Overview of system scores">
      <HeaderLabel label="Maintainer" value="Oriflame" />
      <HeaderLabel label="Status" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="">
        <SupportButton>
          In this table you may see overview of system scores.
        </SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <ScoreCardTable />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
