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
import { renderHook, waitFor } from '@testing-library/react';
import { useAnalytics, useApi } from '@backstage/core-plugin-api';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import {
  templateExecutePermission,
  templateReadPermission,
} from '@backstage/plugin-golden-paths-common';

import { useTemplateProcessing } from './TemplateProcessing.utils';
import { useTemplateEventStream } from './useTemplateEventStream';
import { useGoldenPathTaskContext } from '../../../useGoldenPathTaskContext';

jest.mock('@backstage/plugin-scaffolder-react', () => {
  const retry = jest.fn(() => Promise.resolve());
  const cancelTask = jest.fn(() => Promise.resolve());
  return {
    scaffolderApiRef: {
      id: 'scaffolder',
      T: { retry, cancelTask },
    },
  };
});

const setTemplateStepParams = jest.fn();
const setStepPhase = jest.fn();
jest.mock('../../../useGoldenPathTaskContext', () => ({
  useGoldenPathTaskContext: jest.fn(() => ({
    value: {
      setTemplateStepParams,
      setStepPhase,
      goldenPathTask: { status: 'completed' },
    },
  })),
}));

jest.mock('./useTemplateEventStream', () => ({
  useTemplateEventStream: jest.fn(() => ({})),
}));

jest.mock('@backstage/core-plugin-api', () => {
  const captureEvent = jest.fn();
  return {
    useApi: jest.fn(({ T }) => ({ ...T })),
    useAnalytics: jest.fn(() => ({
      captureEvent,
    })),
  };
});

jest.mock('@backstage/plugin-golden-paths-common', () => ({
  templateExecutePermission: {},
  templateReadPermission: {},
}));

// mock implementation of usePermission to easily control returned value
jest.mock('@backstage/plugin-permission-react', () => ({
  usePermission: jest.fn(({ permission }) => ({
    allowed: permission.name === 'allow',
  })),
}));

