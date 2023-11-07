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
import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { config, logger } = options;

  // Get Consul baseUrl and creds
  const baseUrl = config.getString('backend.baseUrl');
  const clientID = config.getString('consul.clientID');
  const clientSecret = config.getString('consul.clientSecret');

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/oauth/token', async (_, response) => {
    const body = {
      audience: 'https://api.hashicorp.cloud',
      grant_type: 'client_credentials',
      client_id: clientID,
      client_secret: clientSecret,
    };

    const auth = await fetch(`${baseUrl}/api/proxy/hcpAuth/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await auth.json();
    response.json(data);
  });

  router.get(
    '/2023-10-10/consul/project/:project_id/clusters',
    async (req, res) => {
      const projectID = req.params.project_id;
      const queryParams = (req.query as Record<string, string>) ?? '';
      const params = new URLSearchParams(queryParams);

      const endpoint = `${baseUrl}/api/proxy/hcp/2023-10-10/consul/project/${projectID}/clusters?${params}`;

      const authorizationHeaderValue = req.headers.authorization || '';
      const clustersResp = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeaderValue,
        },
      });

      // Check response
      if (clustersResp.status !== 200) {
        const body = await clustersResp.text();
        logger.error(`failed to call list clusters endpoint: ${body}`);
        res.status(clustersResp.status).json({ message: body });
        return;
      }

      // Deserialize and return
      const clustersBody = await clustersResp.json();
      res.json(clustersBody);
    },
  );

  router.get(
    '/2023-10-10/consul/project/:project_id/cluster/:cluster_name',
    async (req, res) => {
      const clusterName = req.params.cluster_name;
      const projectID = req.params.project_id;
      const endpoint = `${baseUrl}/api/proxy/hcp/2023-10-10/consul/project/${projectID}/cluster/${clusterName}`;

      // Access and get the 'Authorization' header
      const authorizationHeaderValue = req.headers.authorization || '';
      const clusterResp = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeaderValue,
        },
      });

      // Check response
      if (clusterResp.status !== 200) {
        const body = await clusterResp.text();
        logger.error(`failed to call get cluster endpoint: ${body}`);
        res.status(clusterResp.status).json({ message: body });
        return;
      }

      // Deserialize and return
      const servicesBody = await clusterResp.json();
      res.json(servicesBody);
    },
  );

  router.get(
    '/2023-10-10/consul/project/:project_id/services',
    async (req, res) => {
      const projectID = req.params.project_id;

      const queryParams = (req.query as Record<string, string>) ?? '';
      const params = new URLSearchParams(queryParams);

      // convert status param from multi to csv query format
      if (queryParams.status) {
        params.delete('status');
        const statusValues = Array.isArray(queryParams.status)
          ? queryParams.status
          : [queryParams.status];
        for (const status of statusValues) {
          params.append('status', status);
        }
      }

      const endpoint = `${baseUrl}/api/proxy/hcp/2023-10-10/consul/project/${projectID}/services?${params}`;

      // Access and get the 'Authorization' header
      const authorizationHeaderValue = req.headers.authorization || '';
      const servicesResp = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeaderValue,
        },
      });

      // Check response
      if (servicesResp.status !== 200) {
        const body = await servicesResp.text();
        logger.error(`failed to call list services endpoint: ${body}`);
        res.status(servicesResp.status).json({ message: body });
        return;
      }

      // Deserialize and return
      const servicesBody = await servicesResp.json();
      res.json(servicesBody);
    },
  );

  router.get(
    '/2023-10-10/consul/project/:project_id/cluster/:cluster_name/service/:service_name',
    async (req, res) => {
      const clusterName = req.params.cluster_name;
      const projectID = req.params.project_id;
      const serviceName = req.params.service_name;

      const queryParams = (req.query as Record<string, string>) ?? '';
      const params = new URLSearchParams(queryParams);

      const endpoint = `${baseUrl}/api/proxy/hcp/2023-10-10/consul/project/${projectID}/cluster/${clusterName}/service/${serviceName}?${params}`;
      const authorizationHeaderValue = req.headers.authorization || '';

      const servicesResp = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeaderValue,
        },
      });

      // Check response
      if (servicesResp.status !== 200) {
        const body = await servicesResp.text();
        logger.error(`failed to call get service endpoint: ${body}`);
        res.status(servicesResp.status).json({ message: body });
        return;
      }

      // Deserialize and return
      const servicesBody = await servicesResp.json();
      res.json(servicesBody);
    },
  );

  router.get(
    '/2023-10-10/consul/project/:project_id/cluster/:cluster_name/service/:service_name/instances',
    async (req, res) => {
      const clusterName = req.params.cluster_name;
      const projectID = req.params.project_id;
      const serviceName = req.params.service_name;

      const queryParams = (req.query as Record<string, string>) ?? '';
      const params = new URLSearchParams(queryParams);

      const endpoint = `${baseUrl}/api/proxy/hcp/2023-10-10/consul/project/${projectID}/cluster/${clusterName}/service/${serviceName}/instances?${params}`;
      // Access and get the 'Authorization' header
      const authorizationHeaderValue = req.headers.authorization || '';

      const servicesResp = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeaderValue,
        },
      });

      // Check response
      if (servicesResp.status !== 200) {
        const body = await servicesResp.text();
        logger.error(`failed to call list service instances endpoint: ${body}`);
        res.status(servicesResp.status).json({ message: body });
        return;
      }

      // Deserialize and return
      const servicesBody = await servicesResp.json();
      res.json(servicesBody);
    },
  );

  router.get(
    '/2022-02-15/organizations/:organization_id/projects/:project_id/aggregate_service_summary',
    async (req, res) => {
      const organizationID = req.params.organization_id;
      const projectID = req.params.project_id;

      // Append the query string to the endpoint
      const endpoint = `${baseUrl}/api/proxy/hcp/global-network-manager/2022-02-15/organizations/${organizationID}/projects/${projectID}/aggregate_service_summary`;

      // Access and get the 'Authorization' header
      const authorizationHeaderValue = req.headers.authorization || '';
      const aggregateServicesResp = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeaderValue,
        },
      });

      // Check response
      if (aggregateServicesResp.status !== 200) {
        const body = await aggregateServicesResp.text();
        logger.error(
          `failed to call aggregate-service-summary endpoint: ${body}`,
        );
        res.status(aggregateServicesResp.status).json({ message: body });
        return;
      }

      // Deserialize and return
      const servicesBody = await aggregateServicesResp.json();
      res.json(servicesBody);
    },
  );

  router.use(errorHandler());
  return router;
}
