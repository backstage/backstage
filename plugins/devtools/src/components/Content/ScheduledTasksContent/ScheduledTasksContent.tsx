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
import type { KeyboardEvent } from 'react';
import { Focusable } from 'react-aria-components';
import {
  Button,
  DialogTrigger,
  Dialog,
  DialogHeader,
  DialogBody,
  Alert,
  Box,
  ButtonIcon,
  Cell,
  CellText,
  ColumnConfig,
  Combobox,
  VisuallyHidden,
  Flex,
  Text,
  Tooltip,
  TooltipTrigger,
} from '@backstage/ui';
import {
  RiArrowRightSLine,
  RiPlayLine,
  RiStopLine,
  RiMoonLine,
  RiLoader4Line,
  RiForbidLine,
  RiErrorWarningLine,
} from '@remixicon/react';
import { DevToolsTable } from '../DevToolsTable';
import styles from './ScheduledTasksContent.module.css';
import { ResponseError } from '@backstage/errors';
import { useScheduledTasks, useScheduledTasksOperations } from '../../../hooks';
import {
  devToolsTaskSchedulerCreatePermission,
  TaskApiTasksResponse,
} from '@backstage/plugin-devtools-common/alpha';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { ScheduledTaskDetailPanel } from './ScheduledTaskDetailedPanel';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { Progress, toastApiRef } from '@backstage/frontend-plugin-api';

