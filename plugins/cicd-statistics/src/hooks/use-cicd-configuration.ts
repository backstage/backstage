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
import { useEntity } from '@backstage/plugin-catalog-react';

import { CicdConfiguration, statusTypes } from '../apis';
import { ProgressType } from '../components/progress';
import { defaultFormatStageName } from '../utils/stage-names';
import { useCicdStatisticsApi } from './use-cicd-statistics-api';

export function useCicdConfiguration(): ProgressType<CicdConfiguration> {
  const cicdStatisticsApi = useCicdStatisticsApi();
  const { entity } = useEntity();

  const [state, setState] = useState<ProgressType<CicdConfiguration>>({
    loading: true,
  });

  useEffect(() => {
    if (!cicdStatisticsApi) {
      setState({ error: new Error('No CI/CD Statistics API installed') });
      return;
    }

    cicdStatisticsApi
      .getConfiguration({ entity })
      .then(configuration => {
        const {
          availableStatuses = statusTypes,
          formatStageName = defaultFormatStageName,
          defaults = {},
        } = configuration;
        setState({
          value: {
            availableStatuses,
            formatStageName,
            defaults,
          },
        });
      })
      .catch(error => {
        setState({ error });
      });
  }, [cicdStatisticsApi, entity]);

  return state;
}
