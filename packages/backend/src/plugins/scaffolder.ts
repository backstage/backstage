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

import {
  CookieCutter,
  createRouter,
  FilePreparer,
  GithubPreparer,
  Preparers,
  GithubPublisher,
  Templaters,
} from '@backstage/plugin-scaffolder-backend';
import { Octokit } from '@octokit/rest';
import type { PluginEnvironment } from '../types';
import Docker from 'dockerode';

export default async function createPlugin({ logger }: PluginEnvironment) {
  const cookiecutterTemplater = new CookieCutter();
  const templaters = new Templaters();
  templaters.register('cookiecutter', cookiecutterTemplater);

  const filePreparer = new FilePreparer();
  const githubPreparer = new GithubPreparer();
  const preparers = new Preparers();

  preparers.register('file', filePreparer);
  preparers.register('github', githubPreparer);

  const githubClient = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
  const publisher = new GithubPublisher({ client: githubClient });

  const dockerClient = new Docker();
  return await createRouter({
    preparers,
    templaters,
    publisher,
    logger,
    dockerClient,
  });
}
