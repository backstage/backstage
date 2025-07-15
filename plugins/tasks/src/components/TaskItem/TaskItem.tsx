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
import { memo, useCallback } from 'react';
import {
  ListItem,
  Button,
  Chip,
  makeStyles,
  Typography,
  Tooltip,
  CircularProgress,
  Collapse,
  IconButton,
  Box,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ShareIcon from '@material-ui/icons/Share';
import { usePermission } from '@backstage/plugin-permission-react';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';
import {
  taskTriggerPermission,
  type Task,
} from '@backstage/plugin-tasks-common';
import { type TaskTriggerResult } from '@backstage/plugin-tasks-react';
import {
  humanizeDuration,
  humanizeCadence,
  formatLastRun,
  formatAbsoluteDateTime,
  getNextRunTooltip,
  getLastRunPill,
  getNextRunPill,
} from '../../utils';
import { TaskDetails } from './TaskDetails';

/** @public */
export type TaskItemClassKey =
  | 'taskItem'
  | 'taskContainer'
  | 'taskHeader'
  | 'taskTitleSection'
  | 'taskTitle'
  | 'taskDescription'
  | 'uniformChip'
  | 'timingChip'
  | 'statusChip'
  | 'triggerButton'
  | 'expandButton'
  | 'shareButton'
  | 'pillsAndActionsRow'
  | 'pillsAndActionsMain'
  | 'expandButtonContainer';
export const TaskItemMUIName = 'TaskItem';

const useStyles = makeStyles(
  theme => ({
    taskItem: {
      display: 'block',
      padding: 0,
      borderBottom: `1px solid ${theme.palette.divider}`,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      // Highlighted task styling
      '&.highlighted': {
        backgroundColor: `${theme.palette.primary.main}08`,
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(1),
        '&:hover': {
          backgroundColor: `${theme.palette.primary.main}12`,
        },
      },
    },
    taskContainer: {
      padding: theme.spacing(1.5),
    },
    taskHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(2),
      marginBottom: theme.spacing(0),
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: theme.spacing(1),
      },
    },
    taskTitleSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.25),
      minWidth: 0,
    },
    taskTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(0.75),
      color: theme.palette.text.primary,
      '& svg': {
        verticalAlign: 'middle',
      },
    },
    taskDescription: {
      color: theme.palette.text.secondary,
      lineHeight: 1.3,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '100%',
    },
    uniformChip: {
      height: 24,
      justifySelf: 'center',
      '& .MuiChip-label': {
        padding: '0 6px',
      },
      '& .MuiChip-icon': {
        marginLeft: '4px',
        marginRight: '-2px',
      },
      '& .MuiChip-avatar': {
        width: 16,
        height: 16,
      },
      // Responsive styles for mobile
      [theme.breakpoints.down('sm')]: {
        height: 22,
        '& .MuiChip-label': {
          padding: '0 4px',
        },
      },
      [theme.breakpoints.down('xs')]: {
        height: 20,
        '& .MuiChip-label': {
          padding: '0 3px',
        },
      },
    },
    timingChip: {
      justifySelf: 'end',
      marginBottom: 0,
      marginTop: 0,
      maxWidth: 180,
      '& .MuiChip-label': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      // Responsive styles for mobile
      [theme.breakpoints.down('sm')]: {
        maxWidth: 160,
        justifySelf: 'start',
      },
      [theme.breakpoints.down('xs')]: {
        maxWidth: 150,
        justifySelf: 'start',
      },
    },
    statusChip: {
      justifySelf: 'center',
      marginBottom: 0,
      // Responsive styles for mobile
      [theme.breakpoints.down('sm')]: {
        justifySelf: 'start',
      },
    },
    triggerButton: {
      // Responsive styles for mobile
      [theme.breakpoints.down('sm')]: {
        padding: '4px 8px',
        minWidth: 'auto',
        '& .MuiButton-startIcon': {
          marginRight: theme.spacing(0.25),
        },
      },
    },
    expandButton: {
      width: 28,
      height: 28,
      justifySelf: 'end',
      // Responsive styles for mobile
      [theme.breakpoints.down('sm')]: {
        width: 24,
        height: 24,
      },
    },
    shareButton: {
      width: 28,
      height: 28,
      justifySelf: 'end',
      // Responsive styles for mobile
      [theme.breakpoints.down('sm')]: {
        width: 24,
        height: 24,
      },
    },
    pillsAndActionsRow: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1.5),
      flexWrap: 'wrap',
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
    pillsAndActionsMain: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1.5),
      flexWrap: 'wrap',
      flex: 1,
      minWidth: 0,
    },
    expandButtonContainer: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
    },
  }),
  {
    name: TaskItemMUIName,
  },
);

interface TaskItemProps {
  task: Task;
  onTrigger: (taskId: string) => Promise<TaskTriggerResult>;
  isTriggering: boolean;
  expanded: boolean;
  onExpandedChange: (taskId: string, expanded: boolean) => void;
  highlightedTaskId?: string | null;
}

