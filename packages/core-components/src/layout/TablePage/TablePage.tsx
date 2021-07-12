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

import React from 'react';
import { Grid } from '@material-ui/core';

import { Content, ContentHeader, SupportButton, Button } from '../..';
import { Layout, IProps as LayoutProps } from './Layout';
import { Link as RouterLink } from 'react-router-dom';

interface ILinkProps {
  contentLink?: string;
  contentLinkText?: string;
}

type IProps = LayoutProps &
  ILinkProps & {
    contentTitle: string;
    supportMessage: string;
    filter: React.ReactNode;
  };

const TablePageLink = ({ contentLink, contentLinkText }: ILinkProps) => {
  return contentLink && contentLinkText ? (
    <Button
      component={RouterLink}
      variant="contained"
      color="primary"
      to={contentLink}
    >
      {contentLinkText}
    </Button>
  ) : null;
};

export const TablePage = ({
  supportMessage,
  filter,
  children,
  contentTitle,
  contentLink,
  contentLinkText,
  ...props
}: React.PropsWithChildren<IProps>) => (
  <Layout {...props}>
    <Content>
      <ContentHeader title={contentTitle}>
        <TablePageLink
          contentLink={contentLink}
          contentLinkText={contentLinkText}
        />
        <SupportButton>{supportMessage}</SupportButton>
      </ContentHeader>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} lg={2}>
          {filter}
        </Grid>
        <Grid item xs={12} sm={12} lg={10}>
          {children}
        </Grid>
      </Grid>
    </Content>
  </Layout>
);
