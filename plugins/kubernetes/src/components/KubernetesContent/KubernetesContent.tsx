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

import React, { FC, useEffect, useState } from 'react';
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  useApi,
} from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { kubernetesApiRef } from '../../api/types';

// TODO this is a temporary component used to construct the Kubernetes plugin boilerplate

export const KubernetesContent: FC<{ entity: Entity }> = ({ entity }) => {
  const kubernetesApi = useApi(kubernetesApiRef);
  const [kubernetesObjects, setKubernetesObjects] = useState<{} | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    kubernetesApi
      .getObjectsByServiceId(entity.metadata.name)
      .then(result => {
        setKubernetesObjects(result);
      })
      .catch(e => {
        setError(e.message);
      });
  }, [entity.metadata.name, kubernetesApi]);

  return (
    <Page theme={pageTheme.tool}>
      <Content>
        <ContentHeader title="This is where you would see your kubernetes objects" />
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title="This is where you would see your kubernetes objects">
              <Typography variant="body1">
                {kubernetesObjects === undefined && <div>loading....</div>}
                {error !== undefined && <div>{error}</div>}
                {kubernetesObjects !== undefined && (
                  <div>
                    backend response: {JSON.stringify(kubernetesObjects)}
                  </div>
                )}
              </Typography>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
