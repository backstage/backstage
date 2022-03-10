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
import {
  Breadcrumbs,
  Content,
  Header,
  Link,
  Page,
} from '@backstage/core-components';
import { Box, Typography } from '@material-ui/core';
import { useParams } from 'react-router';
import { GithubRepositoryList } from '../GithubRepositoryList';

export const ComponentImportSelectGithubRepoPage = () => {
  const { host, org } = useParams();
  return (
    <Page themeId="tool">
      <Header title="Catalog Import" />
      <Content>
        <Box mb={2}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/catalog-import">
              Import
            </Link>
            <Link color="inherit" to="/catalog-import/components">
              Software components
            </Link>
            <Link
              color="inherit"
              to={`/catalog-import/components/github/${host}`}
            >
              Organization
            </Link>
            <Typography color="textPrimary">Repositories</Typography>
          </Breadcrumbs>
        </Box>
        <GithubRepositoryList host={host} org={org} />
      </Content>
    </Page>
  );
};
