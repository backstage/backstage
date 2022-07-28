/*
 * Copyright 2020 The Backstage Authors
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
import { InputError } from '@backstage/errors';
import {
  ScmIntegrations,
  GithubAppCredentialsMux,
} from '@backstage/integration';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Octokit } from 'octokit';

export interface RouterOptions {
  logger: Logger;
  integrations: ScmIntegrations;
  orgs: {
    github: {
      disableAppCredentials?: boolean;
    };
  };
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  router.use('/v1/github/orgs', async (request, response) => {
    if (!request.query.host || typeof request.query.host !== 'string') {
      throw new InputError('Missing or invalid host parameter');
    }

    const integrationConfig = options.integrations.github.byHost(
      request.query.host,
    );

    if (!integrationConfig && !request.headers['integration-token']) {
      throw new InputError(
        `Missing integration config or no integration-token header passed for host=${request.query.host}`,
      );
    }

    const token = request.headers['integration-token'];

    if (token) {
      const octokit = new Octokit({ auth: token });
      const { data } = await octokit.rest.orgs.listForAuthenticatedUser();

      response.json({
        orgs: data,
      });

      return;
    }

    if (options.orgs.github.disableAppCredentials) {
      throw new InputError('App credentials are disabled for this integration');
    }

    if (!integrationConfig?.config.apps?.length) {
      throw new InputError(
        'No apps configured for integration, please add one or more apps to the integration config, or use integration-token header',
      );
    }

    const mux = new GithubAppCredentialsMux(integrationConfig.config);
    const installations = await mux.getAllInstallations();

    response.json({
      orgs: installations.map(i => i.account),
    });
  });
  router.use(errorHandler());
  return router;
}
