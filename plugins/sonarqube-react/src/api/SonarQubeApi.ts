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

import { createApiRef } from '@backstage/core-plugin-api';

/** @alpha */
export type MetricKey =
  // alert status
  | 'alert_status'

  // bugs and rating (-> reliability)
  | 'bugs'
  | 'reliability_rating'

  // vulnerabilities and rating (-> security)
  | 'vulnerabilities'
  | 'security_rating'

  // code smells and rating (-> maintainability)
  | 'code_smells'
  | 'sqale_rating'

  // security hotspots
  | 'security_hotspots_reviewed'
  | 'security_review_rating'

  // coverage
  | 'coverage'

  // duplicated lines
  | 'duplicated_lines_density';

/** @alpha */
export type SonarUrlProcessorFunc = (identifier: string) => string;

/**
 * @alpha
 *
 * Define a type to make sure that all metrics are used
 */
export type Metrics = {
  [key in MetricKey]: string | undefined;
};

/** @alpha */
export interface FindingSummary {
  lastAnalysis: string;
  metrics: Metrics;
  projectUrl: string;
  getIssuesUrl: SonarUrlProcessorFunc;
  getComponentMeasuresUrl: SonarUrlProcessorFunc;
  getSecurityHotspotsUrl: () => string;
}

/** @alpha */
export const sonarQubeApiRef = createApiRef<SonarQubeApi>({
  id: 'plugin.sonarqube.service',
});

/** @alpha */
export type SonarQubeApi = {
  getFindingSummary(options: {
    componentKey?: string;
    projectInstance?: string;
  }): Promise<FindingSummary | undefined>;
};
