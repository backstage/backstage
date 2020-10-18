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

export { plugin } from './plugin';
export { ExperimentOverviewRouter, RunTableRouter } from './components/Router';
export { ExperimentPage } from './components/ExperimentPage';
export { RunTablePage } from './components/RunTablePage';
import { MLFlowClient } from './MLFlowClient';

export const mlFlowClient: MLFlowClient = new MLFlowClient(
  'http://localhost:7000/api/proxy/mlflow/api/2.0/mlflow',
);
