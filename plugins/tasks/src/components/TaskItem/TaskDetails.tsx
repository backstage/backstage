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
import { Typography, Chip, Tooltip, makeStyles } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import AccessTime from '@material-ui/icons/AccessTime';
import { type Task } from '@backstage/plugin-tasks-common';
import {
  humanizeDuration,
  getScopeTooltip,
  getCadenceTooltip,
  getTimeoutTooltip,
  getInitialDelayTooltip,
  getWorkerStatusInfo,
  formatLastRun,
  formatAbsoluteDateTime,
} from '../../utils';

/** @public */
export type TaskDetailsClassKey =
  | 'detailsSection'
  | 'detailsGrid'
  | 'detailGroup'
  | 'detailGroupTitle'
  | 'detailChips'
  | 'detailChip';

export const TaskDetailsMUIName = 'TaskDetails';

const useStyles = makeStyles(
  theme => ({
    detailsSection: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(1.5),
      backgroundColor: theme.palette.background.default,
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.divider}`,
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: theme.spacing(2),
      alignItems: 'start',
    },
    detailGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.75),
    },
    detailGroupTitle: {
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(0.25),
    },
    detailChips: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing(0.5),
    },
    detailChip: {
      height: 22,
      maxWidth: '100%',
      '& .MuiChip-label': {
        padding: '0 6px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      '& .MuiChip-icon': {
        marginLeft: '4px',
        marginRight: '-2px',
      },
    },
  }),
  {
    name: TaskDetailsMUIName,
  },
);

interface TaskDetailsProps {
  task: Task;
}

export const TaskDetails = ({ task }: TaskDetailsProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const scopeIcon = task.task.scope === 'global' ? '🌍' : '🏠';
  const humanizedCadence = humanizeDuration(task.computed.cadence);
  const workerStatusInfo = getWorkerStatusInfo(
    task.computed.workerStatus,
    task,
  );

  return (
    <div className={classes.detailsSection}>
      <div className={classes.detailsGrid}>
        {/* Execution Details */}
        <div className={classes.detailGroup}>
          <Typography variant="overline" className={classes.detailGroupTitle}>
            Execution
          </Typography>
          <div className={classes.detailChips}>
            <Tooltip title={getScopeTooltip(task.task.scope)}>
              <Chip
                icon={
                  <Typography component="span" variant="body2">
                    {scopeIcon}
                  </Typography>
                }
                label={task.task.scope}
                size="small"
                variant="outlined"
                className={classes.detailChip}
                style={{
                  textTransform: 'capitalize',
                }}
              />
            </Tooltip>

            <Tooltip title={getCadenceTooltip(task.computed.cadence)}>
              <Chip
                label={`${humanizedCadence}`}
                size="small"
                variant="outlined"
                className={classes.detailChip}
              />
            </Tooltip>
            {/* Initial delay */}
            {task.task.settings?.initialDelayDuration && (
              <Tooltip
                title={getInitialDelayTooltip(
                  task.task.settings.initialDelayDuration,
                )}
              >
                <Chip
                  label={`Initial delay: ${humanizeDuration(
                    task.task.settings.initialDelayDuration,
                  )}`}
                  size="small"
                  variant="outlined"
                  className={classes.detailChip}
                />
              </Tooltip>
            )}

            {task.task.settings?.timeoutAfterDuration && (
              <Tooltip
                title={getTimeoutTooltip(
                  task.task.settings.timeoutAfterDuration,
                )}
              >
                <Chip
                  label={`Timeout: ${humanizeDuration(
                    task.task.settings.timeoutAfterDuration,
                  )}`}
                  size="small"
                  variant="outlined"
                  className={classes.detailChip}
                  style={{
                    color: theme.palette.warning.dark,
                    borderColor: theme.palette.warning.dark,
                  }}
                />
              </Tooltip>
            )}
          </div>
        </div>

        {/* Last Run History */}
        {task.computed.lastRunEndedAt && false && (
          <div className={classes.detailGroup}>
            <Typography variant="overline" className={classes.detailGroupTitle}>
              Last Run
            </Typography>
            <div className={classes.detailChips}>
              {/* Last Run Time */}
              {task.computed.lastRunEndedAt && (
                <Tooltip
                  title={`Task completed at: ${formatAbsoluteDateTime(
                    task.computed.lastRunEndedAt,
                  )}`}
                >
                  <Chip
                    icon={
                      <AccessTime style={{ color: theme.palette.info.main }} />
                    }
                    label={`Ended ${formatLastRun(
                      task.computed.lastRunEndedAt,
                    )}`}
                    size="small"
                    variant="outlined"
                    className={classes.detailChip}
                    style={
                      task.computed.lastRunError
                        ? {
                            color: theme.palette.error.main,
                            borderColor: theme.palette.error.main,
                          }
                        : {
                            color: theme.palette.info.main,
                            borderColor: theme.palette.info.main,
                          }
                    }
                  />
                </Tooltip>
              )}

              {/* Last Run Status */}
              <Chip
                icon={
                  task.computed.lastRunError ? (
                    <ErrorOutline style={{ color: theme.palette.error.main }} />
                  ) : (
                    <CheckCircleOutline
                      style={{ color: theme.palette.success.main }}
                    />
                  )
                }
                label={task.computed.lastRunError ? 'Failed' : 'Success'}
                size="small"
                variant="outlined"
                className={classes.detailChip}
                style={
                  task.computed.lastRunError
                    ? {
                        color: theme.palette.error.main,
                        borderColor: theme.palette.error.main,
                        backgroundColor: `${theme.palette.error.main}08`,
                      }
                    : {
                        color: theme.palette.success.main,
                        borderColor: theme.palette.success.main,
                        backgroundColor: `${theme.palette.success.main}08`,
                      }
                }
              />

              {/* Error Details - only if there's an error */}
              {task.computed.lastRunError && (
                <Tooltip title={task.computed.lastRunError || 'Unknown error'}>
                  <Chip
                    icon={
                      <Typography component="span" variant="body2">
                        🔍
                      </Typography>
                    }
                    label={`Error: ${task.computed.lastRunError}`}
                    size="small"
                    variant="outlined"
                    className={classes.detailChip}
                    style={{
                      color: theme.palette.error.main,
                      borderColor: theme.palette.error.main,
                    }}
                  />
                </Tooltip>
              )}
            </div>
          </div>
        )}

        {/* Technical & Worker Status */}
        <div className={classes.detailGroup}>
          <Typography variant="overline" className={classes.detailGroupTitle}>
            Technical & Status
          </Typography>
          <div className={classes.detailChips}>
            <Tooltip
              title={`ID: ${task.id || task.taskId} (plugin: ${
                task.task.pluginId
              })`}
            >
              <Chip
                icon={<InfoIcon />}
                label={`ID: ${task.taskId || 'Unknown'}`}
                size="small"
                variant="outlined"
                className={classes.detailChip}
              />
            </Tooltip>

            {task.task.settings?.version && (
              <Chip
                label={`v${task.task.settings.version}`}
                size="small"
                variant="outlined"
                className={classes.detailChip}
              />
            )}

            {task.computed.workerStatus && (
              <Tooltip title={workerStatusInfo.tooltip}>
                <Chip
                  icon={
                    <Typography component="span" variant="body2">
                      {workerStatusInfo.icon}
                    </Typography>
                  }
                  label={workerStatusInfo.label || 'Unknown'}
                  size="small"
                  variant="outlined"
                  className={classes.detailChip}
                />
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
