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

import React from 'react';
import { Grid, Button } from '@material-ui/core';
import {
  Header,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core';
import { Entity } from '@backstage/catalog-model';

export const ArgocdIframe = ({ entity }: { entity?: Entity }) => {
  return (
    <>
      <ContentHeader title="">
        <Button
          variant="contained"
          color="primary"
          href={entity?.metadata.annotations?.['argocd/endpoint']}
        >
          Go To ArgoCD
        </Button>
      </ContentHeader>
      <iframe
        title="argocd"
        src={entity?.metadata.annotations?.['argocd/endpoint']}
        height="100%"
        width="100%"
        frameBorder="0"
      />
    </>
  );
};

const ArgocdPage = ({ entity }: { entity?: Entity }) => (
  <Page theme={pageTheme.tool}>
    <Header title="Welcome to ArgoCD!">
      <HeaderLabel label="Owner" value="trivago" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="ArgoCD plugin">
        <SupportButton>Plugin to show a ArgoCD interface</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <ArgocdIframe entity={entity} />
        </Grid>
      </Grid>
    </Content>
  </Page>
);

export default ArgocdPage;
