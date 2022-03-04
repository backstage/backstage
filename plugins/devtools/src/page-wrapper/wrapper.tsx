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

import React, { PropsWithChildren, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Tabs, Tab, createStyles, makeStyles } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';

import { PageName, pages, pageMap } from './pages';
import { devtoolsRouteRef } from '..';

const useStyles = makeStyles(() =>
  createStyles({
    wrappedChild: {
      marginTop: 8,
    },
  }),
);

export interface PageWrapperProps {
  page: PageName;
}

export function PageWrapper(props: PropsWithChildren<PageWrapperProps>) {
  const curPage = pageMap[props.page];

  const rootRoute = useRouteRef(devtoolsRouteRef);
  const classes = useStyles();
  const navigate = useNavigate();

  const handleChangeTab = useCallback(
    (_ev, tab) => {
      navigate(`${rootRoute()}/${tab}`);
    },
    [navigate, rootRoute],
  );

  return (
    <Page themeId="tool">
      <Header title="DevTools" subtitle={curPage.subtitle} />
      <Content>
        <Tabs
          value={props.page}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeTab}
          aria-label="disabled tabs example"
        >
          {pages.map(page => (
            <Tab key={page.name} value={page.name} label={page.title} />
          ))}
        </Tabs>
        <div className={classes.wrappedChild}>
          <ContentHeader title={curPage.title}>
            <SupportButton>{curPage.subtitle}</SupportButton>
          </ContentHeader>
        </div>
        <div className={classes.wrappedChild}>{props.children}</div>
      </Content>
    </Page>
  );
}
