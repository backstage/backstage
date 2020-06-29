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
import { Processor, Job, StageContext, StageInput } from './types';
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
      for (const stage of job.stages) {
        // Create a logger for each stage so we can create seperate
        // Streams for each step.
        const { logger, log, stream } = useLogStream({
          id: job.id,
          stage: stage.name,
        });
        // Attach the logger to the stage, and setup some timestamps.
        stage.log = log;
        stage.startedAt = Date.now();

        try {
          // Run the handler with the context created for the Job and some
          // Additional logging helpers.
          const handlerResponse = await stage.handler({
            ...job.context,
            logger,
            logStream: stream,
          });

          // If the handler returns something, then let's merge this onto the ontext
          // For the next stage to use as it might be relevant.
          if (handlerResponse) {
            job.context = {
              ...job.context,
              ...handlerResponse,
            };
          }

          // Complete the current stage
          stage.status = 'COMPLETED';
        } catch (error) {
          // Log to the current stage the error that occured and fail the stage.
          logger.error(`Stage failed with error: ${error.message}`);
          stage.status = 'FAILED';

          // Throw the error so the job can be failed too.
          throw error;
        } finally {
          // Always set the stage end timestamp.
          stage.endedAt = Date.now();
        }
      }

      // If all went to plan, complete the job.
      job.status = 'COMPLETED';
    } catch (error) {
      // If something went wrong, fail the job, and set the error property on the job.
      job.error = { name: error.name, message: error.message };
      job.status = 'FAILED';
    }
  }
}
