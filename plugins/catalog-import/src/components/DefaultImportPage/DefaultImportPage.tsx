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

import {
  Content,
  ContentHeader,
  Header,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@material-ui/core';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import React from 'react';
import { Link } from 'react-router-dom';
import { importComponentsRouteRef, importOrgRouteRef } from '../../plugin';

/**
 * The default catalog import page.
 *
 * @public
 */
export const DefaultImportPage = () => {
  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptional('app.title') || 'Backstage';
  const componentLink = useRouteRef(importComponentsRouteRef);
  const orgLink = useRouteRef(importOrgRouteRef);

  return (
    <Page themeId="home">
      <Header title="Catalog Import" />
      <Content>
        <ContentHeader title="What would you like to import?">
          <SupportButton>
            Import software or other entities into {appTitle} by adding it to
            the software catalog.
          </SupportButton>
        </ContentHeader>

        <Grid container>
          <Grid item xs={8}>
            <Card raised>
              <CardActionArea>
                <Link to={componentLink?.()}>
                  <CardHeader
                    avatar={<PlaylistAddIcon style={{ marginTop: 5 }} />}
                    title="Software components"
                    titleTypographyProps={{ variant: 'h5' }}
                  />
                  <CardContent>
                    <Typography>
                      Import software components such as services, websites,
                      libraries and APIs. These will be imported from a source
                      code repository.
                    </Typography>
                  </CardContent>
                </Link>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={8}>
            <Card raised>
              <CardActionArea>
                <Link to={orgLink?.()}>
                  <CardHeader
                    avatar={<GroupAddIcon style={{ marginTop: 5 }} />}
                    title="Organization data"
                    titleTypographyProps={{ variant: 'h5' }}
                  />
                  <CardContent>
                    <Typography>
                      Import users and groups from an external system such as
                      LDAP, GitHub, or Azure Active Directory.
                    </Typography>
                  </CardContent>
                </Link>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={8}>
            <Card aria-disabled="true" style={{ opacity: 0.5 }}>
              <CardHeader
                avatar={<CloudDownloadIcon style={{ marginTop: 5 }} />}
                title="Cloud resources"
                titleTypographyProps={{ variant: 'h5' }}
              />
              <CardContent>
                <Typography>
                  Import cloud resources such as databases, storage buckets, or
                  machine instances.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
