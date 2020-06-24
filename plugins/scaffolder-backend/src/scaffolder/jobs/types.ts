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
import { PreparerBuilder } from '../prepare';
import Docker from 'dockerode';
import { TemplaterBase, RequiredTemplateValues } from '../templater';
import { Logger } from 'winston';

export type Job = {
  id: string;
  metadata: {
    entity: TemplateEntityV1alpha1;
    values: RequiredTemplateValues & Record<string, JsonValue>;
  };
  status:
    | 'PENDING'
    | 'PREPARING'
    | 'TEMPLATING'
    | 'STORING'
    | 'COMPLETE'
    | 'FAILED';
  logStream: Writable;
  log: string[];
  logger: Logger;
  error?: Error;
};

export type ProcessorContstructorArgs = {
  preparers: PreparerBuilder;
  templater: TemplaterBase;
  logger: Logger;
  dockerClient: Docker;
};

export type Processor = {
  create(
    entity: TemplateEntityV1alpha1,
    values: RequiredTemplateValues & Record<string, JsonValue>,
  ): Job;

  get(id: string): Job | undefined;
};
