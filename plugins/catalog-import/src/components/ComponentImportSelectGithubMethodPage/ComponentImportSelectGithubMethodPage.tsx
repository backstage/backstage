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
import { Link as NavLink } from 'react-router-dom';
import {
  Content,
  ContentHeader,
  Header,
  Link,
  Page,
} from '@backstage/core-components';
import {
  Box,
  Breadcrumbs,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import SearchIcon from '@material-ui/icons/Search';
import { useParams } from 'react-router';

export const ComponentImportSelectGithubMethodPage = () => {
  const { host, org } = useParams();
  return (
    <Page themeId="tool">
      <Header title="Catalog Import" />
      <Content>
        <Box mb={2}>
          <Breadcrumbs aria-label="breadcrumb">
            <NavLink color="inherit" to="/catalog-import">
              Import
            </NavLink>
            <NavLink color="inherit" to="/catalog-import/components">
              Software components
            </NavLink>
            <NavLink
              color="inherit"
              to={`/catalog-import/components/github/${host}`}
            >
              Organization
            </NavLink>
            <Typography color="textPrimary">How to import</Typography>
          </Breadcrumbs>
        </Box>
        <ContentHeader title={`How do you want to import from ${org}?`} />
        <Grid container>
          <Grid item xs={8}>
            <Card raised>
              <CardActionArea>
                <NavLink
                  to={`/catalog-import/components/github/${host}/${org}/discovery`}
                >
                  <CardHeader
                    avatar={<SearchIcon style={{ verticalAlign: 'middle' }} />}
                    title="Set up discovery"
                    titleTypographyProps={{ variant: 'h5' }}
                  />
                  <CardContent>
                    <Typography paragraph>
                      GitHub discovery adds a wildcarded URL that is
                      continuously checked for new software components. Current
                      and future components that exist in this organization will
                      be registered in the software catalog.
                    </Typography>
                    <Typography>
                      This is more demanding on the GitHub API than direct
                      registration; we recommend using a{' '}
                      <Link to="https://backstage.io/docs/plugins/github-apps">
                        GitHub App integration
                      </Link>{' '}
                      instead of an access token, since it has higher API rate
                      limits.
                    </Typography>
                  </CardContent>
                </NavLink>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={8}>
            <Card raised>
              <CardActionArea>
                <NavLink
                  to={`/catalog-import/components/github/${host}/${org}/repositories`}
                >
                  <CardHeader
                    avatar={<CheckIcon style={{ verticalAlign: 'middle' }} />}
                    title="Select repositories to import"
                    titleTypographyProps={{ variant: 'h5' }}
                  />
                  <CardContent>
                    <Typography paragraph>
                      Selecting repositories allows a one-time direct import of
                      software components.
                    </Typography>
                    <Typography>
                      This is less demanding on the GitHub API, and makes sense
                      if you plan to use Backstage software templates with
                      automatic registration in the future.
                    </Typography>
                  </CardContent>
                </NavLink>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
