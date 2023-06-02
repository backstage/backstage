/*
 * Copyright 2021 The Backstage Authors
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
import { KubernetesStructuredMetadataTableDrawer } from '../../KubernetesDrawer';
import { Typography, Grid, Chip } from '@material-ui/core';

const capitalize = (str: string) =>
  str.charAt(0).toLocaleUpperCase('en-US') + str.slice(1);

export const K8sGPTResultDrawer = ({
  customResource,
  customResourceName,
  expanded,
}: {
  customResource: any;
  customResourceName: string;
  expanded?: boolean;
}) => {
  const capitalizedName = capitalize(customResourceName);
  const name = customResource.spec?.name.split('/').pop();
  const namespace = customResource.spec?.name.split('/').shift();
  return (
    <KubernetesStructuredMetadataTableDrawer
      object={customResource}
      expanded={expanded}
      kind={capitalizedName}
      renderObject={cr => cr}
    >
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={0}
      >
        <Grid item>
          <Typography variant="body1">
            {customResource.spec?.name ?? 'unknown object'}
          </Typography>
        </Grid>
        <Grid item>
          <Typography color="textSecondary" variant="subtitle1">
            K8sGPT Result
          </Typography>
        </Grid>
        {namespace && (
          <Grid item>
            <Chip size="small" label={`namespace: ${namespace}`} />
          </Grid>
        )}
      </Grid>
    </KubernetesStructuredMetadataTableDrawer>
  );
};
