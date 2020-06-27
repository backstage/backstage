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
import { Processor, Job, Stage, StageContext, StageInput } from './types';
import { JsonValue } from '@backstage/config';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import * as uuid from 'uuid';
import Docker from 'dockerode';
import { RequiredTemplateValues, TemplaterBase } from '../stages/templater';
import { PreparerBuilder } from '../stages/prepare';
import { useLogStream } from './logger';

export type JobProcessorArguments = {
  preparers: PreparerBuilder;
  templater: TemplaterBase;
  dockerClient: Docker;
};

export type JobAndDirectoryTuple = {
  job: Job;
  directory: string;
};

export class JobProcessor implements Processor {
  private jobs = new Map<string, Job>();

  create({
    entity,
    values,
    stages,
  }: {
    entity: TemplateEntityV1alpha1;
    values: RequiredTemplateValues & Record<string, JsonValue>;
    stages: StageInput[];
  }): Job {
    const id = uuid.v4();
    const { logger, stream } = useLogStream({ id });

    const context: StageContext = {
      entity,
      values,
      logger,
      logStream: stream,
    };

    const job: Job = {
      id,
      logStream: stream,
      context,
      stages: stages.map(stage => ({
        handler: stage.handler,
        log: [],
        name: stage.name,
        status: 'PENDING',
      })),
      status: 'PENDING',
    };

    this.jobs.set(job.id, job);

    return job;
  }

  get(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  async run(job: Job): Promise<void> {
    if (job.status !== 'PENDING') {
      throw new Error("Job is not in a 'PENDING' state");
    }

    job.status = 'STARTED';

    try {
      for (const entry of job.stages) {
        const { logger, log, stream } = useLogStream({
          id: job.id,
          stage: entry.name,
        });
        try {
          entry.startedAt = Date.now();

          entry.log = log;

          const handler = await entry.handler({
            ...job.context,
            logger,
            logStream: stream,
          });

          job.context = {
            ...job.context,
            ...handler,
          };

          entry.status = 'COMPLETED';
        } catch (error) {
          logger.error(error);
          entry.status = 'FAILED';
          throw error;
        } finally {
          entry.endedAt = Date.now();
        }
      }
      job.status = 'COMPLETED';
    } catch (error) {
      job.error = { name: error.name, message: error.message };
      job.status = 'FAILED';
      job.context.logger.error(`Job failed with error ${error.message}`);
    }
  }
}
