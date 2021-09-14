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
import { JenkinsInfoProvider } from './jenkinsInfoProvider';
import { JenkinsApiImpl } from './jenkinsApi';

export interface RouterOptions {
  logger: Logger;
  jenkinsInfoProvider: JenkinsInfoProvider;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { jenkinsInfoProvider } = options;

  const jenkinsApi = new JenkinsApiImpl();

  const router = Router();
  router.use(express.json());

  router.get(
    '/v1/entity/:namespace/:kind/:name/projects',
    async (request, response) => {
      const { namespace, kind, name } = request.params;
      const branch = request.query.branch;
      let branchStr: string | undefined;

      if (branch === undefined) {
        branchStr = undefined;
      } else if (typeof branch === 'string') {
        branchStr = branch;
      } else {
        // this was passed in as something weird -> 400
        // https://evanhahn.com/gotchas-with-express-query-parsing-and-how-to-avoid-them/
        response
          .status(400)
          .send('Something was unexpected about the branch queryString');

        return;
      }

      const jenkinsInfo = await jenkinsInfoProvider.getInstance({
        entityRef: {
          kind,
          namespace,
          name,
        },
      });
      const projects = await jenkinsApi.getProjects(jenkinsInfo, branchStr);

      response.json({
        projects: projects,
      });
    },
  );

  router.get(
    '/v1/entity/:namespace/:kind/:name/job/:jobFullName/:buildNumber',
    async (request, response) => {
      const { namespace, kind, name, jobFullName, buildNumber } =
        request.params;

      const jenkinsInfo = await jenkinsInfoProvider.getInstance({
        entityRef: {
          kind,
          namespace,
          name,
        },
        jobFullName,
      });

      const build = await jenkinsApi.getBuild(
        jenkinsInfo,
        jobFullName,
        parseInt(buildNumber, 10),
      );

      response.json({
        build: build,
      });
    },
  );

  router.post(
    '/v1/entity/:namespace/:kind/:name/job/:jobFullName/:buildNumber::rebuild',
    async (request, response) => {
      const { namespace, kind, name, jobFullName } = request.params;

      const jenkinsInfo = await jenkinsInfoProvider.getInstance({
        entityRef: {
          kind,
          namespace,
          name,
        },
        jobFullName,
      });

      await jenkinsApi.buildProject(jenkinsInfo, jobFullName);
      response.json({});
    },
  );

  router.use(errorHandler());
  return router;
}
