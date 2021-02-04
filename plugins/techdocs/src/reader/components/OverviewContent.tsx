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
import { generatePath } from 'react-router-dom';
import { Grid } from '@material-ui/core';

import { Entity } from '@backstage/catalog-model';
import {
  Content,
  ContentHeader,
  SupportButton,
  ItemCard,
} from '@backstage/core';

import { rootDocsRouteRef } from '../../plugin';

export const OverviewContent = ({ value }: { value: Entity[] }) => {
  if (!value) return null;
  return (
    <Content>
      <ContentHeader
        title="Overview"
        description="Explore your internal technical ecosystem through documentation."
      >
        <SupportButton>Discover documentation in your ecosystem.</SupportButton>
      </ContentHeader>
      <Grid container data-testid="docs-explore">
        {value?.length
          ? value.map((entity: Entity, index: number) => (
              <Grid key={index} item xs={12} sm={6} md={3}>
                <ItemCard
                  href={generatePath(rootDocsRouteRef.path, {
                    namespace: entity.metadata.namespace ?? 'default',
                    kind: entity.kind,
                    name: entity.metadata.name,
                  })}
                  title={entity.metadata.name}
                  label="Read Docs"
                  description={entity.metadata.description}
                />
              </Grid>
            ))
          : null}
      </Grid>
    </Content>
  );
};
