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

import { Config } from '@backstage/config';
import { TemplateActionRegistry } from '../TemplateConverter';
import { FilePreparer } from './prepare';
import Docker from 'dockerode';

type Options = {
  logger: Logger;
  config: Config;
  dockerClient: Docker;
};

export function registerLegacyActions(
  registry: TemplateActionRegistry,
  options: Options,
) {
  registry.register({
    id: 'legacy:prepare',
    async handler(ctx) {
      const { logger } = ctx;
      console.log(ctx);
      logger.info('Task claimed, waiting ...');
      // Give us some time to curl observe
      await new Promise(resolve => setTimeout(resolve, 5000));

      logger.info('Prepare the skeleton');

      const { protocol, pullPath } = ctx.parameters;

      const preparer =
        protocol === 'file'
          ? new FilePreparer()
          : preparers.get(pullPath as string);

      await preparer.prepare(task.spec.template, {
        logger,
        ctx.workspaceDir,
      });
      ctx.output('catalogInfoUrl', 'httpderp://asdasd');
    },
  });

  // try {
  //   const { values, template } = task.spec;
  //   task.emitLog('Prepare the skeleton');
  //   const { protocol, location: pullPath } = parseLocationAnnotation(
  //     task.spec.template,
  //   );
  //   const preparer =
  //     protocol === 'file' ? new FilePreparer() : preparers.get(pullPath);
  //   const templater = templaters.get(template);
  //   const publisher = publishers.get(values.storePath);

  //   const skeletonDir = await preparer.prepare(task.spec.template, {
  //     logger: taskLogger,
  //     workingDirectory: workingDirectory,
  //   });

  registry.register({
    id: 'legacy:template',
    async handler(ctx) {
      const { logger } = ctx;

      const templater = templaters.get(ctx.parameters.templater as string);

      logger.info('Run the templater');
      const { resultDir } = await templater.run({
        directory: ctx.workspaceDir,
        dockerClient,
        logStream: ctx.logStream,
        values: ctx.parameters.values as TemplaterValues,
      });
    },
  });
  //   task.emitLog('Publish template');
  //   logger.info('Will now store the template');

  //   logger.info('Totally storing the template now');
  //   await new Promise(resolve => setTimeout(resolve, 5000));
  //   // const result = await publisher.publish({
  //   //   values: values,
  //   //   directory: resultDir,
  //   //   logger,
  //   // });
  //   // task.emitLog(`Result: ${JSON.stringify(result)}`);

  //   await task.complete('completed');
  // } catch (error) {
  //   await task.complete('failed');
  // }
}
