/*
 * Copyright 2020 The Backstage Authors
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
import { KubernetesStructuredMetadataTableDrawer } from '../KubernetesDrawer';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import type { V1ConfigMap } from '@kubernetes/client-node';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { kubernetesReactTranslationRef } from '../../translation';

export const ConfigmapsDrawer = ({
  configmap,
  expanded,
}: {
  configmap: V1ConfigMap;
  expanded?: boolean;
}) => {
  const { t } = useTranslationRef(kubernetesReactTranslationRef);
  const namespace = configmap.metadata?.namespace;
  return (
    <KubernetesStructuredMetadataTableDrawer
      object={configmap}
      expanded={expanded}
      kind="ConfigMap"
      renderObject={(configmapObject: V1ConfigMap) => {
        return configmapObject || {};
      }}
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
            {configmap.metadata?.name ?? 'unknown object'}
          </Typography>
        </Grid>
        <Grid item>
          <Typography color="textSecondary" variant="subtitle1">
            ConfigMap
          </Typography>
        </Grid>
        {namespace && (
          <Grid item>
            <Chip
              size="small"
              label={t('namespace.labelWithValue', { namespace })}
            />
          </Grid>
        )}
      </Grid>
    </KubernetesStructuredMetadataTableDrawer>
  );
};
