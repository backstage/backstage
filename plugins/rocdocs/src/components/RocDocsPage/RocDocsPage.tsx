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

import { Content, Header, Page, useApi } from '@backstage/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';

import { Renderer } from '../..';
import { rocdocsApiRef } from '../../api';
import { RocDocsMenu } from '../RocDocsMenu';
import Grid from '@material-ui/core/Grid';

export const RocDocsPage = ({ renderer }: { renderer: Renderer }) => {
  const rocdocsApi = useApi(rocdocsApiRef);
  const { namespace, kind, name, '*': path } = useParams();

  const { value, error } = useAsync(async () => {
    return await rocdocsApi.getDocs({ namespace, kind, name }, path);
  }, [name, kind, namespace, path]);

  if (error) return <div>Error {error}</div>;

  return value ? (
    <Page themeId="documentation">
      <Header title={`${kind} / ${name}`} type="documentation" />
      <Content>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <RocDocsMenu menuData={value.menu.nav} />
          </Grid>
          <Grid item xs={9}>
            <div dangerouslySetInnerHTML={{ __html: renderer(value.page) }} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  ) : null;
};
