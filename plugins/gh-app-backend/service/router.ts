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

import express from 'express';
import Router from 'express-promise-router';
import axios from 'axios';
import SmeeClient from 'smee-client';

const { createAppAuth } = require('@octokit/auth-app');
const { request } = require('@octokit/request');

const client = new SmeeClient({
  source: 'https://smee.io/ok6vLA8yMu3umnI',
  target: 'http://localhost:7000/gh-app/events',
  logger: console,
});
client.start();

export async function createRouter(): Promise<express.Router> {
  const router = Router();
  const app = express();

  app.post('/events', async ({ body }, response) => {
    if (body.action === 'created') {
      console.warn(
        'app install event lets create a new app for auth in the app',
      );

      app.set(
        'githubAuth',
        createAppAuth({
          installationId: body.installation.id,
          ...app.get('ghApp'),
        }),
      );
    }

    response.send({});
  });

  app.get('/repositories', async (req, response) => {
    const appAuth = app.get('githubAuth');

    const { token } = await appAuth({ type: 'installation' });
    const authenticatedRequester = request.defaults({
      headers: {
        authorization: `token ${token}`,
        accept: 'application/vnd.github.machine-man-preview+json',
      },
    });

    const { data } = await authenticatedRequester(
      'GET /installation/repositories',
    );

    response.send(data);
  });

  app.get('/install/callback', async ({ query }, response) => {
    const { code } = query;

    const { data: conversion } = await axios.post(
      `https://api.github.com/app-manifests/${code}/conversions`,
    );

    console.warn(conversion);

    const {
      id,
      client_id: clientId,
      client_secret: clientSecret,
      webhook_secret: webhookSecret,
      pem,
      html_url: htmlUrl,
    } = conversion;

    app.set('ghApp', { id, privateKey: pem, clientId, clientSecret });

    response.redirect(302, `${htmlUrl}/installations/new`);
  });
  app.use('/', router);

  return app;
}
