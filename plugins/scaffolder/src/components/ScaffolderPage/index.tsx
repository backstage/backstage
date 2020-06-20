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
import {
  Lifecycle,
  Content,
  ContentHeader,
  Header,
  SupportButton,
  Page,
  pageTheme,
  useApi,
} from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog';
import {
  Typography,
  Link,
  Button,
  Grid,
  LinearProgress,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import TemplateCard from '../TemplateCard';
import { useAsync } from 'react-use';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';

const ScaffolderPage: React.FC<{}> = () => {
  const catalogApi = useApi(catalogApiRef);

  const { value, loading } = useAsync(async () => {
    const entities = await catalogApi.getEntities({ kind: 'Template' });
    return (entities as TemplateEntityV1alpha1[]).map(template => ({
      id: template.metadata.uid,
      type: template.spec.type,
      name: template.metadata.name,
      // TODO(shmidt-i): decide on tags
      tags: ['not-implemented'],
      description: template.metadata.description ?? '-',
      // TODO(shmidt-i): decide on owner
      ownerId: '-',
    }));
  });

  return (
    <Page theme={pageTheme.home}>
      <Header
        pageTitleOverride="Create a new component"
        title={
          <>
            Create a new component <Lifecycle alpha shorthand />
          </>
        }
        subtitle="Create new software components using standard templates"
      />
      <Content>
        <ContentHeader title="Available templates">
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/register-component"
          >
            Register existing component
          </Button>
          <SupportButton>
            Create new software components using standard templates. Different
            templates create different kinds of components (services, websites,
            documentation, ...).
          </SupportButton>
        </ContentHeader>
        <Typography variant="body2" paragraph style={{ fontStyle: 'italic' }}>
          <strong>NOTE!</strong> This feature is WIP. You can follow progress{' '}
          <Link href="https://github.com/spotify/backstage/milestone/11">
            here
          </Link>
          .
        </Typography>
        {loading ? (
          <LinearProgress />
        ) : (
          <Grid container>
            {value!.map(item => {
              return (
                <TemplateCard
                  key={item.id}
                  title={item.name}
                  type={item.type}
                  description={item.description}
                  tags={item.tags}
                />
              );
            })}
          </Grid>
        )}
      </Content>
    </Page>
  );
};

export default ScaffolderPage;
