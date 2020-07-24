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

import { ApiEntityV1alpha1, Entity } from '@backstage/catalog-model';
import { Content, Progress, useApi } from '@backstage/core';
import { ApiDefinitionCard } from '@backstage/plugin-api-docs';
import { Grid } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { FC } from 'react';
import { useAsync } from 'react-use';
import { catalogApiRef } from '../..';

export const EntityPageApi: FC<{ entity: Entity }> = ({ entity }) => {
  const catalogApi = useApi(catalogApiRef);

  const { value: apiEntities, loading } = useAsync(async () => {
    const a = await Promise.all(
      ((entity?.spec?.implementedApis as string[]) || []).map(api =>
        catalogApi.getEntityByName({
          kind: 'API',
          name: api,
        }),
      ),
    );
    const b = new Map<string, ApiEntityV1alpha1>();

    a.filter(api => !!api).forEach(api => {
      b.set(api?.metadata?.name!, api as ApiEntityV1alpha1);
    });
    return b;
  }, [catalogApi, entity]);

  return (
    <Content>
      {loading && <Progress />}
      {!loading && (
        <Grid container spacing={3}>
          {((entity?.spec?.implementedApis as string[]) || []).map(api => {
            const apiEntity = apiEntities && apiEntities.get(api);

            return (
              <Grid item sm={12} key={api}>
                {!apiEntity && (
                  <Alert severity="error">
                    Error on fetching the API: {api}
                  </Alert>
                )}

                {apiEntity && (
                  <ApiDefinitionCard title={api} apiEntity={apiEntity} />
                )}
              </Grid>
            );
          })}
        </Grid>
      )}
    </Content>
  );
};
