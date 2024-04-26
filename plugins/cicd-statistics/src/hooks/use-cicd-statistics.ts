/*
 * Copyright 2022 The Backstage Authors
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

import { useState, useEffect } from 'react';
import { throttle } from 'lodash';
import { Entity } from '@backstage/catalog-model';

import {
  CicdState,
  FetchBuildsOptions,
  AbortError,
  FilterStatusType,
  FilterBranchType,
  UpdateProgress,
} from '../apis';
import { ProgressType } from '../components/progress';
import { useCicdStatisticsApi } from './use-cicd-statistics-api';

export interface UseCicdStatisticsOptions {
  entity: Entity;
  abortController: AbortController;
  timeFrom: Date;
  timeTo: Date;
  filterStatus: Array<FilterStatusType | 'all'>;
  filterType: FilterBranchType | 'all';
}

export function useCicdStatistics(
  options: UseCicdStatisticsOptions,
): ProgressType<CicdState> {
  const {
    entity,
    abortController,
    timeFrom,
    timeTo,
    filterStatus,
    filterType,
  } = options;

  const [state, setState] = useState<ProgressType<CicdState>>({
    loading: true,
  });

  const cicdStatisticsApi = useCicdStatisticsApi();

  useEffect(() => {
    if (!cicdStatisticsApi) {
      setState({ error: new Error('No CI/CD Statistics API installed') });
      return () => {};
    }

    let mounted = true;
    let completed = false; // successfully or failed

    const updateProgressImpl: UpdateProgress = (_count, _total?, _started?) => {
      if (!mounted || completed) {
        return;
      }

      if (Array.isArray(_count)) {
        // Multi-progress
        setState({
          loading: true,
          steps: _count.map(step => ({
            title: step.title,
            progress: !step.total ? 0 : step.completed / step.total,
            progressBuffer: !step.total ? 0 : (step.started ?? 0) / step.total,
          })),
        });
      } else {
        // Single-progress
        const count = _count;
        const total = _total as number;
        const started = (_started as number) ?? 0;
        setState({
          loading: true,
          progress: !total ? 0 : count / total,
          progressBuffer: !total ? 0 : started / total,
        });
      }
    };

    const updateProgress = throttle(
      updateProgressImpl,
      200,
      // throttle doesn't handle types of multi-signature functions
    ) as any as UpdateProgress;

    const fetchOptions: FetchBuildsOptions = {
      entity,
      updateProgress,
      abortSignal: abortController.signal,
      timeFrom,
      timeTo,
      filterStatus,
      filterType,
    };

    (async () => {
      return cicdStatisticsApi.fetchBuilds(fetchOptions);
    })()
      .then(builds => {
        completed = true;
        if (mounted) {
          setState({
            value: builds,
          });
        }
      })
      .catch(err => {
        completed = true;
        if (mounted) {
          setState({
            error: abortController.signal.aborted ? new AbortError() : err,
          });
        }
      });

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [
    abortController,
    entity,
    timeFrom,
    timeTo,
    filterStatus,
    filterType,
    cicdStatisticsApi,
  ]);

  return state;
}
