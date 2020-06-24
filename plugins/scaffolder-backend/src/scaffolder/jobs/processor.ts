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
import { Processor, Job, ProcessorContstructorArgs } from './types';
import { JsonValue } from '@backstage/config';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { PassThrough, Writable } from 'stream';
import uuid from 'uuid';
import winston from 'winston';
import { RequiredTemplateValues } from '../templater';
import { createNewRootLogger } from '@backstage/backend-common';

export class JobProcessor implements Processor {
  private preparers: ProcessorContstructorArgs['preparers'];
  private templater: ProcessorContstructorArgs['templater'];
  private dockerClient: ProcessorContstructorArgs['dockerClient'];
  private jobs = new Map<string, Job>();

  constructor({
    preparers,
    templater,
    dockerClient,
  }: ProcessorContstructorArgs) {
    this.preparers = preparers;
    this.templater = templater;
    this.dockerClient = dockerClient;
    return this;
  }

  create(
    entity: TemplateEntityV1alpha1,
    values: RequiredTemplateValues & Record<string, JsonValue>,
  ): Job {
    const id = uuid.v4();
    const log: string[] = [];
    const logStream = new PassThrough();
    logStream.on('data', chunk => log.push(chunk.toString()));

    const logger = createNewRootLogger();
    logger.add(new winston.transports.Stream({ stream: logStream }));

    const job: Job = {
      id,
      logStream,
      logger,
      log,
      status: 'PENDING',
      metadata: {
        entity,
        values,
      },
    };

    this.jobs.set(job.id, job);
    return job;
  }
  get(id: string): Job | undefined {
    return this.jobs.get(id);
  }
  async run(job: Job) {
    if (job.status !== 'PENDING') {
      throw new Error('Job is not in pending state');
    }

    const { logger, logStream } = job;

    try {
      logger.debug('Prepare started');
      job.status = 'PREPARING';
      const entity = job.metadata.entity;
      const preparer = this.preparers.get(entity);
      const skeletonPath = await preparer.prepare(entity);
      logger.debug('Prepare finished', {
        skeletonPath,
      });

      logger.debug('Templating started');
      job.status = 'TEMPLATING';
      // Run the templater on the mock directory with values from the post body
      const templatedPath = await this.templater.run({
        directory: skeletonPath,
        values: job.metadata.values,
        dockerClient: this.dockerClient,
        logStream,
      });
      logger.debug('Template finished', { templatedPath });

      job.status = 'STORING';
      // TODO(blam): Implement VCS Push here

      job.status = 'COMPLETE';
    } catch (ex) {
      job.error = ex;
      job.status = 'FAILED';
      logger.error(`job ${job.id} failed with reason: ${ex}`);
    }
  }
}
