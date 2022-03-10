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
import { GithubOrganizationList } from '../GithubOrganizationList';
import { useParams } from 'react-router';
import { Box, Typography } from '@material-ui/core';

export const ComponentImportSelectGithubOrgPage = () => {
  const { host } = useParams();
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
            <Typography color="textPrimary">Organization</Typography>
          </Breadcrumbs>
        </Box>
        <GithubOrganizationList host={host} />
      </Content>
    </Page>
  );
};
