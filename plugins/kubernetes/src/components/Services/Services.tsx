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
import { Grid } from '@material-ui/core';
import { V1Service } from '@kubernetes/client-node';
import { InfoCard, StructuredMetadataTable } from '@backstage/core';

type ServicesProps = {
  services: V1Service[];
  children?: React.ReactNode;
};

export const Services = ({ services }: ServicesProps) => {
  return (
    <Grid container>
      {services.map((s, i) => {
        const metadata: any = {};

        if (s.status?.loadBalancer?.ingress?.length ?? -1 > 0) {
          metadata.loadbalancer = s.status?.loadBalancer;
        }

        if (s.spec?.type === 'ClusterIP') {
          metadata.clusterIP = s.spec.clusterIP;
        }

        return (
          <Grid item key={i}>
            <InfoCard
              title={s.metadata?.name ?? 'un-named service'}
              subheader="Service"
            >
              <div>
                <StructuredMetadataTable
                  metadata={{
                    type: s.spec?.type,
                    ports: s.spec?.ports,
                    ...metadata,
                  }}
                />
              </div>
            </InfoCard>
          </Grid>
        );
      })}
    </Grid>
  );
};
