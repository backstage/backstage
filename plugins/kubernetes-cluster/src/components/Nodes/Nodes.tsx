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
import { useCallback, useEffect } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  StructuredMetadataTable,
  Table,
  TableColumn,
} from '@backstage/core-components';
import type { INode } from 'kubernetes-models/v1';
import { Flex, Text } from '@backstage/ui';
import { useKubernetesClusterError } from '../KubernetesClusterErrorContext/KubernetesClusterErrorContext';
import { KubernetesDrawer } from '@backstage/plugin-kubernetes-react';

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
          <Flex direction="column" gap="4">
            <div>
              <Text as="h5" variant="title-small" weight="bold">
                Node Info
              </Text>
              <StructuredMetadataTable
                metadata={node.status?.nodeInfo ?? {}}
                options={{ nestedValuesAsYaml: true }}
              />
            </div>
            <div>
              <Text as="h5" variant="title-small" weight="bold">
                Addresses
              </Text>
              <StructuredMetadataTable
                metadata={
                  node.status?.addresses?.reduce((accum, next) => {
                    accum[next.type] = next.address;
                    return accum;
                  }, {} as any) ?? {}
                }
                options={{ nestedValuesAsYaml: true }}
              />
            </div>
            <div>
              <Text as="h5" variant="title-small" weight="bold">
                Taints
              </Text>
              <StructuredMetadataTable
                metadata={
                  node.spec?.taints?.reduce((accum, next) => {
                    accum[`${next.effect}`] = `${next.key} (${next.value})`;
                    return accum;
                  }, {} as any) ?? {}
                }
                options={{ nestedValuesAsYaml: true }}
              />
            </div>
          </Flex>
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
        <Flex justify="center" p="4">
          {error !== undefined ? 'Error loading nodes' : 'No nodes found'}
        </Flex>
      }
      columns={defaultColumns}
    />
  );
};