const CreateNotAllowed = () => (
  <TooltipTrigger>
    <Focusable>
      <Text
        as="span"
        color="secondary"
        className={styles.permissionIndicator}
        role="img"
        aria-label="You are not allowed to perform this action"
      >
        <RiForbidLine size={16} aria-hidden="true" />
      </Text>
    </Focusable>
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
  const [pendingAction, setPendingAction] = useState<{
    plugin: string;
    taskId: string;
    action: 'trigger' | 'cancel';
  }>();

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
    const pluginId = inputValue.trim();
    if (!pluginId) {
      setInputValue(selectedPlugin);
      return;
    }
    if (pluginId !== selectedPlugin) {
      setSelectedPlugin(pluginId);
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
        title="No plugins configured for scheduled tasks"
        description="Please configure `devTools.scheduledTasks.plugins` in app-config.yaml."
      />
    );
  }

  const columns: ColumnConfig<TaskApiTasksResponse & { id: string }>[] = [
    {
      id: 'taskId',
      label: 'Task ID',
      minWidth: 300,
      isSortable: true,
      isRowHeader: true,
      cell: rowData => (
        <Cell>
          <DialogTrigger>
            <Button
              variant="tertiary"
              className={styles.taskButton}
              iconEnd={<RiArrowRightSLine size={16} />}
            >
              <Text truncate weight="bold" title={rowData.taskId}>
                {rowData.taskId}
              </Text>
            </Button>
            <Dialog width={640}>
              <DialogHeader className={styles.dialogHeader}>
                {rowData.taskId}
              </DialogHeader>
              <DialogBody>
                <ScheduledTaskDetailPanel rowData={rowData} />
              </DialogBody>
            </Dialog>
          </DialogTrigger>
          {rowData.taskState?.lastRunError && (
            <Text variant="body-small" color="danger">
              <RiErrorWarningLine size={14} aria-hidden /> Last run failed
            </Text>
          )}
        </Cell>
      ),
    },
    {
      id: 'taskState.status',
      label: 'Status',
      minWidth: 110,
      isSortable: true,
      cell: rowData => (
        <Cell>
          <Flex align="center" gap="2">
            {rowData.taskState?.status === 'running' && (
              <RiLoader4Line size={16} className={styles.spinner} aria-hidden />
            )}
            {rowData.taskState?.status === 'idle' && (
              <RiMoonLine size={16} aria-hidden />
            )}
            <Text variant="body-small">
              {rowData.taskState
                ? { running: 'Running', idle: 'Idle' }[rowData.taskState.status]
                : 'N/A'}
            </Text>
          </Flex>
        </Cell>
      ),
    },
    {
      id: 'taskState.lastRunEndedAt',
      label: 'Last Run',
      minWidth: 180,
      isSortable: true,
      cell: rowData => (
        <CellText
          title={
            rowData.taskState?.lastRunEndedAt
              ? new Date(rowData.taskState.lastRunEndedAt).toLocaleString()
              : 'N/A'
          }
        />
      ),
    },
    {
      id: 'taskState.startsAt',
      label: 'Next Run',
      minWidth: 180,
      cell: rowData => (
        <CellText
          title={
            rowData.taskState?.status === 'idle' && rowData.taskState.startsAt
              ? new Date(rowData.taskState.startsAt).toLocaleString()
              : 'N/A'
          }
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 110,
      cell: (rowData: TaskApiTasksResponse) => (
        <Cell>
          <RequirePermission
            permission={devToolsTaskSchedulerCreatePermission}
            errorPage={<CreateNotAllowed />}
          >
            <Flex gap="1">
              <TooltipTrigger>
                <ButtonIcon
                  aria-label={`Run task ${rowData.taskId}`}
                  isPending={
                    pendingAction?.plugin === selectedPlugin &&
                    pendingAction.taskId === rowData.taskId &&
                    pendingAction.action === 'trigger'
                  }
                  isDisabled={isLoading}
                  onPress={async () => {
                    setPendingAction({
                      plugin: selectedPlugin,
                      taskId: rowData.taskId,
                      action: 'trigger',
                    });
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
                      setPendingAction(undefined);
                      refresh();
                    }
                  }}
                  icon={<RiPlayLine />}
                  variant="tertiary"
                />
                <Tooltip>Run task</Tooltip>
              </TooltipTrigger>
              <TooltipTrigger>
                <ButtonIcon
                  aria-label={`Cancel task ${rowData.taskId}`}
                  isPending={
                    pendingAction?.plugin === selectedPlugin &&
                    pendingAction.taskId === rowData.taskId &&
                    pendingAction.action === 'cancel'
                  }
                  isDisabled={isLoading}
                  onPress={async () => {
                    setPendingAction({
                      plugin: selectedPlugin,
                      taskId: rowData.taskId,
                      action: 'cancel',
                    });
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
                      setPendingAction(undefined);
                      refresh();
                    }
                  }}
                  icon={<RiStopLine />}
                  variant="tertiary"
                />
                <Tooltip>Cancel task</Tooltip>
              </TooltipTrigger>
            </Flex>
          </RequirePermission>
        </Cell>
      ),
    },
  ];

  const isLoadingDifferentPlugin = loading && selectedPlugin !== loadedPlugin;
  const isNotFoundError =
    error?.name === 'ResponseError' &&
    (error as ResponseError).statusCode === 404;

  return (
    <Box className={styles.content}>
      <Combobox
        label="Select Plugin"
        className={styles.pluginSelector}
        size="small"
        allowsCustomValue
        options={plugins.map(plugin => ({ id: plugin, label: plugin }))}
        value={plugins.includes(selectedPlugin) ? selectedPlugin : null}
        onChange={handleSelectionChange}
        search={{ inputValue, onInputChange: handleInputChange }}
        onKeyDown={handleKeyDown}
        onBlur={handleCommitChange}
      />

      <VisuallyHidden role="status">
        {!loading &&
        !error &&
        loadedPlugin === selectedPlugin &&
        scheduledTasks?.length === 0
          ? `No scheduled tasks found for ${selectedPlugin}.`
          : ''}
      </VisuallyHidden>

      {isLoadingDifferentPlugin && <Progress />}

      {!isLoadingDifferentPlugin && error && (
        <Alert
          status="danger"
          icon
          role="alert"
          title={
            isNotFoundError
              ? 'No Scheduled Tasks Found'
              : 'Error Loading Scheduled Tasks'
          }
          description={
            <>
              <Text as="p">{error.message}</Text>
              {isNotFoundError && (
                <>
                  <Text as="p">
                    The plugin ID "{selectedPlugin}" doesn't have any scheduled
                    tasks or may contain a typo.
                  </Text>
                  <Text as="p">Please verify:</Text>
                  <ul>
                    <li>The plugin ID is spelled correctly</li>
                    <li>The plugin has registered scheduled tasks</li>
                  </ul>
                </>
              )}
            </>
          }
        />
      )}

      {!isLoadingDifferentPlugin && !error && scheduledTasks && (
        <DevToolsTable
          key={selectedPlugin}
          title="Scheduled tasks"
          columns={columns}
          data={scheduledTasks.map(task => ({ ...task, id: task.taskId }))}
          emptyState={
            scheduledTasks.length === 0 ? (
              <Text color="secondary">{`No scheduled tasks found for ${selectedPlugin}.`}</Text>
            ) : undefined
          }
        />
      )}
    </Box>
  );
};
