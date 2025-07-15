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
import {
  memo,
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
} from 'react';
import useObservable from 'react-use/esm/useObservable';
import {
  Typography,
  makeStyles,
  Box,
  Button,
  CircularProgress,
  Paper,
  Switch,
  FormControlLabel,
  Tooltip,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import { type Task } from '@backstage/plugin-tasks-common';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import {
  TaskStatusChips,
  useTasks,
  calculateTaskStatusCounts,
  getTaskStatusChipItems,
} from '@backstage/plugin-tasks-react';
import { PluginTaskGroup } from '../PluginTaskGroup/PluginTaskGroup';
import { ErrorDisplay } from '../ErrorDisplay';
import { useTheme } from '@material-ui/core/styles';
import { formatDuration } from '../../utils';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    // Responsive design for small screens
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1.5),
      marginBottom: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: theme.spacing(2),
      padding: theme.spacing(1.5),
    },
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  summary: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    // Responsive design for small screens
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      gap: theme.spacing(1),
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
  errorContainer: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.error.main,
  },
  emptyContainer: {
    padding: theme.spacing(4),
    textAlign: 'center',
  },
  refreshControls: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    // Responsive design for small screens
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      gap: theme.spacing(1),
    },
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    position: 'relative',
    // Responsive design for small screens
    [theme.breakpoints.down('sm')]: {
      flexShrink: 0,
    },
  },
  autoRefreshSwitch: {
    marginLeft: theme.spacing(1),
    '& .MuiFormControlLabel-label': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(0.5),
    },
    // Responsive design for small screens
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      flex: 1,
    },
  },
  backgroundRefreshIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    animation: '$pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      opacity: 1,
      transform: 'scale(1)',
    },
    '50%': {
      opacity: 0.5,
      transform: 'scale(1.2)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
}));

interface AccordionStates {
  [pluginId: string]: boolean;
}

interface TaskItemStates {
  [taskId: string]: boolean;
}

/**
 * @public
 */
export interface TasksContentProps {
  highlightedTaskId?: string | null;
}

/**
 * TasksContent - Main content component for task management
 * Optimized for React 18 with proper memoization and state preservation
 * during automatic refresh cycles
 */
