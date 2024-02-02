/*
 * Copyright 2024 The Backstage Authors
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

/** @public */
export enum WorkstationState {
  STATE_UNSPECIFIED = 'Unespecified',
  STATE_STARTING = 'Starting',
  STATE_RUNNING = 'Running',
  STATE_STOPPING = 'Stopping',
  STATE_STOPPED = 'Stopped',
}

/** @public */
export type WorkstationStateEnumKey = keyof typeof WorkstationState;

/** @public */
export type Workstation = {
  name: string;
  uid: string;
  host: string;
  state: WorkstationStateEnumKey;
};

/** @public */
export enum IAM_WORKSTATIONS_PERMISSION {
  LIST = 'workstations.workstations.list',
  CREATE = 'workstations.workstations.create',
  START = 'workstations.workstations.start',
  STOP = 'workstations.workstations.stop',
  USE = 'workstations.workstations.use',
}
