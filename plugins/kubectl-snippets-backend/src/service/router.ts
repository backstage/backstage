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

import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

export var kubectl = require('../lib/kubectl');

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.post('/exec', function (req, res) {

    var kube = kubectl({
        binary: 'kubectl'
        , kubeconfig: 'C:\\enefit\\kubectl-client\\kubeconfig.yaml'
        , version: '/api/v1'
    });
    
    kube.command(req.body.snippet, function(err: any, data: any) {
      if (err) {
        console.error('kubectl error: ' + err);
        res.send({ error: err });
      } else {
        console.log('kubectl output: ' + data);
        res.send({ output: data });
      }       
    });
  });

  router.use(errorHandler());
  return router;
}
