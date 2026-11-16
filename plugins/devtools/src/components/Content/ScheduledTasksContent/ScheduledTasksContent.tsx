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

import { useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import {
  ErrorPanel,
  Progress,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { ResponseError } from '@backstage/errors';
import {
  Alert,
  Box,
  ButtonIcon,
  Combobox,
  Flex,
  Text,
  Tooltip,
  TooltipTrigger,
} from '@backstage/ui';
import { useScheduledTasks, useScheduledTasksOperations } from '../../../hooks';
import {
  devToolsTaskSchedulerCreatePermission,
  TaskApiTasksResponse,
} from '@backstage/plugin-devtools-common/alpha';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import {
  RiErrorWarningFill,
  RiForbidLine,
  RiLoader4Line,
  RiMoonClearLine,
  RiRefreshLine,
  RiStopFill,
} from '@remixicon/react';
import { ScheduledTaskDetailPanel } from './ScheduledTaskDetailedPanel';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { toastApiRef } from '@backstage/frontend-plugin-api';
import styles from './ScheduledTasksContent.module.css';

const StatusDisplay = ({ icon, text }: { icon: ReactNode; text: string }) => (
  <Flex align="center" gap="2">
    {icon}
    <Text variant="body-small">{text}</Text>
  </Flex>
);

const CreateNotAllowed = () => (
  <TooltipTrigger>
    <ButtonIcon
      aria-label="You are not allowed to perform this action"
      icon={<RiForbidLine />}
      variant="tertiary"
    />
    <Tooltip>You are not allowed to perform this action</Tooltip>
  </TooltipTrigger>
);

/** @public */
export const ScheduledTasksContent = () => {
  const configApi = useApi(configApiRef);
  const toastApi = useApi(toastApiRef);
  const plugins =
    configApi.getOptionalStringArray('devTools.scheduledTasks.plugins') || [];
  const [selectedPlugin, setSelectedPlugin] = useState(plugins[0] || '');
  const { scheduledTasks, loading, error, refresh, loadedPlugin } =
    useScheduledTasks(selectedPlugin);
  const { triggerTask, cancelTask, isLoading } = useScheduledTasksOperations();

  const [inputValue, setInputValue] = useState(selectedPlugin);
  // Skip the Enter that picked an option, so it doesn't also commit the typed text
  const optionSelectedRef = useRef(false);

  const handleSelectionChange = (key: string | number | null) => {
    if (key === null) {
      return;
    }
    const pluginId = String(key);
    optionSelectedRef.current = true;
    setSelectedPlugin(pluginId);
    setInputValue(pluginId);
  };

  const handleInputChange = (value: string) => {
    optionSelectedRef.current = false;
    setInputValue(value);
  };

  const handleCommitChange = () => {
    if (inputValue !== selectedPlugin) {
      setSelectedPlugin(inputValue);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (optionSelectedRef.current) {
        optionSelectedRef.current = false;
        return;
      }
      handleCommitChange();
    }
  };

  if (!plugins || plugins.length === 0) {
    return (
      <Alert
        status="info"
        icon
        description="No plugins configured for scheduled tasks. Please configure `devTools.scheduledTasks.plugins` in app-config.yaml."
      />
    );
  }

  const columns: TableColumn<TaskApiTasksResponse>[] = [
    {
      title: 'Task ID',
      field: 'taskId',
      width: '35%',
      render: (rowData: TaskApiTasksResponse) => (
        <Flex align="center" gap="2">
          {rowData.taskState?.lastRunError && (
            <RiErrorWarningFill size={20} className={styles.errorIcon} />
          )}
          <Text variant="body-medium">{rowData.taskId}</Text>
        </Flex>
      ),
    },
    {
      title: 'Status',
      field: 'taskState.status',
      width: '15%',
      render: (rowData: TaskApiTasksResponse) => {
        const status = rowData.taskState?.status;

        if (status === 'idle') {
          return (
            <StatusDisplay icon={<RiMoonClearLine size={20} />} text="Idle" />
          );
        }

        if (status === 'running') {
          return (
            <StatusDisplay
              icon={
                <RiLoader4Line
                  size={20}
                  className={styles.spinner}
                  aria-hidden
                />
              }
              text="Running"
            />
          );
        }

        return <Text variant="body-small">{status || 'N/A'}</Text>;
      },
    },
    {
      title: 'Last Run',
      field: 'taskState.lastRunEndedAt',
      width: '25%',
      render: (rowData: TaskApiTasksResponse) =>
        rowData.taskState?.lastRunEndedAt
          ? new Date(rowData.taskState.lastRunEndedAt).toLocaleString()
          : 'N/A',
    },
    {
      title: 'Next Run',
      width: '15%',
      render: (rowData: TaskApiTasksResponse) =>
        rowData.taskState?.status === 'idle' && rowData.taskState.startsAt
          ? new Date(rowData.taskState.startsAt).toLocaleString()
          : 'N/A',
    },
    {
      title: 'Actions',
      render: (rowData: TaskApiTasksResponse) => (
        <RequirePermission
          permission={devToolsTaskSchedulerCreatePermission}
          errorPage={<CreateNotAllowed />}
        >
          <Flex justify="center" gap="1">
            <TooltipTrigger>
              <ButtonIcon
                aria-label="Trigger"
                variant="tertiary"
                icon={<RiRefreshLine />}
                isDisabled={isLoading}
                onPress={async () => {
                  try {
                    await triggerTask(selectedPlugin, rowData.taskId);
                    toastApi.post({
                      title: `Successfully triggered task ${rowData.taskId}`,
                      status: 'success',
                    });
                  } catch (e) {
                    toastApi.post({
                      title: `Error triggering task ${rowData.taskId}: ${e.message}`,
                      status: 'danger',
                    });
                  } finally {
                    refresh();
                  }
                }}
              />
              <Tooltip>Run Task</Tooltip>
            </TooltipTrigger>
            <TooltipTrigger>
              <ButtonIcon
                aria-label="Cancel"
                variant="tertiary"
                icon={<RiStopFill />}
                isDisabled={isLoading}
                onPress={async () => {
                  try {
                    await cancelTask(selectedPlugin, rowData.taskId);
                    toastApi.post({
                      title: `Successfully cancelled task ${rowData.taskId}`,
                      status: 'success',
                    });
                  } catch (e) {
                    toastApi.post({
                      title: `Error cancelling task ${rowData.taskId}: ${e.message}`,
                      status: 'danger',
                    });
                  } finally {
                    refresh();
                  }
                }}
              />
              <Tooltip>Cancel Task</Tooltip>
            </TooltipTrigger>
          </Flex>
        </RequirePermission>
      ),
      sorting: false,
      width: '10%',
      align: 'center',
    },
  ];

  const isLoadingDifferentPlugin = loading && selectedPlugin !== loadedPlugin;
  const isNotFoundError =
    error?.name === 'ResponseError' &&
    (error as ResponseError).statusCode === 404;

  return (
    <Box>
      <Box mb="4">
        <Combobox
          label="Select Plugin"
          className={styles.pluginSelect}
          size="medium"
          allowsCustomValue
          options={plugins.map(plugin => ({ id: plugin, label: plugin }))}
          value={plugins.includes(selectedPlugin) ? selectedPlugin : null}
          onChange={handleSelectionChange}
          search={{ inputValue, onInputChange: handleInputChange }}
          onKeyDown={handleKeyDown}
          onBlur={handleCommitChange}
        />
      </Box>

      {isLoadingDifferentPlugin && <Progress />}

      {!isLoadingDifferentPlugin && error && (
        <ErrorPanel
          error={error}
          title={
            isNotFoundError
              ? 'No Scheduled Tasks Found'
              : 'Error Loading Scheduled Tasks'
          }
        >
          {isNotFoundError && (
            <>
              <Text as="p" variant="body-small">
                The plugin ID "{selectedPlugin}" doesn't have any scheduled
                tasks or may contain a typo.
              </Text>
              <Box mt="2">
                <Text as="p" variant="body-small">
                  Please verify:
                </Text>
              </Box>
              <ul>
                <li>
                  <Text variant="body-small">
                    The plugin ID is spelled correctly
                  </Text>
                </li>
                <li>
                  <Text variant="body-small">
                    The plugin has registered scheduled tasks
                  </Text>
                </li>
              </ul>
            </>
          )}
        </ErrorPanel>
      )}

      {!isLoadingDifferentPlugin && !error && scheduledTasks && (
        <Table
          title={`Scheduled Tasks (${selectedPlugin})`}
          options={{
            paging: true,
            search: true,
            sorting: true,
            searchFieldAlignment: 'right',
            padding: 'dense',
          }}
          columns={columns}
          data={scheduledTasks || []}
          emptyContent={
            <Alert
              status="info"
              icon
              description={`No scheduled tasks found for ${selectedPlugin}.`}
            />
          }
          detailPanel={({ rowData }) => {
            return <ScheduledTaskDetailPanel rowData={rowData} />;
          }}
        />
      )}
    </Box>
  );
};
