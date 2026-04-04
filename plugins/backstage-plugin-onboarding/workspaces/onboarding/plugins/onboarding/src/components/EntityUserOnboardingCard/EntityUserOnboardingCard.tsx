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

import { useAsync } from 'react-use';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
  EmptyState,
  LinearGauge,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Box, Chip, makeStyles, Typography } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import BlockIcon from '@material-ui/icons/Block';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import { onboardingApiRef } from '../../api/OnboardingApi';
import { OnboardingProgress, OnboardingTemplate } from '../../types';

const useStyles = makeStyles(theme => ({
  statsRow: {
    display: 'flex',
    gap: theme.spacing(1.5),
    flexWrap: 'wrap',
    marginTop: theme.spacing(1.5),
  },
  chip: {
    fontWeight: 600,
    fontSize: '0.7rem',
  },
  gaugeWrapper: {
    marginTop: theme.spacing(1.5),
  },
  phaseLabel: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(0.5),
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 700,
  },
  phaseRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(0.75),
  },
  phaseName: {
    fontSize: '0.85rem',
    color: theme.palette.text.primary,
  },
  phaseCount: {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
  },
}));

type PhaseId = 'day1' | 'week1' | 'week2' | 'month1';

const PHASE_LABELS: Record<PhaseId, string> = {
  day1: 'Day 1',
  week1: 'Week 1',
  week2: 'Week 2',
  month1: 'Month 1',
};

const PHASE_ORDER: PhaseId[] = ['day1', 'week1', 'week2', 'month1'];

function computeStats(progress: OnboardingProgress) {
  const total = progress.tasks.length;
  const done = progress.tasks.filter(t => t.status === 'done').length;
  const blocked = progress.tasks.filter(t => t.status === 'blocked').length;
  const inProgress = progress.tasks.filter(
    t => t.status === 'in-progress',
  ).length;
  const completionPct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, blocked, inProgress, completionPct };
}

/**
 * Card component that displays onboarding progress for a user entity.
 * @public
 */
export function EntityUserOnboardingCard() {
  const classes = useStyles();
  const { entity } = useEntity();
  const onboardingApi = useApi(onboardingApiRef);

  const userId = `user:default/${entity.metadata.name}`;

  const {
    value,
    loading,
    error,
  } = useAsync(async () => {
    const [prog, templates] = await Promise.all([
      onboardingApi.getProgress(userId),
      onboardingApi.getTemplates(),
    ]);
    return { progress: prog, templates };
  }, [userId]);

  const progress = value?.progress;
  const templates = value?.templates;

  if (loading) {
    return (
      <InfoCard title="Onboarding Progress">
        <Progress />
      </InfoCard>
    );
  }

  if (error) {
    return (
      <InfoCard title="Onboarding Progress">
        <ResponseErrorPanel error={error} />
      </InfoCard>
    );
  }

  if (!progress || progress.tasks.length === 0) {
    return (
      <InfoCard title="Onboarding Progress">
        <EmptyState
          missing="data"
          title="No onboarding progress found"
          description={`${entity.metadata.name} has not been assigned an onboarding template yet.`}
        />
      </InfoCard>
    );
  }

  const { done, blocked, inProgress, completionPct } = computeStats(progress);

  // Group tasks by phase using template data to map taskId -> phase
  const byPhase: Record<PhaseId, { done: number; total: number }> = {
    day1: { done: 0, total: 0 },
    week1: { done: 0, total: 0 },
    week2: { done: 0, total: 0 },
    month1: { done: 0, total: 0 },
  };

  const matchingTemplate = templates?.find(
    (t: OnboardingTemplate) => t.metadata.name === progress.templateName,
  );

  if (matchingTemplate) {
    const taskPhaseMap = new Map<string, PhaseId>();
    for (const phase of matchingTemplate.spec.phases) {
      for (const task of phase.tasks) {
        taskPhaseMap.set(task.id, phase.id as PhaseId);
      }
    }

    for (const taskProgress of progress.tasks) {
      const phaseId = taskPhaseMap.get(taskProgress.taskId);
      if (phaseId && byPhase[phaseId]) {
        byPhase[phaseId].total += 1;
        if (taskProgress.status === 'done') {
          byPhase[phaseId].done += 1;
        }
      }
    }
  }

  return (
    <InfoCard
      title="Onboarding Progress"
      subheader={`Template: ${progress.templateName}`}
    >
      <Box className={classes.gaugeWrapper}>
        <LinearGauge value={completionPct / 100} />
        <Typography variant="caption" color="textSecondary">
          {completionPct}% complete
        </Typography>
      </Box>

      <Box className={classes.statsRow}>
        <Chip
          className={classes.chip}
          icon={<CheckCircleOutlineIcon style={{ fontSize: 14 }} />}
          label={`${done} done`}
          size="small"
          color="primary"
          variant={done > 0 ? 'default' : 'outlined'}
        />
        {inProgress > 0 && (
          <Chip
            className={classes.chip}
            icon={<HourglassEmptyIcon style={{ fontSize: 14 }} />}
            label={`${inProgress} in progress`}
            size="small"
            variant="outlined"
          />
        )}
        {blocked > 0 && (
          <Chip
            className={classes.chip}
            icon={<BlockIcon style={{ fontSize: 14 }} />}
            label={`${blocked} blocked`}
            size="small"
            color="secondary"
          />
        )}
      </Box>

      {Object.keys(byPhase).some(p => byPhase[p as PhaseId].total > 0) && (
        <>
          <Typography className={classes.phaseLabel}>By phase</Typography>
          {PHASE_ORDER.filter(p => byPhase[p].total > 0).map(phase => (
            <Box key={phase} className={classes.phaseRow}>
              <Typography className={classes.phaseName}>
                {PHASE_LABELS[phase]}
              </Typography>
              <Typography className={classes.phaseCount}>
                {byPhase[phase].done}/{byPhase[phase].total}
              </Typography>
            </Box>
          ))}
        </>
      )}
    </InfoCard>
  );
}
