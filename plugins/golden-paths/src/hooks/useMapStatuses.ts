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
import { useMemo } from 'react';
import {
  SerializedTaskStatus,
  TaskStep,
} from '@backstage/plugin-golden-paths-common';

export const useMapStatuses = (
  steps: TaskStep[],
  statuses?: SerializedTaskStatus[],
) =>
  useMemo(() => {
    if (!statuses) return [];

    const stepsWithStatuses = steps.map(step => ({
      ...step,
      status: statuses.find(({ templateId }) => templateId === step.id)?.status,
    }));

    const stepsWithEnabled = stepsWithStatuses.map((step, index) => {
      if (index === 0 && !step.status) return { ...step, status: 'enabled' };

      if (
        !step.status &&
        ['completed', 'skipped', 'missing', 'marked_as_done'].includes(
          stepsWithStatuses[index - 1].status || '',
        )
      )
        return { ...step, status: 'enabled' };

      return step;
    });

    return stepsWithEnabled;
  }, [statuses, steps]);