describe('useTemplateProcessing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a proper structure of an object', () => {
    const { result } = renderHook(() => useTemplateProcessing());

    expect(result.current.taskStream).toEqual({});
    expect(result.current.steps).toEqual([]);
    expect(result.current.activeStep).toBe(0);
    expect(result.current.isRetryableTask).toBe(false);
    expect(result.current.triggerCancel).toBeDefined();
    expect(result.current.triggerRetry).toBeDefined();
    expect(result.current.logsVisible).toBe(false);
    expect(result.current.setLogVisibleState).toBeDefined();
    expect(result.current.startOver).toBeDefined();
    expect(result.current.templateTitle).toContain('Run of');
    expect(result.current.templateSubtitle).toBe('');
    expect(result.current.isCancelButtonDisabled).toBeDefined();
    expect(result.current.isRetryButtonDisabled).toBeDefined();
    expect(result.current.isStartOverButtonDisabled).toBeDefined();
  });

  describe('returns `isCancelButtonDisabled`', () => {
    it('is truthy, when task is cancelled', () => {
      (useTemplateEventStream as jest.Mock).mockReturnValueOnce({
        cancelled: true,
      });

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isCancelButtonDisabled).toBe(true);
    });

    it('is truthy, when task is completed', () => {
      (useTemplateEventStream as jest.Mock).mockReturnValueOnce({
        completed: true,
      });

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isCancelButtonDisabled).toBe(true);
    });

    it('is truthy, when permission to cancel is denied', () => {
      templateExecutePermission.name = 'deny';

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isCancelButtonDisabled).toBe(true);
    });
  });

  describe('returns `isRetryButtonDisabled`', () => {
    it('is truthy, when task is neither cancelled nor completed', () => {
      (useTemplateEventStream as jest.Mock).mockReturnValueOnce({
        cancelled: false,
        completed: false,
      });

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isRetryButtonDisabled).toBe(true);
    });

    it('is truthy, when task is not retryable', () => {
      (useTemplateEventStream as jest.Mock).mockReturnValueOnce({
        task: {
          spec: {
            EXPERIMENTAL_recovery: { EXPERIMENTAL_strategy: 'not-startOver' },
            steps: [],
          },
        },
      });

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isRetryButtonDisabled).toBe(true);
    });

    it('is truthy, when permission to execute is denied', () => {
      templateExecutePermission.name = 'deny';

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isRetryButtonDisabled).toBe(true);
    });

    it('is truthy, when permission to read is denied', () => {
      templateReadPermission.name = 'deny';

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isRetryButtonDisabled).toBe(true);
    });

    it('is falsy, when permissions to read & execute are allowed, task is retryable and is cancelled', () => {
      (useTemplateEventStream as jest.Mock).mockReturnValueOnce({
        cancelled: true,
        task: {
          spec: {
            EXPERIMENTAL_recovery: { EXPERIMENTAL_strategy: 'startOver' },
            steps: [],
          },
        },
      });
      templateReadPermission.name = 'allow';
      templateExecutePermission.name = 'allow';

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isRetryButtonDisabled).toBe(false);
    });

    it('is falsy, when permissions to read & execute are allowed, task is retryable and is completed', () => {
      (useTemplateEventStream as jest.Mock).mockReturnValueOnce({
        completed: true,
        task: {
          spec: {
            EXPERIMENTAL_recovery: { EXPERIMENTAL_strategy: 'startOver' },
            steps: [],
          },
        },
      });
      templateReadPermission.name = 'allow';
      templateExecutePermission.name = 'allow';

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isRetryButtonDisabled).toBe(false);
    });
  });

  describe('returns `isStartOverButtonDisabled`', () => {
    it('is truthy, when task is neither cancelled nor completed', () => {
      (useTemplateEventStream as jest.Mock).mockReturnValueOnce({
        completed: false,
        cancelled: false,
      });

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isStartOverButtonDisabled).toBe(true);
    });

    it('is truthy, when permission to execute is denied', () => {
      templateExecutePermission.name = 'deny';

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isStartOverButtonDisabled).toBe(true);
    });

    it('is truthy, when permission to read is denied', () => {
      templateReadPermission.name = 'deny';

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isStartOverButtonDisabled).toBe(true);
    });

    it('is falsy, when permissions to read & execute are allowed and the task is completed', () => {
      (useTemplateEventStream as jest.Mock).mockReturnValueOnce({
        completed: true,
      });
      templateReadPermission.name = 'allow';
      templateExecutePermission.name = 'allow';

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isStartOverButtonDisabled).toBe(false);
    });

    it('is falsy, when permissions to read & execute are allowed and the task is cancelled and not completed', () => {
      (useTemplateEventStream as jest.Mock).mockReturnValueOnce({
        cancelled: true,
        completed: false,
      });
      templateReadPermission.name = 'allow';
      templateExecutePermission.name = 'allow';

      const { result } = renderHook(() => useTemplateProcessing());

      expect(result.current.isStartOverButtonDisabled).toBe(false);
    });
  });

  describe('returns `startOver`', () => {
    it('does nothing, when no namespace exists in template info', () => {
      const captureEvent = jest.spyOn(useAnalytics(), 'captureEvent');
      (useTemplateEventStream as jest.Mock).mockReturnValueOnce({
        task: {
          spec: {
            templateInfo: { entity: { metadata: { namespace: undefined } } },
            steps: [],
          },
        },
      });

      const { result } = renderHook(() => useTemplateProcessing());

      expect(captureEvent).toHaveBeenCalledTimes(0);
      result.current.startOver();
      expect(captureEvent).toHaveBeenCalledTimes(0);
    });

    it('does nothing, when no name exists in template info', () => {
      const captureEvent = jest.spyOn(useAnalytics(), 'captureEvent');
      (useTemplateEventStream as jest.Mock).mockReturnValueOnce({
        task: {
          spec: {
            templateInfo: { entity: { metadata: { name: undefined } } },
            steps: [],
          },
        },
      });

      const { result } = renderHook(() => useTemplateProcessing());

      expect(captureEvent).toHaveBeenCalledTimes(0);
      result.current.startOver();
      expect(captureEvent).toHaveBeenCalledTimes(0);
    });

    it('calls `analytics.captureEvent`, `setTemplateStepParams` and `previousPhase`, when name and namespace exist in template info', () => {
      const captureEvent = jest.spyOn(useAnalytics(), 'captureEvent');
      (useTemplateEventStream as jest.Mock).mockReturnValueOnce({
        task: {
          spec: {
            templateInfo: {
              entity: { metadata: { name: 'test', namespace: 'test' } },
            },
            steps: [],
          },
        },
      });

      const { result } = renderHook(() => useTemplateProcessing());

      expect(captureEvent).toHaveBeenCalledTimes(0);
      expect(setTemplateStepParams).toHaveBeenCalledTimes(0);
      expect(setStepPhase).toHaveBeenCalledTimes(0);

      result.current.startOver();

      expect(captureEvent).toHaveBeenCalledTimes(1);
      expect(setTemplateStepParams).toHaveBeenCalledTimes(1);
      expect(setStepPhase).toHaveBeenCalledTimes(1);
    });
  });

  describe('returns `triggerRetry`', () => {
    it('does nothing, when no `templateStepId` is available', async () => {
      const captureEvent = jest.spyOn(useAnalytics(), 'captureEvent');

      const { result } = renderHook(() => useTemplateProcessing());

      expect(captureEvent).toHaveBeenCalledTimes(0);

      await waitFor(async () => {
        await result.current.triggerRetry();
        expect(captureEvent).toHaveBeenCalledTimes(0);
      });
    });

    it('calls `analytics.captureEvent` and `scaffolderApi.retry`, when `templateStepId` is available', async () => {
      const captureEvent = jest.spyOn(useAnalytics(), 'captureEvent');
      const spyRetry = jest.spyOn(useApi(scaffolderApiRef), 'retry');
      (useGoldenPathTaskContext as jest.Mock).mockReturnValueOnce({
        value: {
          templateStepId: '222',
          goldenPathTask: { status: 'completed' },
        },
      });

      const { result } = renderHook(() => useTemplateProcessing());

      expect(captureEvent).toHaveBeenCalledTimes(0);
      expect(spyRetry).toHaveBeenCalledTimes(0);

      await waitFor(async () => {
        await result.current.triggerRetry();

        expect(captureEvent).toHaveBeenCalledTimes(1);
        expect(spyRetry).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('returns `triggerCancel`', () => {
    it('does nothing, when no `templateStepId` is available', async () => {
      const captureEvent = jest.spyOn(useAnalytics(), 'captureEvent');
      const { result } = renderHook(() => useTemplateProcessing());

      expect(captureEvent).toHaveBeenCalledTimes(0);

      await waitFor(async () => {
        await result.current.triggerCancel();

        expect(captureEvent).toHaveBeenCalledTimes(0);
      });
    });

    it('calls `analytics.captureEvent` and `scaffolderApi.retry`, when `templateStepId` is available', async () => {
      const captureEvent = jest.spyOn(useAnalytics(), 'captureEvent');
      const spyCancel = jest.spyOn(useApi(scaffolderApiRef), 'cancelTask');
      (useGoldenPathTaskContext as jest.Mock).mockReturnValueOnce({
        value: {
          templateStepId: '123',
          goldenPathTask: { status: 'completed' },
        },
      });

      const { result } = renderHook(() => useTemplateProcessing());

      expect(captureEvent).toHaveBeenCalledTimes(0);
      expect(spyCancel).toHaveBeenCalledTimes(0);

      await waitFor(async () => {
        await result.current.triggerCancel();

        expect(captureEvent).toHaveBeenCalledTimes(1);
        expect(spyCancel).toHaveBeenCalledTimes(1);
      });
    });
  });
});
