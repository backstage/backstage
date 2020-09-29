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
import { V1ConfigMap } from '@kubernetes/client-node';
import { InfoCard, StructuredMetadataTable } from '@backstage/core';

type ConfigMapsProps = {
  configMaps: V1ConfigMap[];
  children?: React.ReactNode;
};

export const ConfigMaps = ({ configMaps }: ConfigMapsProps) => {
  return (
    <Grid container>
      {configMaps.map((cm, i) => {
        return (
          <Grid item key={i}>
            <InfoCard
              title={cm.metadata?.name ?? 'un-named service'}
              subheader="Config Map"
            >
              <div>
                <StructuredMetadataTable
                  metadata={{
                    immutable: `${cm.immutable === true}`,
                    data: cm.data,
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
