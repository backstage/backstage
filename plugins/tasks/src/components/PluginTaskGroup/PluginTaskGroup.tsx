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
import { memo, useMemo, useCallback, type ChangeEvent } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { type Task } from '@backstage/plugin-tasks-common';
import {
  type TaskTriggerResult,
  TaskStatusChips,
  calculateTaskStatusCounts,
  getTaskStatusChipItems,
} from '@backstage/plugin-tasks-react';
import { TaskItem } from '../TaskItem';

const useStyles = makeStyles(
  theme => ({
    pluginAccordion: {
      marginBottom: theme.spacing(0.5),
      '&.Mui-expanded': {
        margin: `${theme.spacing(0.5)}px 0`,
      },
      '& .MuiAccordionSummary-root': {
        minHeight: 40,
        '&.Mui-expanded': {
          minHeight: 40,
        },
      },
      '& .MuiAccordionSummary-content': {
        margin: `${theme.spacing(0.5)}px 0`,
        '&.Mui-expanded': {
          margin: `${theme.spacing(0.5)}px 0`,
        },
      },
    },
    pluginHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      flex: 1,
    },
    pluginTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(0.5),
    },
    pluginDescription: {
      color: theme.palette.text.secondary,
      marginTop: theme.spacing(0.25),
    },
    taskCountChip: {
      marginLeft: 'auto',
      height: 20,
    },
    statusSummary: {
      display: 'flex',
      gap: theme.spacing(0.25),
      marginLeft: theme.spacing(0.5),
    },
    taskList: {
      width: '100%',
      padding: 0,
    },
    accordionDetails: {
      padding: 0,
    },
  }),
  { name: 'PluginTaskGroup' },
);

interface TaskItemStates {
  [taskId: string]: boolean;
}

interface PluginTaskGroupProps {
  pluginId: string;
  tasks: Task[];
  onTriggerTask: (taskId: string) => Promise<TaskTriggerResult>;
  triggeringTasks: Set<string>;
  expanded: boolean;
  onExpandedChange: (pluginId: string, expanded: boolean) => void;
  taskItemStates: TaskItemStates;
  onTaskItemChange: (taskId: string, expanded: boolean) => void;
  highlightedTaskId?: string | null;
}

/**
 * PluginTaskGroup - Displays tasks grouped by plugin with controlled accordion state
 * Optimized with React.memo and memoized calculations to prevent unnecessary re-renders
 */
export const PluginTaskGroup = memo<PluginTaskGroupProps>(
  ({
    pluginId,
    tasks,
    onTriggerTask,
    triggeringTasks,
    expanded,
    onExpandedChange,
    taskItemStates,
    onTaskItemChange,
    highlightedTaskId,
  }) => {
    const classes = useStyles();

    // Memoized status counts using shared utilities
    const statusCounts = useMemo(() => {
      return calculateTaskStatusCounts(tasks);
    }, [tasks]);

    // Memoized plugin metadata
    const { pluginTitle, pluginDescription } = useMemo(() => {
      const firstTask = tasks[0];
      return {
        pluginTitle: firstTask?.meta.pluginTitle || pluginId,
        pluginDescription: firstTask?.meta.pluginDescription,
      };
    }, [pluginId, tasks]);

    // Handle accordion change with plugin ID
    const handleAccordionChange = useCallback(
      (_event: ChangeEvent<unknown>, isExpanded: boolean) => {
        onExpandedChange(pluginId, isExpanded);
      },
      [pluginId, onExpandedChange],
    );

    return (
      <Accordion
        className={classes.pluginAccordion}
        expanded={expanded}
        onChange={handleAccordionChange}
        variant="outlined"
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.pluginHeader}>
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle1" className={classes.pluginTitle}>
                {pluginTitle}
              </Typography>
              {pluginDescription && (
                <Typography
                  variant="caption"
                  className={classes.pluginDescription}
                >
                  {pluginDescription}
                </Typography>
              )}
            </div>

            <TaskStatusChips
              items={[
                ...getTaskStatusChipItems(statusCounts),
                {
                  count: tasks.length,
                  label: `task${tasks.length !== 1 ? 's' : ''}`,
                },
              ]}
              className={classes.statusSummary}
            />
          </div>
        </AccordionSummary>

        <AccordionDetails className={classes.accordionDetails}>
          <List className={classes.taskList}>
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onTrigger={onTriggerTask}
                isTriggering={triggeringTasks.has(task.id)}
                expanded={taskItemStates[task.id] ?? false}
                onExpandedChange={onTaskItemChange}
                highlightedTaskId={highlightedTaskId}
              />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  },
);

PluginTaskGroup.displayName = 'PluginTaskGroup';
