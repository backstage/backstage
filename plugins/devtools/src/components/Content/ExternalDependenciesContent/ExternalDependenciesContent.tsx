/*
 * Copyright 2022 The Backstage Authors
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

import { Progress } from '@backstage/frontend-plugin-api';
import { Alert, Cell, CellText, Flex, Text } from '@backstage/ui';
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiQuestionLine,
} from '@remixicon/react';
import { ExternalDependency } from '@backstage/plugin-devtools-common';
import { useExternalDependencies } from '../../../hooks';
import styles from '../Content.module.css';
import { DevToolsTable } from '../DevToolsTable';

export const getExternalDependencyStatus = (
  result: Partial<ExternalDependency> | undefined,
) => {
  let icon = (
    <RiQuestionLine
      size={16}
      aria-hidden
      style={{ color: 'var(--bui-fg-warning)' }}
    />
  );
  let status = 'Unknown';
  if (result?.status === 'Healthy') {
    icon = (
      <RiCheckboxCircleLine
        size={16}
        aria-hidden
        style={{ color: 'var(--bui-fg-positive)' }}
      />
    );
    status = result.status;
  } else if (result?.status === 'Unhealthy') {
    icon = (
      <RiErrorWarningLine
        size={16}
        aria-hidden
        style={{ color: 'var(--bui-fg-negative)' }}
      />
    );
    status = result.status;
  }
  return (
    <Flex align="center" gap="2">
      {icon}
      <Text variant="body-small" weight="bold">
        {status}
      </Text>
    </Flex>
  );
};

/** @public */
export const ExternalDependenciesContent = () => {
  const { externalDependencies, loading, error } = useExternalDependencies();
  if (loading) return <Progress />;
  if (error)
    return <Alert status="danger" icon title={error.message} role="alert" />;
  if (!externalDependencies?.length) {
    return <Alert status="info" title="No external dependencies found" />;
  }
  return (
    <DevToolsTable
      title="External dependencies"
      data={externalDependencies.map((item, id) => ({ ...item, id }))}
      pageSize={20}
      pageSizeOptions={[20, 50, 100]}
      columns={[
        {
          id: 'name',
          label: 'Name',
          minWidth: 180,
          isSortable: true,
          isRowHeader: true,
          cell: item => <CellText title={item.name} />,
        },
        {
          id: 'target',
          label: 'Target',
          minWidth: 240,
          isSortable: true,
          cell: item => (
            <Cell>
              <code className={styles.code}>{item.target}</code>
            </Cell>
          ),
        },
        {
          id: 'type',
          label: 'Type',
          width: 130,
          isSortable: true,
          cell: item => <CellText title={item.type} />,
        },
        {
          id: 'status',
          label: 'Status',
          minWidth: 220,
          cell: item => (
            <Cell>
              <Flex direction="column" gap="1">
                {getExternalDependencyStatus(item)}
                {item.error && (
                  <Text variant="body-small" color="secondary">
                    {item.error}
                  </Text>
                )}
              </Flex>
            </Cell>
          ),
        },
      ]}
    />
  );
};
