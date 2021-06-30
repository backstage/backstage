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
import { generatePath } from 'react-router-dom';
import { useAsync } from 'react-use';
import { Card, CardActions, CardContent, CardMedia } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderTabs,
  SupportButton,
} from '@backstage/core';
import {
  Button,
  ItemCardGrid,
  ItemCardHeader,
} from '@backstage/core-components';
import { Entity } from '@backstage/catalog-model';
import { catalogApiRef, CatalogApi } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';

import { rootDocsRouteRef } from '../../routes';

export const TechDocsXHome = () => {
  const catalogApi: CatalogApi = useApi(catalogApiRef);

  const { value: entities } = useAsync(async () => {
    const response = await catalogApi.getEntities();
    return response.items.filter((entity: Entity) => {
      return !!entity.metadata.annotations?.['backstage.io/techdocs-ref'];
    });
  });

  return (
    <Page themeId="documentation">
      <Header
        title="Documentation hello world"
        subtitle="DocumentationX available in My Company"
      />
      <HeaderTabs tabs={[{ label: 'Overview', id: 'overview' }]} />
      <Content>
        <ContentHeader
          title="Overview"
          description="Explore your internal technical ecosystem through documentation."
        >
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>

        <ItemCardGrid data-testid="docs-explore">
          {entities &&
            entities.map((entity, index) => (
              <Card key={index}>
                <CardMedia>
                  <ItemCardHeader title={entity.metadata.name} />
                </CardMedia>
                <CardContent>{entity.metadata.description}</CardContent>
                <CardActions>
                  <Button
                    to={generatePath(rootDocsRouteRef.path, {
                      namespace: entity.metadata.namespace ?? 'default',
                      kind: entity.kind,
                      name: entity.metadata.name,
                    })}
                    color="primary"
                  >
                    Read Docs
                  </Button>
                </CardActions>
              </Card>
            ))}
        </ItemCardGrid>
      </Content>
    </Page>
  );
};
