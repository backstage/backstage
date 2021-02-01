/*
 * Copyright 2021 Spotify AB
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

import { Entity, EntityName } from '@backstage/catalog-model';
import { useCallback, useState } from 'react';
import { AnalyzeResult } from '../api';

// the configuration of the stepper
export type ImportFlows =
  | 'unknown'
  | 'single-location'
  | 'multiple-locations'
  | 'no-location';

type ImportStateTypes = 'analyze' | 'prepare' | 'review' | 'finish';

// a list that shows the order of states
const importStates: ImportStateTypes[] = [
  'analyze',
  'prepare',
  'review',
  'finish',
];

// result of the prepare state
export type PrepareResult =
  | {
      type: 'locations';
      locations: Array<{
        target: string;
        entities: EntityName[];
      }>;
    }
  | {
      type: 'repository';
      url: string;
      integrationType: string;
      pullRequest: {
        url: string;
      };
      locations: Array<{
        target: string;
        entities: EntityName[];
      }>;
    };

// result of the review result
export type ReviewResult =
  | {
      type: 'locations';
      locations: Array<{
        target: string;
        entities: Entity[];
      }>;
    }
  | {
      type: 'repository';
      url: string;
      integrationType: string;
      pullRequest: {
        url: string;
      };
      locations: Array<{
        target: string;
        entities: Entity[];
      }>;
    };

// the type interfaces that are available in each state. every state provides
// already known information and means to go to the next, or the previous step.
type State =
  | {
      activeState: 'analyze';
      onAnalysis: (
        flow: ImportFlows,
        url: string,
        result: AnalyzeResult,
        opts?: { prepareResult?: PrepareResult },
      ) => void;
    }
  | {
      activeState: 'prepare';
      analyzeResult: AnalyzeResult;
      prepareResult?: PrepareResult;
      onPrepare: (
        result: PrepareResult,
        opts?: { notRepeatable?: boolean },
      ) => void;
    }
  | {
      activeState: 'review';
      analyzeResult: AnalyzeResult;
      prepareResult: PrepareResult;
      onReview: (result: ReviewResult) => void;
    }
  | {
      activeState: 'finish';
      analyzeResult: AnalyzeResult;
      prepareResult: PrepareResult;
      reviewResult: ReviewResult;
    };

export type ImportState = State & {
  activeFlow: ImportFlows;
  activeStepNumber: number;
  analysisUrl?: string;

  onGoBack?: () => void;
  onReset: () => void;
};

/**
 * A hook that manages the state machine of the form. It handles different flows
 * which each can implement up to four states:
 * 1. analyze
 * 2. preview (skippable from analyze->review)
 * 3. review
 * 4. finish
 *
 * @param opts options
 */
export const useImportState = (opts?: { initialUrl?: string }): ImportState => {
  // state management for the results of the individual states
  const [results, setResults] = useState<{
    activeFlow: ImportFlows;
    activeState: ImportStateTypes;
    analysisUrl?: string;
    analyzeResult?: AnalyzeResult;
    prepareResult?: PrepareResult;
    reviewResult?: ReviewResult;
  }>({
    activeFlow: 'unknown',
    activeState: importStates[0],
    analysisUrl: opts?.initialUrl,
  });

  // for going back
  const [previewsSteps, setPreviousSteps] = useState<ImportStateTypes[]>([]);

  // compute the next state to use
  const prepareNextStep = useCallback(
    (
      fromState: ImportStateTypes,
      opts?: { skip?: boolean; clearHistory?: boolean },
    ) => {
      if (opts?.clearHistory) {
        setPreviousSteps([]);
      } else {
        setPreviousSteps(s => s.concat(fromState));
      }
      return importStates[
        importStates.indexOf(fromState) + (opts?.skip ? 2 : 1)
      ];
    },
    [],
  );

  const onGoBack = useCallback(() => {
    if (previewsSteps.length > 0) {
      setResults(old => ({
        ...old,
        activeState: previewsSteps[previewsSteps.length - 1],
      }));
      setPreviousSteps(previewsSteps.slice(0, previewsSteps.length - 1));
    }
  }, [previewsSteps]);

  const onAnalysis = (
    flow: ImportFlows,
    url: string,
    result: AnalyzeResult,
    opts?: { prepareResult?: PrepareResult },
  ) => {
    if (results.activeState !== 'analyze') {
      throw new Error("Can't analyze!");
    }

    setResults(old => ({
      ...old,
      analysisUrl: url,
      activeFlow: flow,
      activeState: prepareNextStep('analyze', {
        skip: opts?.prepareResult !== undefined,
      }),
      analyzeResult: result,
      prepareResult: opts?.prepareResult,
    }));
  };

  const onPrepare = (
    result: PrepareResult,
    opts?: { notRepeatable?: boolean },
  ) => {
    if (results.activeState !== 'prepare') {
      throw new Error("Can't prepare!");
    }

    setResults(old => ({
      ...old,
      prepareResult: result,
      activeState: prepareNextStep('prepare', {
        clearHistory: opts?.notRepeatable,
      }),
    }));
  };

  const onReview = (result: ReviewResult) => {
    if (results.activeState !== 'review') {
      throw new Error("Can't prepare!");
    }

    setResults(old => ({
      ...old,
      reviewResult: result,
      activeState: prepareNextStep('review'),
    }));
  };

  const onReset = useCallback(() => {
    setResults(old => ({
      activeFlow: 'unknown',
      activeState: importStates[0],
      analysisUrl: opts?.initialUrl,

      // we keep the old reviewResult since the form is animated and an
      // undefined value might crash the last step.
      reviewResult: old.reviewResult,
    }));
    setPreviousSteps([]);
  }, [opts?.initialUrl]);

  return {
    activeFlow: results.activeFlow,
    activeStepNumber: importStates.indexOf(results.activeState),
    analysisUrl: results.analysisUrl,

    activeState: results.activeState,
    analyzeResult: results.analyzeResult!,
    prepareResult: results.prepareResult!,
    reviewResult: results.reviewResult!,

    onAnalysis,
    onPrepare,
    onReview,

    onGoBack: previewsSteps.length > 0 ? onGoBack : undefined,
    onReset,
  };
};
