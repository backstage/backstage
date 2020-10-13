/*
 * Copyright 2020 Spotify AB
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

import { Experiment, Run, Metric } from './MLFlowTypes';

export class MLFlowClient {
  readonly apiHost: string;

  constructor(host: string) {
    this.apiHost = host;
  }

  listExperiments(): Promise<Experiment[]> {
    return this.makeGetRequest('/experiments/list')
      .then(resp => {
        return resp.experiments;
      })
      .catch(_ => []);
  }

  getExperiment(experimentId: string): Promise<Experiment> {
    return this.makeGetRequest(`experiments/get?experiment_id=${experimentId}`)
      .then(resp => resp.experiment)
      .catch(_ => undefined);
  }

  getRun(runId: string): Promise<Run> {
    return this.makeGetRequest(`/runs/get?run_id=${runId}`)
      .then(resp => resp.run)
      .catch(_ => undefined);
  }

  searchRuns(experimentIds: string[]): Promise<Run[]> {
    return this.makePostRequest(`runs/search`, {
      experiment_ids: experimentIds,
    })
      .then(resp => resp.runs)
      .catch(_ => []);
  }

  getMetricHistory(runId: string, metricKey: string): Promise<Metric[]> {
    return this.makeGetRequest(
      `metrics/get-history?run_id=${runId}&metric_key=${metricKey}`,
    )
      .then(resp => resp.metrics)
      .catch(_ => []);
  }

  private makePostRequest(route: string, data: object) {
    return fetch(`${this.apiHost}/${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(resp => resp.json());
  }
  private makeGetRequest(route: string) {
    return fetch(`${this.apiHost}/${route}`).then(resp => resp.json());
  }
}
