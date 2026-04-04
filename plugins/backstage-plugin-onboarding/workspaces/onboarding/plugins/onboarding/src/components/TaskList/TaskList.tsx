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

import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { TaskItem } from './TaskItem';
import { OnboardingTask, OnboardingProgress, Phase } from '../../types';

const useStyles = makeStyles((theme: Theme) => ({
  phaseSection: {
    marginBottom: theme.spacing(3),
  },
  phaseHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  phaseTitle: {
    fontWeight: 600,
  },
  countBadge: {
    height: 22,
    fontSize: '0.75rem',
  },
  taskPaper: {
    overflow: 'hidden',
  },
  emptyText: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

const PHASE_ORDER: Phase[] = ['day1', 'week1', 'week2', 'month1'];

const PHASE_LABELS: Record<Phase, string> = {
  day1: 'Day 1',
  week1: 'Week 1',
  week2: 'Week 2',
  month1: 'Month 1',
};

/** @public */
export interface TaskListProps {
  phases: {
    id: Phase;
    tasks: OnboardingTask[];
  }[];
  progress: OnboardingProgress;
  onToggle: (taskId: string) => void;
}

/** @public */
export function TaskList(props: TaskListProps) {
  const { phases, progress, onToggle } = props;
  const classes = useStyles();

  const allTasks = phases.flatMap(p => p.tasks);

  const sortedPhases = [...phases].sort(
    (a, b) => PHASE_ORDER.indexOf(a.id) - PHASE_ORDER.indexOf(b.id),
  );

  return (
    <Box>
      {sortedPhases.map(phase => {
        const phaseTasks = phase.tasks;
        const doneCount = phaseTasks.filter(t => {
          const taskProgress = progress.tasks.find(tp => tp.taskId === t.id);
          return taskProgress?.status === 'done';
        }).length;

        return (
          <Box key={phase.id} className={classes.phaseSection}>
            <Box className={classes.phaseHeader}>
              <Typography variant="h6" className={classes.phaseTitle}>
                {PHASE_LABELS[phase.id]}
              </Typography>
              <Chip
                label={`${doneCount} / ${phaseTasks.length} done`}
                className={classes.countBadge}
                size="small"
                color={doneCount === phaseTasks.length ? 'primary' : 'default'}
                variant="outlined"
              />
            </Box>

            <Paper className={classes.taskPaper} variant="outlined">
              {phaseTasks.length === 0 ? (
                <Typography className={classes.emptyText}>
                  No tasks in this phase
                </Typography>
              ) : (
                phaseTasks.map(task => {
                  const taskProgress = progress.tasks.find(
                    tp => tp.taskId === task.id,
                  );
                  const status = taskProgress?.status ?? 'pending';

                  const locked = isTaskLocked(task, progress);
                  const lockedByNames = locked
                    ? getLockedByNames(task, progress, allTasks)
                    : undefined;

                  return (
                    <TaskItem
                      key={task.id}
                      task={task}
                      status={status}
                      locked={locked}
                      lockedByNames={lockedByNames}
                      onToggle={onToggle}
                    />
                  );
                })
              )}
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
}

function isTaskLocked(
  task: OnboardingTask,
  progress: OnboardingProgress,
): boolean {
  if (!task.dependsOn || task.dependsOn.length === 0) {
    return false;
  }

  return task.dependsOn.some(depId => {
    const depProgress = progress.tasks.find(tp => tp.taskId === depId);
    return !depProgress || depProgress.status !== 'done';
  });
}

function getLockedByNames(
  task: OnboardingTask,
  progress: OnboardingProgress,
  allTasks: OnboardingTask[],
): string[] {
  if (!task.dependsOn) return [];

  return task.dependsOn
    .filter(depId => {
      const depProgress = progress.tasks.find(tp => tp.taskId === depId);
      return !depProgress || depProgress.status !== 'done';
    })
    .map(depId => {
      const depTask = allTasks.find(t => t.id === depId);
      return depTask?.title ?? depId;
    });
}
