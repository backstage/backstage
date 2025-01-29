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
import { useNodes } from './useNodes';
import React, { useCallback, useEffect } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  StructuredMetadataTable,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { INode } from 'kubernetes-models/v1';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useKubernetesClusterError } from '../KubernetesClusterErrorContext/KubernetesClusterErrorContext';
import { KubernetesDrawer } from '@backstage/plugin-kubernetes-react';

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const defaultColumns: TableColumn<INode>[] = [
  {
    title: 'Name',
    highlight: true,
    width: 'auto',
    render: (node: INode) => {
      return (
        <KubernetesDrawer
          kubernetesObject={node}
          label={node.metadata?.name ?? 'unknown-node'}
        >
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h5">Node Info</Typography>
              <StructuredMetadataTable
                metadata={node.status?.nodeInfo ?? {}}
                options={{ nestedValuesAsYaml: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">Addresses</Typography>
              <StructuredMetadataTable
                metadata={
                  node.status?.addresses?.reduce((accum, next) => {
                    accum[next.type] = next.address;
                    return accum;
                  }, {} as any) ?? {}
                }
                options={{ nestedValuesAsYaml: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">Taints</Typography>
              <StructuredMetadataTable
                metadata={
                  node.spec?.taints?.reduce((accum, next) => {
                    accum[`${next.effect}`] = `${next.key} (${next.value})`;
                    return accum;
                  }, {} as any) ?? {}
                }
                options={{ nestedValuesAsYaml: true }}
              />
            </Grid>
          </Grid>
        </KubernetesDrawer>
      );
    },
  },
  {
    title: 'Schedulable',
    align: 'center',
    width: 'auto',
    render: (node: INode) => {
      if (node.spec?.unschedulable) {
        return '❌';
      }
      return '✅';
    },
  },
  {
    title: 'Status',
    width: 'auto',
    render: (node: INode) => {
      // TODO add an icon
      const readyCondition = node.status?.conditions?.find(c => {
        return c.type === 'Ready';
      });
      if (!readyCondition) {
        return 'Unknown';
      }
      return readyCondition.status === 'True' ? 'Ready' : 'Not Ready';
    },
  },
  {
    title: 'OS',
    width: 'auto',
    render: (node: INode) => {
      return `${node.status?.nodeInfo?.operatingSystem ?? 'unknown'} (${
        node.status?.nodeInfo?.architecture ?? '?'
      })`;
    },
  },
];

export const Nodes = () => {
  const classes = useStyles();
  const { entity } = useEntity();
  const { value, error, loading } = useNodes({
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
    <Table
      title="Nodes"
      options={{ paging: true, search: false, emptyRowsWhenPaging: false }}
      isLoading={!value && loading}
      data={value?.items ?? []}
      emptyContent={
        <div className={classes.empty}>
          {error !== undefined ? 'Error loading nodes' : 'No nodes found'}
        </div>
      }
      columns={defaultColumns}
    />
  );
};
