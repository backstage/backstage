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
import * as k8s from '@kubernetes/client-node';
import * as qs from 'querystring';
import fetch from 'cross-fetch';
import WebSocket from 'isomorphic-ws';
import https from 'https';
import * as ms from 'ms';
import http from 'http';
import { Server } from 'ws';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export const buildRequestOptionsForUrl = (url: string): RequestInit & any => {
  const parsed = new URL(url);
  const request: any = {
    headers: {
      host: '127.0.0.1', // needs to be something that linkerd thinks is fine.
    },
  };

  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  kc.applyToRequest(request as Request);

  const agent = (() => {
    const builder = {
      ca: request.ca,
      cert: request.cert,
      key: request.key,
    };

    return parsed.protocol === 'https:'
      ? new https.Agent(builder)
      : new http.Agent();
  })();

  return {
    ...request,
    agent,
  };
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const kc = new k8s.KubeConfig();

  // TODO(blam): currently, we just skip all the config, and use the current k8s context on the host
  // Let's make this driven by config instead
  kc.loadFromDefault();
  const baseUrl = kc.getCurrentCluster()?.server;
  const { logger } = options;
  const router = Router();

  const makeRequest = async (url: string) => {
    const k8sProxyUrl = `/api/v1/namespaces/linkerd/services/linkerd-web:8084/proxy${url}`;
    const endpoint = `${baseUrl}${k8sProxyUrl}`;
    const opts = buildRequestOptionsForUrl(endpoint);
    return fetch(endpoint, opts).then(r => r.json());
  };

  router.get(
    '/namespace/:namespace/deployments',
    async ({ params: { namespace } }, response) => {
      const podRequest = await makeRequest(`/api/pods?namespace=${namespace}`);

      response.send(podRequest.pods);
    },
  );
  // TODO(blam): Get all stats for all namespaces
  // router.get('/namespaces/stats');

  // // TODO(blam): Get all stats for everything in one namespace
  // router.get(
  //   '/namespace/:namespace/stats',
  //   async ({ params: { namespace } }, response) => {
  //     const tpsRequest = await makeRequest(
  //       `/api/tps-reports?resource_type=all&namespace=${namespace}&tcp_stats=true&window=30s`,
  //     );

  //     console.warn(JSON.stringify(tpsRequest, null, 2));
  //     const final = tpsRequest.ok.statTables
  //       .filter((table: any) => table.podGroup.rows.length)
  //       .map((table: any) =>
  //         table.podGroup.rows.reduce(
  //           (prev: any[], current: any) => [...prev, current],
  //           [],
  //         ),
  //       )
  //       .flat()
  //       .reduce((prev: any, current: any) => {
  //         prev[current.resource.type] = prev[current.resource.type] || {};
  //         prev[current.resource.type][current.resource.name] =
  //           prev[current.resource.type][current.resource.name] || {};

  //         const timeWindowSeconds = (ms(current.timeWindow || 0) /
  //           1000) as number;
  //         const successCount = parseInt(current.stats?.successCount, 10);
  //         const failureCount = parseInt(current.stats?.failureCount, 10);
  //         const totalRequests = successCount + failureCount;

  //         const b7e = {
  //           totalRequests,
  //           rps: totalRequests / timeWindowSeconds,
  //           successRate: (successCount / totalRequests) * 100,
  //           failureRate: (failureCount / totalRequests) * 100,
  //         };

  //         prev[current.resource.type][current.resource.name] = {
  //           ...current,
  //           b7e,
  //         };
  //         return prev;
  //       }, {});

  //     response.send(final);
  //   },
  // );

  const generateTpsStats = async (options: any) => {
    const actualOptions = {
      ...options,
      resource_type: 'all',
      all_namespaces: true,
      tcp_stats: true,
      window: '30s',
    };

    const requests = await makeRequest(
      `/api/tps-reports?${qs.stringify(actualOptions)}`,
    );

    return requests.ok.statTables
      .filter((table: any) => table.podGroup.rows.length)
      .map((table: any) =>
        table.podGroup.rows.reduce(
          (prev: any[], current: any) => [...prev, current],
          [],
        ),
      )
      .flat()
      .reduce((prev: any, current: any) => {
        prev[current.resource.type] = prev[current.resource.type] || {};
        prev[current.resource.type][current.resource.name] =
          prev[current.resource.type][current.resource.name] || {};

        const timeWindowSeconds = (ms(current.timeWindow || 0) /
          1000) as number;
        const successCount = parseInt(current.stats?.successCount, 10);
        const failureCount = parseInt(current.stats?.failureCount, 10);
        const totalRequests = successCount + failureCount;

        const b7e = {
          totalRequests,
          rps: totalRequests / timeWindowSeconds,
          successRate: (successCount / totalRequests) * 100,
          failureRate: (failureCount / totalRequests) * 100,
        };

        prev[current.resource.type][current.resource.name] = {
          ...current,
          b7e,
        };
        return prev;
      }, {});
  };

  // TODO(blam): Get a breakdown for a deployment in a namespace
  router.get(
    '/namespace/:namespace/deployment/:deployment/stats',
    async ({ params: { deployment, namespace } }, response) => {
      const toOptions = {
        to_name: deployment,
        to_namespace: namespace,
        to_type: 'deployment',
      };
      const fromOptions = {
        from_name: deployment,
        from_namespace: namespace,
        from_type: 'deployment',
      };

      response.send({
        incoming: await generateTpsStats(toOptions),
        outgoing: await generateTpsStats(fromOptions),
      });
    },
  );

  // TODO(blam): Get a breakdown for a deployment in a namespace
  // router.get(
  //   '/namespace/:namespace/deployment/:deployment/stats',
  //   async ({ params: { deployment, namespace } }, response) => {
  //     const fromOptions = {
  //       from_name: deployment,
  //       from_namespace: namespace,
  //       // from_type: 'deployment',
  //     };

  //     const toOptions = {
  //       to_name: deployment,
  //       to_namespace: namespace,
  //       // to_type: 'deployment',
  //     };

  //     const [incoming, outgoing] = await Promise.all([
  //       generateTpsStats(toOptions),
  //       generateTpsStats(fromOptions),
  //     ]);

  //     response.send({
  //       incoming,
  //       outgoing,
  //     });
  //   },
  // );

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });
  router.use(errorHandler());

  return router;
}

export async function createWebSockets(options: RouterOptions) {
  const server = new Server({ noServer: true });

  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  const baseUrl = kc.getCurrentCluster()?.server ?? '';
  const fixed = baseUrl.replace(/^http/, 'ws');
  const opts = buildRequestOptionsForUrl(baseUrl);
  server.on('error', options.logger.error);

  server.on('connection', backstageSocket => {
    const linkerdConnection = new WebSocket(
      `${fixed}/api/v1/namespaces/linkerd/services/linkerd-web:8084/proxy/api/tap`,
      [],
      opts,
    );
    backstageSocket.on('message', data => {
      const { resource, namespace } = JSON.parse(data.toString());
      linkerdConnection.on('message', message => backstageSocket.send(message));

      console.warn(resource, namespace);
      linkerdConnection.send(
        JSON.stringify({
          id: 'top-web',
          resource: `${resource}`,
          namespace,
          maxRps: 0,
        }),
      );
      // linkerdConnection.send({
      //   id: 'top-web',
      //   resource: 'deployment/emoji',
      //   namespace: 'emojivoto',
      //   maxRps: 0,
      // });
    });
    backstageSocket.on('close', () => linkerdConnection.close());
  });

  return server;
}
