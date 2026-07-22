/*
 * Copyright 2021 The Backstage Authors
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
import { useMemo, useState, useCallback } from 'react';
import { useAsync } from '@react-hookz/web';
import { useAnalytics, useApi } from '@backstage/core-plugin-api';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { usePermission } from '@backstage/plugin-permission-react';
import {
  templateExecutePermission,
  templateReadPermission,
} from '@backstage/plugin-golden-paths-common';

import { useGoldenPathTaskContext } from '../../../useGoldenPathTaskContext';
import { useTemplateEventStream } from './useTemplateEventStream';
import { useParams } from 'react-router-dom';

export const useTemplateProcessing = () => {
  const {
    value: {
      templateStepId,
      setTemplateStepParams,
      stepIndex,
      setStepPhase,
      goldenPathTask,
    },
  } = useGoldenPathTaskContext();
  const analytics = useAnalytics();
  const scaffolderApi = useApi(scaffolderApiRef);
  const { taskId } = useParams();
  const taskStream = useTemplateEventStream(stepIndex);

  const steps = useMemo(
    () =>
      taskStream.task?.spec.steps.map(step => ({
        ...step,
        ...taskStream?.steps?.[step.id],
      })) ?? [],
    [taskStream],
  );

  const [logsVisible, setLogVisibleState] = useState(false);

  // Used dummy string value for `resourceRef` since `allowed` field will always return `false` if `resourceRef` is `undefined`
  const { allowed: canCancelTask } = usePermission({
    permission: templateExecutePermission,
    resourceRef: taskId,
  });

  const { allowed: canReadTask } = usePermission({
    permission: templateReadPermission,
    resourceRef: taskId,
  });

  const { allowed: canCreateTask } = usePermission({
    permission: templateExecutePermission,
    resourceRef: taskId,
  });

  const canStartOver = canReadTask && canCreateTask;

  const activeStep = useMemo(() => {
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].status !== 'open') {
        return i;
      }
    }

    return 0;
  }, [steps]);

  const isRetryableTask =
    taskStream.task?.spec.EXPERIMENTAL_recovery?.EXPERIMENTAL_strategy ===
    'startOver';

  const canRetry = canReadTask && canCreateTask && isRetryableTask;

  const startOver = useCallback(() => {
    const { namespace, name } =
      taskStream.task?.spec.templateInfo?.entity?.metadata ?? {};

    const formData = taskStream.task?.spec.parameters ?? {};

    if (!namespace || !name) {
      return;
    }

    analytics.captureEvent('click', `Task has been started over`);

    setTemplateStepParams(formData);
    setStepPhase('form');
  }, [
    analytics,
    taskStream.task?.spec.parameters,
    taskStream.task?.spec.templateInfo?.entity?.metadata,
    setStepPhase,
    setTemplateStepParams,
  ]);

  const [{ status: _ }, { execute: triggerRetry }] = useAsync(async () => {
    if (templateStepId) {
      analytics.captureEvent('retried', 'Template has been retried');
      await scaffolderApi.retry?.(templateStepId);
    }
  });

  const [{ status: cancelStatus }, { execute: triggerCancel }] = useAsync(
    async () => {
      if (templateStepId) {
        analytics.captureEvent('cancelled', 'Template has been cancelled');
        await scaffolderApi.cancelTask(templateStepId);
      }
    },
  );

  const cancelEnabled = !(taskStream.cancelled || taskStream.completed);
  return {
    taskStream,
    steps,
    activeStep,
    isRetryableTask,
    triggerCancel,
    triggerRetry,
    logsVisible,
    setLogVisibleState,
    startOver,
    templateTitle: `Run of ${
      taskStream.task?.spec.templateInfo?.entity?.metadata.title ||
      taskStream.task?.spec.templateInfo?.entity?.metadata.name
    }`,
    templateUrl: taskStream.task?.spec?.templateInfo?.baseUrl,
    templateSubtitle:
      taskStream.task?.spec.templateInfo?.entity?.metadata.description || '',
    isCancelButtonDisabled:
      !cancelEnabled ||
      (cancelStatus !== 'not-executed' && !isRetryableTask) ||
      !canCancelTask,
    isRetryButtonDisabled: cancelEnabled || !canRetry,
    isStartOverButtonDisabled: cancelEnabled || !canStartOver,
    goldenPathStatus: goldenPathTask.status,
  };
};
