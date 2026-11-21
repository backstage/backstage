/*
 * Copyright 2025 The Backstage Authors
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
import { TaskApiTasksResponse } from '@backstage/plugin-devtools-common/alpha';
import { Alert, Box, Text } from '@backstage/ui';
import styles from './ScheduledTasksContent.module.css';

/** @public */
export const ScheduledTaskDetailPanel = ({
  rowData,
}: {
  rowData: TaskApiTasksResponse;
}) => {
  const lastRunError = rowData.taskState?.lastRunError;
  const details = [
    ['Worker State', rowData.workerState?.status],
    ['Frequency (Cadence)', rowData.settings?.cadence?.toString()],
    ['Scope', rowData.scope],
    [
      'Started At',
      rowData.taskState?.status === 'running' && rowData.taskState.startedAt
        ? new Date(rowData.taskState.startedAt).toLocaleString()
        : undefined,
    ],
    [
      'Times Out At',
      rowData.taskState?.status === 'running' && rowData.taskState.timesOutAt
        ? new Date(rowData.taskState.timesOutAt).toLocaleString()
        : undefined,
    ],
  ];
  return (
    <Box>
      {lastRunError && (
        <Alert
          status="danger"
          icon
          title="Last Run Error"
          description={lastRunError}
          mb="4"
        />
      )}
      <dl className={styles.details}>
        {details.map(([title, value]) => (
          <div key={title}>
            <dt>
              <Text variant="body-small" color="secondary">
                {title}
              </Text>
            </dt>
            <dd>
              <Text>{value || 'N/A'}</Text>
            </dd>
          </div>
        ))}
      </dl>
    </Box>
  );
};
