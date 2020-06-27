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
    };

    const job: Job = {
      id,
      logStream: stream,
      context,
      stages,
      status: 'PENDING',
    };

    this.jobs.set(job.id, job);

    return job;
  }

  get(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  private async prepare(job: Job): Promise<string> {
    job.status = 'PREPARING';
    const entity = job.metadata.entity;
    const preparer = this.preparers.get(entity);
    return await preparer.prepare(entity);
  }

  private async run(job: Job, directory: string): Promise<string> {
    job.status = 'TEMPLATING';
    return await this.templater.run({
      directory,
      values: job.metadata.values,
      dockerClient: this.dockerClient,
      logStream: job.logStream,
    });
  }

  private async store(job: Job): Promise<void> {
    job.status = 'STORING';
  }

  private async complete(job: Job): Promise<void> {
    job.status = 'COMPLETE';
  }

  async process(job: Job) {
    if (job.status !== 'PENDING') {
      throw new Error("Job is not in a 'PENDING' state");
    }

    try {
      const skeletonPath = await this.prepare(job);
      await this.run(job, skeletonPath);
      await this.store(job);
      await this.complete(job);
    } catch (error) {
      job.error = error;
      job.status = 'FAILED';
      job.logger.error(`Job failed with error ${error.message}`);
    }
  }
}
