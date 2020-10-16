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

import { ArtifactList, Experiment, Metric, Run } from './MLFlowTypes';

export class MLFlowClient {
  readonly apiHost: string;

  constructor(host: string) {
    this.apiHost = host;
  }

  listExperiments(): Promise<Experiment[]> {
    return this.makeGetRequest('experiments/list')
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

  setExperimentTag(experimentId: string, key: String, value: String) {
    return this.makePostRequest('experiments/set-experiment-tag', {
      experiment_id: experimentId,
      key: key,
      value: value,
    });
  }

  getRun(runId: string): Promise<Run> {
    return this.makeGetRequest(`runs/get?run_id=${runId}`)
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

  setTag(runId: string, key: string, value: string) {
    return this.makePostRequest('runs/set-tag', {
      run_id: runId,
      key: key,
      value: value,
    });
  }

  deleteTag(runId: string, key: string) {
    return this.makePostRequest('runs/delete-tag', { run_id: runId, key: key });
  }

  listArtifacts(
    runId: string,
    path?: string,
    pageToken?: string,
  ): Promise<ArtifactList> {
    const pathArg = path ? `&path=${path}` : '';
    const pageTokenArg = pageToken ? `&page_token=${pageToken}` : '';
    return this.makeGetRequest(
      `artifacts/list?run_id=${runId}${pathArg}${pageTokenArg}`,
    );
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