export const TaskItem = memo(
  ({
    task,
    onTrigger,
    isTriggering,
    expanded,
    onExpandedChange,
    highlightedTaskId,
  }: TaskItemProps) => {
    const classes = useStyles();
    const theme = useTheme();
    const alertApi = useApi(alertApiRef);

    // Check if user has permission to trigger tasks
    const { loading: loadingPermission, allowed: canTriggerTask } =
      usePermission({
        permission: taskTriggerPermission,
        resourceRef: task.id,
      });

    const handleTrigger = async () => {
      const result = await onTrigger(task.id);

      if (result.success) {
        alertApi.post({
          message:
            '✅ Task triggered successfully!\n\n Note: The task may take a moment to appear in the list or might be processed by a different backend instance.',
          severity: 'info',
          display: 'transient',
        });
      } else {
        alertApi.post({
          message: `❌ Failed to trigger task: ${
            result.error || 'Unknown error'
          }`,
          severity: 'error',
          display: 'transient',
        });
      }
    };

    // Handle share functionality
    const handleShare = useCallback(async () => {
      const url = new URL(window.location.href);
      url.searchParams.set('taskId', task.id);

      try {
        await window.navigator.clipboard.writeText(url.toString());
        alertApi.post({
          message: '🔗 Link copied to clipboard!',
          severity: 'success',
          display: 'transient',
        });
      } catch (err) {
        alertApi.post({
          message: `⚠️ Could not copy to clipboard. Please copy manually: ${url.toString()}`,
          severity: 'warning',
          display: 'permanent',
        });
      }
    }, [task.id, alertApi]);

    // Check if this task is highlighted
    const isHighlighted = highlightedTaskId === task.id;

    const cleanDescription = task.meta.description?.trim();
    const isActive = task.computed.status === 'running';
    const isInitialWait = task.computed.workerStatus === 'initial-wait';

    const getTriggerButtonText = () => {
      if (isTriggering) return 'Running...';
      if (isActive) return 'Running';
      if (isInitialWait) return 'Waiting';
      return 'Trigger';
    };

    // Get the two simplified pills
    const lastRunPill = getLastRunPill(task, theme);
    const nextRunPill = getNextRunPill(task, theme);

    return (
      <ListItem
        id={`task-${task.id}`}
        className={`${classes.taskItem} ${isHighlighted ? 'highlighted' : ''}`}
      >
        <div className={classes.taskContainer}>
          <div className={classes.taskHeader}>
            {/* Title & Description */}
            <div className={classes.taskTitleSection}>
              <Typography variant="body2" className={classes.taskTitle}>
                {task.meta.title || task.taskId}
              </Typography>
              {cleanDescription && (
                <Typography
                  variant="caption"
                  className={classes.taskDescription}
                >
                  {cleanDescription}
                </Typography>
              )}
            </div>
            {/* Pills and Actions Row */}
            <div className={classes.pillsAndActionsRow}>
              <div className={classes.pillsAndActionsMain}>
                <Tooltip
                  title={(() => {
                    if (task.computed.lastRunError) {
                      return `Task failed at: ${formatLastRun(
                        task.task.taskState?.lastRunEndedAt,
                      )}`;
                    }
                    if (task.computed.lastRunEndedAt) {
                      return `Task completed at: ${formatAbsoluteDateTime(
                        task.computed.lastRunEndedAt,
                      )}`;
                    }
                    return `Cadence: ${humanizeCadence(
                      task.computed.cadence,
                    )} | Scope: ${task.task.scope}`;
                  })()}
                >
                  <Chip
                    icon={lastRunPill.icon}
                    label={lastRunPill.label}
                    size="small"
                    variant="outlined"
                    className={`${classes.uniformChip} ${classes.timingChip}`}
                    style={{
                      color: lastRunPill.color,
                      backgroundColor: lastRunPill.backgroundColor,
                      borderColor: lastRunPill.borderColor,
                    }}
                  />
                </Tooltip>
                <Tooltip title={getNextRunTooltip(task)}>
                  <Chip
                    icon={nextRunPill.icon}
                    label={nextRunPill.label}
                    size="small"
                    variant="outlined"
                    className={`${classes.uniformChip} ${classes.statusChip}`}
                    style={{
                      color: nextRunPill.color,
                      backgroundColor: nextRunPill.backgroundColor,
                      borderColor: nextRunPill.borderColor,
                    }}
                  />
                </Tooltip>
                {/* Trigger Button - only shown if user has permission */}
                {!loadingPermission &&
                  canTriggerTask &&
                  (isInitialWait ? (
                    <Tooltip
                      title={`Task cannot be triggered during initial wait period of ${humanizeDuration(
                        task.task.settings?.initialDelayDuration || 'PT0S',
                      )}. Worker is waiting for service to stabilize.`}
                    >
                      <Box component="span">
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          className={classes.triggerButton}
                          onClick={handleTrigger}
                          disabled
                          startIcon={<PlayArrowIcon />}
                        >
                          {getTriggerButtonText()}
                        </Button>
                      </Box>
                    </Tooltip>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      className={classes.triggerButton}
                      onClick={handleTrigger}
                      disabled={isTriggering || isActive}
                      startIcon={
                        isTriggering ? (
                          <CircularProgress size={12} />
                        ) : (
                          <PlayArrowIcon />
                        )
                      }
                    >
                      {getTriggerButtonText()}
                    </Button>
                  ))}
                {/* Share Button */}
                <Tooltip title="Share link to this task">
                  <IconButton
                    className={classes.shareButton}
                    onClick={handleShare}
                    size="small"
                    aria-label="share"
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <div className={classes.expandButtonContainer}>
                {/* Expand Button - Always visible, properly positioned */}
                <Tooltip title={expanded ? 'Hide details' : 'Show details'}>
                  <IconButton
                    className={classes.expandButton}
                    onClick={() => onExpandedChange(task.id, !expanded)}
                    size="small"
                    aria-label={expanded ? 'collapse' : 'expand'}
                  >
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Detailed Information (Expandable) */}
          <Collapse in={expanded}>
            <TaskDetails task={task} />
          </Collapse>
        </div>
      </ListItem>
    );
  },
);

TaskItem.displayName = 'TaskItem';
