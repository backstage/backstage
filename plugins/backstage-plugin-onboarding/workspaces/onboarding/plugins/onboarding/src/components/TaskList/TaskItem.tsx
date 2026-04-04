/*
 * Copyright 2026 Estehsan Tariq
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

import { useState } from 'react';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { OnboardingTask, TaskStatus } from '../../types';
import { TaskDetailPanel } from './TaskDetailPanel';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing(1.5, 2),
    borderLeft: '4px solid transparent',
  },
  blocked: {
    borderLeftColor: theme.palette.error.main,
  },
  locked: {
    opacity: 0.5,
  },
  checkbox: {
    padding: theme.spacing(0, 1, 0, 0),
    marginTop: 2,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
  },
  title: {
    fontWeight: 500,
  },
  titleDone: {
    fontWeight: 500,
    textDecoration: 'line-through',
    color: theme.palette.text.secondary,
  },
  description: {
    marginTop: theme.spacing(0.5),
    color: theme.palette.text.secondary,
  },
  badges: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  },
  phaseBadge: {
    height: 20,
    fontSize: '0.7rem',
  },
  typeBadge: {
    height: 20,
    fontSize: '0.7rem',
  },
  blockedBadge: {
    height: 20,
    fontSize: '0.7rem',
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  automatedChip: {
    height: 20,
    fontSize: '0.7rem',
  },
  avatar: {
    width: 28,
    height: 28,
    fontSize: '0.75rem',
    marginLeft: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
  },
  lockIcon: {
    fontSize: 18,
    color: theme.palette.text.disabled,
    marginRight: theme.spacing(0.5),
    marginTop: 4,
  },
  wrapper: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': { borderBottom: 'none' },
  },
  expandButton: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
  },
  hasDocsBadge: {
    height: 20,
    fontSize: '0.7rem',
    cursor: 'pointer',
  },
  clickableContent: {
    cursor: 'pointer',
  },
}));

const PHASE_LABELS: Record<string, string> = {
  day1: 'Day 1',
  week1: 'Week 1',
  week2: 'Week 2',
  month1: 'Month 1',
};

const AUTOMATED_STATUS_COLORS: Record<
  string,
  'default' | 'primary' | 'secondary'
> = {
  pending: 'default',
  'in-progress': 'primary',
  done: 'default',
  blocked: 'secondary',
};

function getAssigneeInitials(assignee: string): string {
  if (assignee === 'self') return 'ME';
  if (assignee === 'buddy') return 'BD';
  if (assignee === 'manager') return 'MG';
  return assignee
    .split(/[\s/:]/)
    .filter(Boolean)
    .slice(-2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** @public */
export interface TaskItemProps {
  task: OnboardingTask;
  status: TaskStatus;
  locked: boolean;
  lockedByNames?: string[];
  onToggle: (taskId: string) => void;
}

/** @public */
export function TaskItem(props: TaskItemProps) {
  const { task, status, locked, lockedByNames, onToggle } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const isDone = status === 'done';
  const isBlocked = status === 'blocked';
  const isAutomated = task.type === 'automated';

  const hasDetail =
    !!task.documentation ||
    (task.resources && task.resources.length > 0) ||
    (task.recommendations && task.recommendations.length > 0);

  const rootClasses = [classes.root];
  if (isBlocked) rootClasses.push(classes.blocked);
  if (locked) rootClasses.push(classes.locked);

  const handleToggle = () => {
    if (!locked) {
      onToggle(task.id);
    }
  };

  const checkbox = (
    <Checkbox
      className={classes.checkbox}
      checked={isDone}
      disabled={locked}
      onChange={handleToggle}
      color="primary"
      size="small"
      inputProps={{ 'aria-label': `Mark "${task.title}" as complete` }}
    />
  );

  const handleExpandToggle = () => {
    if (hasDetail) setExpanded(prev => !prev);
  };

  return (
    <Box className={classes.wrapper} data-testid={`task-item-${task.id}`}>
      <Box className={rootClasses.join(' ')} style={{ borderBottom: 'none' }}>
        {locked ? (
          <Tooltip
            title={
              lockedByNames && lockedByNames.length > 0
                ? `Requires: ${lockedByNames.join(', ')}`
                : 'Dependencies not yet complete'
            }
          >
            <span style={{ display: 'flex', alignItems: 'flex-start' }}>
              <LockIcon className={classes.lockIcon} />
              {checkbox}
            </span>
          </Tooltip>
        ) : (
          checkbox
        )}

        <Box
          className={`${classes.content} ${hasDetail ? classes.clickableContent : ''}`}
          onClick={handleExpandToggle}
          role={hasDetail ? 'button' : undefined}
          tabIndex={hasDetail ? 0 : undefined}
          onKeyDown={
            hasDetail
              ? e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleExpandToggle();
                  }
                }
              : undefined
          }
        >
          <Box className={classes.titleRow}>
            <Typography
              variant="body1"
              className={isDone ? classes.titleDone : classes.title}
            >
              {task.title}
            </Typography>
            {hasDetail && (
              <Chip
                icon={<MenuBookIcon style={{ fontSize: 14 }} />}
                label="Guide"
                className={classes.hasDocsBadge}
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleExpandToggle}
              />
            )}
          </Box>

          <Typography variant="body2" className={classes.description}>
            {task.description}
          </Typography>

          <Box className={classes.badges}>
            <Chip
              label={PHASE_LABELS[task.duePhase] ?? task.duePhase}
              className={classes.phaseBadge}
              size="small"
              variant="outlined"
            />
            <Chip
              label={isAutomated ? 'Automated' : 'Manual'}
              className={classes.typeBadge}
              size="small"
              variant="outlined"
              color={isAutomated ? 'primary' : 'default'}
            />
            {isBlocked && (
              <Chip
                label="Blocked"
                className={classes.blockedBadge}
                size="small"
              />
            )}
            {isAutomated && (
              <Chip
                label={status === 'in-progress' ? 'Running' : status}
                className={classes.automatedChip}
                size="small"
                color={AUTOMATED_STATUS_COLORS[status] ?? 'default'}
              />
            )}
          </Box>
        </Box>

        <Box className={classes.actions}>
          <Tooltip title={task.assignee}>
            <Avatar className={classes.avatar}>
              {getAssigneeInitials(task.assignee)}
            </Avatar>
          </Tooltip>
          {task.link && (
            <Tooltip title={task.link.label}>
              <IconButton
                size="small"
                href={task.link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={task.link.label}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {hasDetail && (
            <Tooltip title={expanded ? 'Hide guide' : 'View guide'}>
              <IconButton
                size="small"
                className={classes.expandButton}
                onClick={handleExpandToggle}
                aria-label={expanded ? 'Collapse details' : 'Expand details'}
              >
                {expanded ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      <TaskDetailPanel task={task} open={expanded} />
    </Box>
  );
}
