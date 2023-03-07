/*
 * Copyright 2023 The Backstage Authors
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

import chalk from 'chalk';
import * as awsx from '@pulumi/awsx';
import * as aws from '@pulumi/aws';
import { OptionValues } from 'commander';
import { resolve } from 'path';

export const AWSProgram = (opts: OptionValues) => {
  return async () => {
    const repository = new awsx.ecr.Repository(`${opts.stack}`, {
      name: opts.stack,
    });

    const image = new awsx.ecr.Image(`${opts.stack}-image`, {
      repositoryUrl: repository.url,
      path: resolve('.'),
      dockerfile: opts.dockerfile,
    });

    // create lightsail instance
    const CONTAINER_NAME = `${opts.stack}-container`;
    const containerService = new aws.lightsail.ContainerService(
      CONTAINER_NAME,
      {
        name: `${opts.stack}-container-service`,
        isDisabled: false,
        power: 'nano',
        scale: 1,
        tags: {
          backstage: opts.stack,
        },
      },
    );

    /* eslint-disable no-new */
    new aws.lightsail.ContainerServiceDeploymentVersion(
      `${opts.stack}-deployment`,
      {
        containers: [
          {
            containerName: CONTAINER_NAME,
            image: image.imageUri,
            commands: [],
            ports: {
              '7007': 'HTTP',
            },
            environment: {
              BACKSTAGE_HOST: containerService.url,
            },
          },
        ],
        publicEndpoint: {
          containerName: CONTAINER_NAME,
          containerPort: 7007,
          healthCheck: {
            healthyThreshold: 2,
            unhealthyThreshold: 2,
            timeoutSeconds: 2,
            intervalSeconds: 5,
            path: '/',
            successCodes: '200-499',
          },
        },
        serviceName: containerService.name,
      },
    );

    containerService.url.apply(url => {
      process.stderr.write(
        chalk.yellowBright(`\n\nInstance will be live at: ${url}\n\n`),
      );
    });
  };
};
