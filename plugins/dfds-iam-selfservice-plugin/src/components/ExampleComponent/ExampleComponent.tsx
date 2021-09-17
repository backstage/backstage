/*
 * Copyright 2021 Spotify AB
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
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
  Link,
} from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core';
import MoreHoriz from '@material-ui/icons/MoreHoriz';

export const useIamFetch = function useIamFetch<T>({
  route,
}: {
  route: 'Applications' | 'AuthorizationServers' | 'Groups';
}): { loading: boolean; error: Error | null; data: T | null } {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  React.useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const payload = await fetch(
          `http://localhost:7000/api/proxy/dfds-api/iam/${route}`,
          {
            headers: {
              Authorization:
                'Bearer eyJraWQiOiJFRUdjdDNfVEJPeWYySEJXX3lhZldUNmI2TzFRYzM0UGx2b0FORkJCcXRJIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULjByc24yRWpxTEdIbTJoQjhOMnNoQXpIZkx5Vkp2Y2wxa3EwTHhmbjRoRVUiLCJpc3MiOiJodHRwczovL2Rldi1hY2NvdW50cy5kZmRzLmNvbS9vYXV0aDIvYXVzZjJhdmRkbUVKTUd1cXEweDYiLCJhdWQiOiJhcGk6Ly9DdXN0b21lci1JQU0iLCJpYXQiOjE2MzE3ODYxNTcsImV4cCI6MTYzMTc4OTc1NywiY2lkIjoiMG9hZjFxN2R0Y0JWTWRhdjMweDYiLCJ1aWQiOiIwMHUxZDAweHRuNGdaZWI4MzB4NyIsInNjcCI6WyJDdXN0b21lci1JQU0uU2VsZnNlcnZpY2UuR3JvdXAuQ3JlYXRlIiwiQ3VzdG9tZXItSUFNLlNlbGZzZXJ2aWNlLkFwcGxpY2F0aW9uLkNyZWF0ZSIsIkN1c3RvbWVyLUlBTS5TZWxmc2VydmljZS5BdXRob3JpemF0aW9uU2VydmVyLk1hbmFnZSIsIkN1c3RvbWVyLUlBTS5TZWxmc2VydmljZS5BdXRob3JpemF0aW9uU2VydmVyLlJlYWQiXSwic3ViIjoia29kaWNAZGZkcy5jb20iLCJkZmRzVXNlcklkIjoiZThjNmFmOTctM2M4NC00ODI3LTg3M2EtN2NjYTI0M2U0YTg0In0.cRKXDdLOTDBBvT3ugNKCYx-g1Gdnb0Mb0DbAUAJpepw7-zt6t8Ws0qtNjzvKldXHbjBywr0Ij5YOzzOxSa9k2KXkXlwULOX2avE0_Y9Rzq4kr6YJAVr1NnEJVXhNedwdkO9PnRCAqVzZR-GHNIc5nB4EN0srN0mMcox4JoGlmsJf3uarx1cAdZ2dG44sEoNN4XEg44j1sNneqwVmpdmmL2kWdMvePB1a1VUiZuOdN400NArwB9kTCR90n0gjYbl_ssvUhcwABgyhe1DU3uf79nQx_2PHvu5FP7M-4IRwDpoEg2XFTSqV2GsLW86zhlyrc_GMVjoxgXtO7oYXFqRkzg',
            },
          },
        );
        const json = await payload.json();
        setData(json);
        setLoading(false);
      } catch (e) {
        setError(e as Error);
        setLoading(false);
      }
    };
    getData();
  }, [route]);
  return { data, loading, error };
};

type ApplicationType = {
  id: string;
  clientId: string;
  redirectUri: string[];
  postLogoutRedirectUri: string[];
  applicationType: 'Native' | 'Browser' | 'Service' | 'Web';
  assignToAllUsers: boolean;
  grantTypes: string[];
  name: string;
};

type AuthorizationServers = {
  id: string;
  description: string;
  metadataUrl: string;
  name: string;
  audiences: string[];
};

type Groups = {
  id: string;
  name: string;
  description: string;
};

const IamCard = ({ title, type, id, entityType }) => {
  return (
    <Box mb={1}>
      <Card>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <div style={{ flex: 1 }}>
              <a
                href={`dfds-iam-selfservice-plugin-test?id=${id}&entity=${entityType}`}
              >
                <Typography>{title}</Typography>
              </a>
              <Typography variant="caption" color="textSecondary">
                {type}
              </Typography>
            </div>
            <Box display="flex" flex={1}>
              <Typography>Client ID:</Typography>
              <Chip label={id} size="small" />
            </Box>
            <IconButton size="small">
              <MoreHoriz />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export const ExampleComponent = () => {
  const apps = useIamFetch<ApplicationType[]>({ route: 'Applications' });
  const servers = useIamFetch<AuthorizationServers[]>({
    route: 'AuthorizationServers',
  });
  const groups = useIamFetch<Groups[]>({ route: 'Groups' });
  if (apps.loading || servers.loading || groups.loading) {
    return <CircularProgress />;
  }
  return (
    <Page themeId="tool">
      <Header title="Welcome to dfds-iam-selfservice-plugin!">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Applications">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>

        {apps.error && <div>{apps.error.message}</div>}
        {servers.error && <div>{servers.error.message}</div>}
        <Grid container spacing={3} direction="column">
          <Grid item>
            {(apps?.data || []).map(app => (
              <IamCard
                title={app.name}
                type={app.applicationType}
                id={app.id}
                entityType="Applications"
              />
            ))}
            <ContentHeader title="Authorization servers">
              <SupportButton>
                A description of your plugin goes here.
              </SupportButton>
            </ContentHeader>
            {(servers?.data || []).map(server => (
              <IamCard
                title={server.name}
                type={server.description}
                id={server.id}
                entityType="AuthorizationServers"
              />
            ))}
            <ContentHeader title="Groups">
              <SupportButton>
                A description of your plugin goes here.
              </SupportButton>
            </ContentHeader>
            {(groups?.data || []).map(group => (
              <IamCard
                title={group.name}
                type={group.description}
                id={group.id}
                entityType="Groups"
              />
            ))}
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
