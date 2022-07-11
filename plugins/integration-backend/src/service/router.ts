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
  DefaultGithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Octokit } from 'octokit';

export interface RouterOptions {
  logger: Logger;
  integrations: ScmIntegrations;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;
  const githubCredentialsProvider =
    DefaultGithubCredentialsProvider.fromIntegrations(options.integrations);
  const router = Router();
  router.use(express.json());

  router.use('/v1/github/orgs', async (request, response) => {
    if (!request.query.host || typeof request.query.host !== 'string') {
      throw new InputError('Missing or invalid host parameter');
    }

    const { token, type } = request.headers['repo-token']
      ? { token: request.headers['repo-token'] as string, type: 'token' }
      : await githubCredentialsProvider.getCredentials({
          url: `https://${request.query.host}/blamdemo`,
        });

    console.log(token, type);
    // with the token and type of token, get the organisations available for the user or the app
    const octokit = new Octokit({ auth: token });

    // need to get all app installations here, and then get the orgs for each installation

    response.json({
      repos: await octokit.rest.orgs.listForAuthenticatedUser(),
    });
  });
  router.use(errorHandler());
  return router;
}
