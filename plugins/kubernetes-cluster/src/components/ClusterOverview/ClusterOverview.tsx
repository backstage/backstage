/*
 * Copyright 2023 The Backstage Authors
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
import React, { useCallback, useEffect } from 'react';
import { InfoCard, StructuredMetadataTable } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useCluster } from './useCluster';
import Skeleton from '@material-ui/lab/Skeleton';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { useKubernetesClusterError } from '../KubernetesClusterErrorContext/KubernetesClusterErrorContext';

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
    },
  }),
);

export const ClusterOverview = () => {
  const classes = useStyles();
  const { entity } = useEntity();
  const { value, loading, error } = useCluster({
    clusterName: entity.metadata.name,
  });
  const { setError } = useKubernetesClusterError();
  const setErrorCallback = useCallback(setError, [setError]);
  useEffect(() => {
    if (error) {
      setErrorCallback(error.message);
    }
  }, [error, setErrorCallback]);

  return (
    <InfoCard title="Cluster Overview" className={classes.root}>
      {!value && loading && (
        <>
          <Skeleton height="35rem" />
        </>
      )}
      {value && (
        <StructuredMetadataTable
          metadata={{
            name: value.name,
            'Backstage auth provider': value.authProvider,
            'OIDC Token Provider': value.oidcTokenProvider ?? 'N/A',
            'Dashboard Link': value.dashboardUrl ?? 'N/A',
          }}
          options={{ nestedValuesAsYaml: true }}
        />
      )}
    </InfoCard>
  );
};
