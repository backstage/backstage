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
import { Grid } from '@material-ui/core';
import { InfoCard, Page, pageTheme, Content, useApi } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { kubernetesApiRef } from '../../api/types';
import { ObjectsByServiceIdResponse } from '@backstage/plugin-kubernetes-backend';

// TODO this is a temporary component used to construct the Kubernetes plugin boilerplate

export const KubernetesContent: FC<{ entity: Entity }> = ({ entity }) => {
  const kubernetesApi = useApi(kubernetesApiRef);
  const [kubernetesObjects, setKubernetesObjects] = useState<
    ObjectsByServiceIdResponse | undefined
  >(undefined);
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
        <Grid container spacing={3} direction="column">
          {kubernetesObjects === undefined && <div>loading....</div>}
          {error !== undefined && <div>{error}</div>}
          {kubernetesObjects !== undefined && (
            <div>
              {kubernetesObjects.items.map((item, i) => (
                <Grid item key={i}>
                  <InfoCard key={item.cluster.name} title={item.cluster.name}>
                    {item.resources.map((fr, j) => (
                      <div key={j}>
                        <br />
                        {fr.type}:{' '}
                        {(fr.resources as any)
                          .map((v: any) => v.metadata.name)
                          .join(' ')}
                      </div>
                    ))}
                  </InfoCard>
                </Grid>
              ))}
            </div>
          )}
        </Grid>
      </Content>
    </Page>
  );
};