const TasksContentMemo = memo(({ highlightedTaskId }: TasksContentProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const {
    tasks,
    tasksByPlugin,
    loading,
    error,
    refreshTasks,
    backgroundRefresh,
    triggerTask,
    triggeringTasks,
    isBackgroundRefreshing,
  } = useTasks();

  // Storage bucket for persisting user preferences
  const userSettings = useApi(storageApiRef).forBucket('tasks-plugin');

  // Persistent state for accordion expansions (plugin groups)
  const [accordionStates, setAccordionStates] = useState<AccordionStates>({});

  // Persistent state for task item expansions
  const [taskItemStates, setTaskItemStates] = useState<TaskItemStates>({});

  // Auto-refresh state - loaded from storage with reactive updates
  const autoRefreshStorageValue = useObservable(
    userSettings.observe$<string>('autoRefreshEnabled'),
    userSettings.snapshot<string>('autoRefreshEnabled'),
  );

  // Derive the actual boolean value from storage
  const autoRefreshEnabled = useMemo(() => {
    if (
      autoRefreshStorageValue.presence === 'present' &&
      autoRefreshStorageValue.value !== undefined
    ) {
      return autoRefreshStorageValue.value === 'true';
    }
    return false; // Default value
  }, [autoRefreshStorageValue]);

  // Track if storage has been initialized (storage is always "loaded" with useObservable)
  const isStorageLoaded = useMemo(() => {
    return autoRefreshStorageValue.presence !== 'unknown';
  }, [autoRefreshStorageValue]);

  // Keep track of initialized plugins to set default expanded state
  const initializedPlugins = useRef<Set<string>>(new Set());

  // Setup auto-refresh functionality with background refresh
  const { toggleAutoRefresh, isPageVisible, isUserIdle, actualIntervalMs } =
    useAutoRefresh({
      intervalMs: 30000, // 30 seconds
      onRefresh: backgroundRefresh, // Use background refresh to prevent flashing
      enabled: autoRefreshEnabled && isStorageLoaded, // Only enable after storage is loaded
      refreshOnMount: false,
    });

  // Format interval for display using timeUtils
  const intervalText = formatDuration(actualIntervalMs);

  // Get tooltip text for auto-refresh with desktop-friendly information
  const getAutoRefreshTooltip = () => {
    const baseMsg = `Auto-refresh every ${intervalText}`;
    const conditions = [];

    if (!autoRefreshEnabled) {
      return 'Enable automatic refresh';
    }

    if (!isPageVisible) {
      conditions.push('paused');
    }
    if (isUserIdle) {
      conditions.push('slower');
    }

    if (conditions.length > 0) {
      return `${baseMsg} - ${conditions.join(', ')}`;
    }

    return `${baseMsg} - active`;
  };

  // Memoized summary statistics using shared utilities
  const summaryStats = useMemo(() => {
    if (!tasks?.length) {
      return {
        totalTasks: 0,
        totalPlugins: 0,
        runningTasks: 0,
        errorTasks: 0,
      };
    }

    const statusCounts = calculateTaskStatusCounts(tasks);
    const totalPlugins = Object.keys(tasksByPlugin).length;

    return {
      totalTasks: statusCounts.total,
      totalPlugins,
      runningTasks: statusCounts.running,
      errorTasks: statusCounts.error,
    };
  }, [tasks, tasksByPlugin]);

  // Memoized plugin entries to prevent unnecessary re-creation
  const pluginEntries = useMemo(() => {
    return Object.entries(tasksByPlugin);
  }, [tasksByPlugin]);

  // Callback to handle accordion state changes
  const handleAccordionChange = useCallback(
    (pluginId: string, expanded: boolean) => {
      setAccordionStates(prev => ({
        ...prev,
        [pluginId]: expanded,
      }));
    },
    [],
  );

  // Callback to handle task item state changes
  const handleTaskItemChange = useCallback(
    (taskId: string, expanded: boolean) => {
      setTaskItemStates(prev => ({
        ...prev,
        [taskId]: expanded,
      }));
    },
    [],
  );

  // Track which plugins have been auto-expanded due to highlights to avoid re-expanding
  const autoExpandedForHighlight = useRef<Set<string>>(new Set());
  const previousHighlightedTaskId = useRef<string | null | undefined>(
    highlightedTaskId,
  );

  // Reset auto-expansion tracking when highlighted task changes
  useEffect(() => {
    if (previousHighlightedTaskId.current !== highlightedTaskId) {
      autoExpandedForHighlight.current.clear();
      previousHighlightedTaskId.current = highlightedTaskId;
    }
  }, [highlightedTaskId]);

  // Initialize default expanded state for new plugins
  const getPluginExpandedState = useCallback(
    (pluginId: string, pluginTasks: Task[]) => {
      if (!initializedPlugins.current.has(pluginId)) {
        initializedPlugins.current.add(pluginId);
        // Set default expanded state if not already set
        if (!(pluginId in accordionStates)) {
          const shouldExpand = highlightedTaskId
            ? pluginTasks.some(task => task.id === highlightedTaskId)
            : true; // Default to expanded
          setAccordionStates(prev => ({
            ...prev,
            [pluginId]: shouldExpand,
          }));

          // Track if we auto-expanded due to highlight
          if (
            shouldExpand &&
            highlightedTaskId &&
            pluginTasks.some(task => task.id === highlightedTaskId)
          ) {
            autoExpandedForHighlight.current.add(pluginId);
          }

          return shouldExpand;
        }
      }

      // If there's a highlighted task in this plugin and we haven't auto-expanded it yet,
      // expand it once, but then respect user's manual changes
      if (
        highlightedTaskId &&
        pluginTasks.some(task => task.id === highlightedTaskId) &&
        !autoExpandedForHighlight.current.has(pluginId)
      ) {
        autoExpandedForHighlight.current.add(pluginId);
        setAccordionStates(prev => ({
          ...prev,
          [pluginId]: true,
        }));
        return true;
      }

      // Always respect the user's manual accordion state
      return accordionStates[pluginId] ?? true;
    },
    [accordionStates, highlightedTaskId],
  );

  // Handle auto-refresh toggle with storage persistence
  const handleAutoRefreshToggle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const enabled = event.target.checked;
      toggleAutoRefresh(enabled);

      // Save preference to storage (this will trigger the useObservable to update)
      try {
        userSettings.set('autoRefreshEnabled', enabled.toString());
      } catch (storageError) {
        // Ignore storage errors, the setting will still work for this session
      }
    },
    [toggleAutoRefresh, userSettings],
  );

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
        <Typography variant="body1" style={{ marginLeft: 16 }}>
          Loading tasks...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refreshTasks}
        // context="loading tasks list"
      />
    );
  }

  if (!tasks?.length) {
    return (
      <Paper className={classes.emptyContainer}>
        <Typography variant="h6">🔧 No tasks available</Typography>
        <Typography variant="body2">
          No scheduled tasks found across enabled plugins.
        </Typography>
        <Button
          onClick={refreshTasks}
          variant="outlined"
          style={{ marginTop: 16 }}
        >
          Refresh
        </Button>
      </Paper>
    );
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.header} variant="outlined">
        <div>
          <Typography variant="h4" className={classes.title}>
            Task Management
          </Typography>
          <TaskStatusChips
            items={[
              ...getTaskStatusChipItems({
                running: summaryStats.runningTasks,
                error: summaryStats.errorTasks,
                idle:
                  summaryStats.totalTasks -
                  summaryStats.runningTasks -
                  summaryStats.errorTasks,
              }),
              {
                count: summaryStats.totalTasks,
                label: `tasks`,
                color: 'default',
              },
            ]}
            className={classes.summary}
          />
        </div>

        <div className={classes.refreshControls}>
          <Tooltip title={getAutoRefreshTooltip()}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefreshEnabled}
                  onChange={handleAutoRefreshToggle}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography component="span" variant="body2">
                  Auto-refresh ({intervalText})
                  {autoRefreshEnabled && !isPageVisible && (
                    <Typography
                      component="span"
                      variant="caption"
                      style={{
                        color: theme.palette.warning.main,
                      }}
                    >
                      {' '}
                      ⏸ paused
                    </Typography>
                  )}
                  {autoRefreshEnabled && isUserIdle && isPageVisible && (
                    <Typography
                      component="span"
                      variant="caption"
                      style={{
                        color: theme.palette.info.main,
                      }}
                    >
                      {' '}
                      💤 idle
                    </Typography>
                  )}
                </Typography>
              }
              className={classes.autoRefreshSwitch}
            />
          </Tooltip>

          <Button
            variant="outlined"
            onClick={refreshTasks}
            className={classes.refreshButton}
            startIcon={<RefreshIcon />}
          >
            Refresh
            {isBackgroundRefreshing && (
              <div className={classes.backgroundRefreshIndicator} />
            )}
          </Button>
        </div>
      </Paper>

      <Box>
        {pluginEntries.map(([pluginId, pluginTasks], index) => (
          <Box key={pluginId} mb={index < pluginEntries.length - 1 ? 2 : 0}>
            <PluginTaskGroup
              pluginId={pluginId}
              tasks={pluginTasks}
              onTriggerTask={triggerTask}
              triggeringTasks={triggeringTasks}
              expanded={getPluginExpandedState(pluginId, pluginTasks)}
              onExpandedChange={handleAccordionChange}
              taskItemStates={taskItemStates}
              onTaskItemChange={handleTaskItemChange}
              highlightedTaskId={highlightedTaskId}
            />
          </Box>
        ))}
      </Box>
    </div>
  );
});

TasksContentMemo.displayName = 'TasksContent';

// Export a non-memo wrapper for Backstage plugin system
export const TasksContent = (props: TasksContentProps) => (
  <TasksContentMemo {...props} />
);
