/*
 * Copyright 2020 The Backstage Authors
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

import {
  Content,
  ContentHeader,
  Header,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { Grid, Input, makeStyles } from '@material-ui/core';
import React from 'react';
import { TechRadarComponentProps } from '../api';
import RadarComponent from '../components/RadarComponent';

const useStyles = makeStyles(() => ({
  overflowXScroll: {
    overflowX: 'scroll',
  },
}));

export type TechRadarPageProps = TechRadarComponentProps & {
  title?: string;
  subtitle?: string;
  pageTitle?: string;
};

export const RadarPage = ({
  title,
  subtitle,
  pageTitle,
  ...props
}: TechRadarPageProps): JSX.Element => {
  const classes = useStyles();
  const [searchText, setSearchText] = React.useState('');

  return (
    <Page themeId="tool">
      <Header title={title} subtitle={subtitle} />
      <Content className={classes.overflowXScroll}>
        <ContentHeader title={pageTitle}>
          <Input
            id="tech-radar-filter"
            type="search"
            placeholder="Filter"
            onChange={e => setSearchText(e.target.value)}
          />
          <SupportButton>
            This is used for visualizing the official guidelines of different
            areas of software development such as languages, frameworks,
            infrastructure and processes.
          </SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="row">
          <Grid item xs={12} sm={6} md={4}>
            <RadarComponent searchText={searchText} {...props} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

RadarPage.defaultProps = {
  title: 'Tech Radar',
  subtitle: 'Pick the recommended technologies for your projects',
  pageTitle: 'Company Radar',
};
