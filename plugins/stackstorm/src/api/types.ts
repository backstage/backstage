/*
 * Copyright 2023 The Backstage Authors
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

export const stackstormApiRef = createApiRef<StackstormApi>({
  id: 'plugin.stackstorm.service',
});

export type Execution = {
  id: string;
  action: Action;
  status: string;
  start_timestamp: string;
  end_timestamp: string;
  result: object;
  parameters: object;
  elapsed_seconds: number;
  log: ExecutionLog[];
};

export type ExecutionLog = {
  status: string;
  timestamp: string;
};

export type Action = {
  id: string;
  name: string;
  ref: string;
  pack: string;
  description: string;
  runner_type: string;
};

export type Pack = {
  ref: string;
  description: string;
  version: string;
};

export interface StackstormApi {
  getExecutions(limit: number, offset: number): Promise<Execution[]>;
  getExecution(id: string): Promise<Execution>;
  getPacks(): Promise<Pack[]>;
  getActions(pack: string): Promise<Action[]>;
  getExecutionHistoryUrl(id: string): string;
  getActionUrl(ref: string): string;
}
