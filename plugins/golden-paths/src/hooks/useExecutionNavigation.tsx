/*
 * Copyright 2026 The Backstage Authors
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
import { useCallback, useMemo } from 'react';
import { useGoldenPathTaskContext } from '../components/GoldenPathExecutionPage/useGoldenPathTaskContext';
import { goldenPathsApiRef } from '@backstage/plugin-golden-paths-react';
import { useApi } from '@backstage/core-plugin-api';
import { useNavigate } from 'react-router-dom';

const PROCESSING_STATUSES = ['completed', 'failed', 'active'];

export const useExecutionNavigation = () => {
  const goldenPathsApi = useApi(goldenPathsApiRef);
  const navigate = useNavigate();
  const {
    value: {
      goldenPathTask,
      stepIndex,
      setStepIndex,
      setStepPhase,
      mappedStatuses,
      fetchGoldenPathStatuses,
    },
  } = useGoldenPathTaskContext();

  const isCompleteButtonVisible = useMemo(
    () => stepIndex === goldenPathTask.spec.steps.length - 1,
    [goldenPathTask.spec.steps.length, stepIndex],
  );
  const currentStepStatus = mappedStatuses[stepIndex]?.status;
  const isCurrentStepSkipped = currentStepStatus === 'skipped';
  const isCurrentStepCompleted = currentStepStatus === 'completed';
  const isCurrentStepMarkedAsDone = currentStepStatus === 'marked_as_done';
  const isCurrentStepEnabled = currentStepStatus === 'enabled';

  const isNextButtonDisabled = useMemo(() => {
    if (mappedStatuses.length === 0) return true;

    if (
      (stepIndex + 1 >= mappedStatuses.length ||
        !mappedStatuses[stepIndex + 1].status) &&
      !['completed', 'skipped', 'marked_as_done'].includes(
        mappedStatuses[stepIndex].status || '',
      )
    )
      return true;

    return false;
  }, [mappedStatuses, stepIndex]);

  const oneOfTemplatesHasError =
    mappedStatuses.find(el => el.status === 'failed') !== undefined;
  const isGoldenPathCompleted = goldenPathTask.status === 'completed';

  const isPreviousButtonVisible = useMemo(() => {
    if (stepIndex === 0) return false;
    const prevStatuses = mappedStatuses.slice(0, stepIndex);
    const allMissing = prevStatuses.every(s => s.status === 'missing');

    return !allMissing;
  }, [mappedStatuses, stepIndex]);

  const navigateNext = useCallback(async () => {
    if (!isCompleteButtonVisible) {
      let newIndex = stepIndex + 1;

      while (
        newIndex < mappedStatuses.length &&
        mappedStatuses[newIndex]?.status === 'missing'
      ) {
        newIndex++;
      }

      if (newIndex < mappedStatuses.length) {
        setStepIndex(newIndex);

        if (
          PROCESSING_STATUSES.includes(mappedStatuses[newIndex].status || '')
        ) {
          setStepPhase('processing');
        } else setStepPhase('form');
      }
    }
  }, [
    isCompleteButtonVisible,
    mappedStatuses,
    setStepIndex,
    setStepPhase,
    stepIndex,
  ]);

  const updateCurrentTemplateStatus = async (
    taskId: string,
    templateId: string,
    status: 'missing' | 'skipped' | 'marked_as_done',
  ) => {
    await goldenPathsApi.updateStatus({
      taskId,
      templateId,
      status,
    });

    await fetchGoldenPathStatuses();
    navigateNext();
  };

  const navigatePrevious = useCallback(() => {
    let newIndex = stepIndex - 1;

    while (newIndex >= 0 && mappedStatuses[newIndex]?.status === 'missing') {
      newIndex--;
    }
    if (newIndex >= 0) {
      setStepIndex(newIndex);

      const status = mappedStatuses[newIndex]?.status;
      if (PROCESSING_STATUSES.includes(status || '')) {
        setStepPhase('processing');
      } else setStepPhase('form');
    }
  }, [mappedStatuses, setStepIndex, setStepPhase, stepIndex]);

  const navigateToStepIndex = useCallback(
    (index: number, status: string) => {
      if (mappedStatuses[index].status === 'missing') return;

      setStepIndex(index);

      if (PROCESSING_STATUSES.includes(status)) {
        setStepPhase('processing');
      } else setStepPhase('form');
    },
    [mappedStatuses, setStepIndex, setStepPhase],
  );

  const completeGoldenPath = async (taskId: string) => {
    await goldenPathsApi.completeGoldenPath(taskId);
    navigate(`/golden-paths/tasks`);
  };

  return {
    isCompleteButtonVisible,
    isCurrentStepCompleted,
    isCurrentStepMarkedAsDone,
    isCurrentStepSkipped,
    isCurrentStepEnabled,
    isNextButtonDisabled,
    isGoldenPathCompleted,
    isPreviousButtonVisible,
    navigateNext,
    navigatePrevious,
    navigateToStepIndex,
    currentStepStatus,
    completeGoldenPath,
    oneOfTemplatesHasError,
    updateCurrentTemplateStatus,
  };
};
