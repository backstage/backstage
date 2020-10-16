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
import { Config } from '@backstage/config';
import fetch from 'cross-fetch';
import WebSocket from 'isomorphic-ws';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

// TODO - Need to work out better authentication using the CA of the k8s api cluster
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;
  const router = Router();

  const cluster = (options.config.getConfigArray(
    'kubernetes.clusters',
  ) as any)[0].data;

  const baseUrl = cluster.url;
  const Authorization = `Bearer ${cluster.serviceAccountToken}`;

  const makeRequest = (url: string) => {
    const k8sProxyUrl = `/api/v1/namespaces/linkerd/services/linkerd-web:8084/proxy${url}`;

    return fetch(`${baseUrl}${k8sProxyUrl}`, {
      headers: { Authorization },
    }).then(r => r.json());
  };

  const Socket = new WebSocket(
    'wss://127.0.0.1:59436/api/v1/namespaces/linkerd/services/linkerd-web:8084/proxy/api/tap',
    [],
    { headers: { Authorization }, rejectUnauthorized: false },
  );

  Socket.onmessage = console.warn;
  Socket.onclose = console.warn;
  Socket.onopen = () => {
    Socket.send(
      JSON.stringify({
        id: 'top-web',
        resource: 'deployment/emoji',
        namespace: 'emojivoto',
        maxRps: 0,
      }),
    );
  };
  Socket.onerror = console.warn;

  router.get(
    '/deployment/:namespace/:deployment',
    async ({ params: { namespace, deployment } }, response) => {
      const podRequest = await makeRequest(`/api/pods?namespace=${namespace}`);
      response.send(
        podRequest.pods.filter(
          p => p.deployment === `${namespace}/${deployment}`,
        ),
      );
    },
  );

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });
  router.use(errorHandler());
  return router;
}
