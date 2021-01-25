/*
 * Copyright 2021 Spotify AB
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

import { PassThrough } from 'stream';
import { Logger } from 'winston';
import * as winston from 'winston';
import Docker from 'dockerode';
import { TaskBroker, Task } from './types';
import { CatalogEntityClient } from '../../lib/catalog';
import {
  FilePreparer,
  parseLocationAnnotation,
  PreparerBuilder,
  TemplaterBuilder,
  PublisherBuilder,
} from '../stages';

type Options = {
  logger: Logger;
  taskBroker: TaskBroker;
  workingDirectory: string;
  dockerClient: Docker;
  entityClient: CatalogEntityClient;
  preparers: PreparerBuilder;
  templaters: TemplaterBuilder;
  publishers: PublisherBuilder;
};

export class TaskWorker {
  constructor(private readonly options: Options) {}

  start() {
    (async () => {
      for (;;) {
        const task = await this.options.taskBroker.claim();
        await this.runOneTask(task);
      }
    })();
  }

  async runOneTask(task: Task) {
    const {
      dockerClient,
      preparers,
      templaters,
      publishers,
      workingDirectory,
      logger,
    } = this.options;

    const taskLogger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
      ),
      defaultMeta: {},
    });

    const stream = new PassThrough();
    stream.on('data', data => {
      const message = data.toString().trim();
      if (message?.length > 1) task.emitLog(message);
    });

    taskLogger.add(new winston.transports.Stream({ stream }));

    try {
      task.emitLog('Task claimed, waiting ...');
      // Give us some time to curl observe
      await new Promise(resolve => setTimeout(resolve, 5000));

      const { values, template } = task.spec;
      task.emitLog('Prepare the skeleton');
      const { protocol, location: pullPath } = parseLocationAnnotation(
        task.spec.template,
      );

      const preparer =
        protocol === 'file' ? new FilePreparer() : preparers.get(pullPath);
      const templater = templaters.get(template);
      const publisher = publishers.get(values.storePath);

      const skeletonDir = await preparer.prepare(task.spec.template, {
        logger: taskLogger,
        workingDirectory: workingDirectory,
      });

      task.emitLog('Run the templater');
      const { resultDir } = await templater.run({
        directory: skeletonDir,
        dockerClient,
        logStream: stream,
        values: values,
      });

      task.emitLog('Publish template');
      logger.info('Will now store the template');

      logger.info('Totally storing the template now');
      await new Promise(resolve => setTimeout(resolve, 5000));
      // const result = await publisher.publish({
      //   values: values,
      //   directory: resultDir,
      //   logger,
      // });
      // task.emitLog(`Result: ${JSON.stringify(result)}`);

      await task.complete('completed');
    } catch (error) {
      await task.complete('failed');
    }
  }
}
