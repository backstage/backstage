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
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import usePrevious from 'react-use/esm/usePrevious';
import {
  createVersionedContext,
  createVersionedValueMap,
  useVersionedContext,
} from '@backstage/version-bridge';
import {
  GoldenPathStatuses,
  GoldenPathTask,
} from '@backstage/plugin-golden-paths-react';
import { JsonObject } from '@backstage/types';

import { useGoldenPathStatuses } from '../../hooks/useGoldenPathStatuses';
import { useMapStatuses } from '../../hooks/useMapStatuses';

type StepPhase = 'form' | 'processing';

export type GoldenPathTaskContext = {
  goldenPathTask: GoldenPathTask;
  setGoldenPathTask: Dispatch<SetStateAction<GoldenPathTask>>;
  templateStepId: string;
  setTemplateStepId: Dispatch<SetStateAction<string>>;
  templateStepParams: JsonObject;
  setTemplateStepParams: Dispatch<SetStateAction<JsonObject>>;
  stepIndex: number;
  setStepIndex: Dispatch<SetStateAction<number>>;
  stepPhase: StepPhase;
  setStepPhase: Dispatch<SetStateAction<StepPhase>>;
  goldenPathStatuses: {
    loading: boolean;
    error?: Error;
    value?: GoldenPathStatuses;
  };
  fetchGoldenPathStatuses: () => Promise<GoldenPathStatuses>;
  mappedStatuses: ReturnType<typeof useMapStatuses>;
  getGoldenPathTask: (taskIdParam?: string) => Promise<GoldenPathTask>;
};

const NewGoldenPathTaskContext = createVersionedContext<{
  1: GoldenPathTaskContext;
}>('golden-path-task-context');

type GoldenPathTaskContextProviderProps = PropsWithChildren<{
  task: GoldenPathTask;
  getGoldenPathTask: (taskIdParam?: string) => Promise<GoldenPathTask>;
}>;

export const GoldenPathTaskContextProvider = ({
  children,
  task,
  getGoldenPathTask,
}: GoldenPathTaskContextProviderProps) => {
  const [goldenPathTask, setGoldenPathTask] = useState(task);
  const [templateStepId, setTemplateStepId] = useState('');
  const [templateStepParams, setTemplateStepParams] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [stepPhase, setStepPhase] = useState<StepPhase>('form');

  const [goldenPathStatuses, fetchGoldenPathStatuses] = useGoldenPathStatuses();

  const mappedStatuses = useMapStatuses(
    goldenPathTask.spec.steps,
    goldenPathStatuses.value?.statuses,
  );

  const prevMappedStatuses = usePrevious(mappedStatuses);
  useEffect(() => {
    if (prevMappedStatuses?.length === 0 && mappedStatuses.length > 0) {
      const arrayOfStatuses = mappedStatuses.map(({ status }) => status);

      const enabledIndex = arrayOfStatuses.indexOf('enabled');
      const activeIndex = arrayOfStatuses.indexOf('active');
      const lastCompletedIndex = arrayOfStatuses.lastIndexOf('completed');
      const lastSkippedIndex = arrayOfStatuses.lastIndexOf('skipped');
      const lastFailedIndex = arrayOfStatuses.lastIndexOf('failed');

      const initialStepindex = Math.max(
        enabledIndex,
        activeIndex,
        lastCompletedIndex,
        lastSkippedIndex,
        lastFailedIndex,
      );

      if (initialStepindex > 0) {
        setStepIndex(initialStepindex);
      }

      if (
        [activeIndex, lastCompletedIndex, lastFailedIndex].includes(
          initialStepindex,
        )
      ) {
        setStepPhase('processing');
      }
    }
  }, [mappedStatuses, prevMappedStatuses?.length]);

  const value: GoldenPathTaskContext = {
    goldenPathTask,
    setGoldenPathTask,
    templateStepId,
    setTemplateStepId,
    templateStepParams,
    setTemplateStepParams,
    stepIndex,
    setStepIndex,
    stepPhase,
    setStepPhase,
    goldenPathStatuses,
    fetchGoldenPathStatuses,
    mappedStatuses,
    getGoldenPathTask,
  };

  return (
    <NewGoldenPathTaskContext.Provider
      value={createVersionedValueMap({ 1: value })}
    >
      {children}
    </NewGoldenPathTaskContext.Provider>
  );
};

/**
 * Grab all values related to Golden Path task from the context.
 * Throws if the context is not available.
 */
export const useGoldenPathTaskContext = () => {
  const versionedHolder = useVersionedContext<{ 1: GoldenPathTaskContext }>(
    'golden-path-task-context',
  );

  if (!versionedHolder) {
    throw new Error('Golden Path Task context is not available');
  }

  const value = versionedHolder.atVersion(1);
  if (!value) {
    throw new Error('GoldenPathTaskContext v1 not available');
  }

  return { value };
};
