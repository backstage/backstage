/*
 * Copyright 2024 The Backstage Authors
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
import Router from 'express-promise-router';
import express from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
import { DeploymentMetadataService } from '../types';

export async function createRouter({
  logger,
  deploymentMetadata,
}: {
  logger: LoggerService;
  deploymentMetadata: DeploymentMetadataService;
}) {
  const router = Router();

  router.use(express.json());
  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/features', async (_, response) => {
    response.json(await deploymentMetadata.listFeatures());
  });

  return router;
}
