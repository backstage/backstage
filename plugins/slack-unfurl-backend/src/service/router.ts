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

import { Config } from '@backstage/config';
import { DiscoveryApi } from '@backstage/core';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { createEventAdapter } from '@slack/events-api';
import { WebClient } from '@slack/web-api';
import fetch from 'cross-fetch';
// Read the signing secret from the environment variables
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const token = process.env.SLACK_APP_TOKEN;
// Initialize
const slackWebApi = new WebClient(token);
const slackEvents = createEventAdapter(slackSigningSecret!);
slackEvents.on('error', e => {
  console.warn(e);
});
slackEvents.on('link_shared', async event => {
  console.warn(JSON.stringify(event));
  const { message_ts, channel, links } = event;
  const catalogLinks = links.reduce((acc, { url }) => {
    const [_, namespace, kind, name] = url.match(/catalog\/(.+)\/(.+)\/(.+)/);
    if (namespace && kind && name) {
      acc[url] = { namespace, kind, name };
    }
    return acc;
  }, {});
  console.warn(JSON.stringify(catalogLinks, null, 2));
  const unfurlsReqs = Object.entries(catalogLinks).map(
    ([url, { namespace, kind, name }]) =>
      fetch(
        `https://c48c509c2317.ngrok.io/api/catalog/entities/by-name/${encodeURIComponent(
          kind,
        )}/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`,
      )
        .then(x => x.json())
        .then(x => ({ ...x, url })),
  );
  const unfurls = (await Promise.all(unfurlsReqs)).reduce(
    (acc, { url, ...entity }) => {
      acc[url] = {
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: entity.metadata.name,
            },
          },
          {
            type: 'section',
            block_id: 'description',
            text: {
              type: 'mrkdwn',
              text: entity.metadata.description,
            },
          },
          {
            type: 'section',
            block_id: 'spec',
            text: {
              type: 'mrkdwn',
              text: `
- *Type*: ${entity.spec.type}
- *Lifecycle*: ${entity.spec.lifecycle}
- *Owner*: ${entity.spec.owner}
              `,
            },
            accessory: {
              type: 'image',
              image_url:
                'https://c48c509c2317.ngrok.io/android-chrome-512x512.png',
              alt_text: "Stein's wine carafe",
            },
          },
        ],
      };
      return acc;
    },
    {},
  );

  slackWebApi.chat.unfurl({
    channel,
    ts: message_ts,
    token,
    unfurls,
  });
});

export interface RouterOptions {
  logger: Logger;
  config: Config;
  discovery: DiscoveryApi;
}

const handler = slackEvents.expressMiddleware();
export async function createRouter(
  // @ts-ignore
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();

  // const externalUrl = await options.discovery.getExternalBaseUrl('proxy');
  // const { pathname: pathPrefix } = new URL(externalUrl);

  // const proxyConfig = options.config.getOptional('proxy') ?? {};
  router.use((req, res, next) => {
    try {
      handler(req, res, next);
    } catch (e) {
      console.warn(e);
      next();
    }
  });

  return router;
}
