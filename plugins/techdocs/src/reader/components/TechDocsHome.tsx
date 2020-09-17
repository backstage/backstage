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
import { useAsync } from 'react-use';
import { useNavigate, generatePath } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { ItemCard, Progress, useApi } from '@backstage/core';
import { TechDocsPageWrapper } from './TechDocsPageWrapper';
import { catalogApiRef } from '@backstage/plugin-catalog';
import { rootDocsRouteRef } from '../../plugin';

export const TechDocsHome = () => {
  const catalogApi = useApi(catalogApiRef);
  const navigate = useNavigate();

  const { value, loading, error } = useAsync(async () => {
    const entities = await catalogApi.getEntities();
    return entities.filter(entity => {
      return !!entity.metadata.annotations?.['backstage.io/techdocs-ref'];
    });
  });

  if (loading) {
    return (
      <TechDocsPageWrapper
        title="Documentation"
        subtitle="Documentation available in Backstage"
      >
        <Progress />
      </TechDocsPageWrapper>
    );
  }

  if (error) {
    return (
      <TechDocsPageWrapper
        title="Documentation"
        subtitle="Documentation available in Backstage"
      >
        <p>{error.message}</p>
      </TechDocsPageWrapper>
    );
  }

  return (
    <TechDocsPageWrapper
      title="Documentation"
      subtitle="Documentation available in Backstage"
    >
      <Grid container data-testid="docs-explore">
        {value?.length
          ? value.map((entity, index: number) => (
              <Grid key={index} item xs={12} sm={6} md={3}>
                <ItemCard
                  onClick={() =>
                    navigate(
                      generatePath(rootDocsRouteRef.path, {
                        entityId: `${entity.kind}:${
                          entity.metadata.namespace ?? ''
                        }:${entity.metadata.name}`,
                      }),
                    )
                  }
                  title={entity.metadata.name}
                  label="Read Docs"
                  description={entity.metadata.description}
                />
              </Grid>
            ))
          : null}
      </Grid>
    </TechDocsPageWrapper>
  );
};
