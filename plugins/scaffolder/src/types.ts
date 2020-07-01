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
export type Job = {
  id: string;
  metadata: {
    entity: any;
    values: any;
    remoteUrl?: string;
  };
  status: 'PENDING' | 'STARTED' | 'COMPLETED' | 'FAILED';
  stages: Stage[];
  error?: Error;
};

export type Stage = {
  name: string;
  log: string[];
  status: 'PENDING' | 'STARTED' | 'COMPLETED' | 'FAILED';
  startedAt: string;
  endedAt?: string;
};
