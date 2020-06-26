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
import type { Writable } from 'stream';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { JsonValue } from '@backstage/config';
import { RequiredTemplateValues } from '../templater';
import { Logger } from 'winston';

// Context will be a mutable object which is passed between stages
// To share data, but also thinking that we can pass in functions here too
// To maybe create sub steps or fail the entire thing, or skip stages down the line.
export type StageContext<T> = T & {
  values: RequiredTemplateValues & Record<string, JsonValue>;
  entity: TemplateEntityV1alpha1;
  logger: Logger;
};

export type Stage<T = {}> = {
  log: string[];
  status: 'PENDING' | 'STARTED' | 'COMPLETE' | 'FAILED';
  name: string;
  handler: (ctx: StageContext<T>) => Promise<void>;
};

export type Job = {
  id: string;
  metadata: {
    entity: TemplateEntityV1alpha1;
    values: RequiredTemplateValues & Record<string, JsonValue>;
  };
  status: 'PENDING' | 'STARTED' | 'COMPLETE' | 'FAILED';
  stages: Stage[];
  logStream: Writable;
  logger: Logger;
  error?: Error;
};

export type Processor = {
  create(
    entity: TemplateEntityV1alpha1,
    values: RequiredTemplateValues & Record<string, JsonValue>,
  ): Job;

  get(id: string): Job | undefined;
};
