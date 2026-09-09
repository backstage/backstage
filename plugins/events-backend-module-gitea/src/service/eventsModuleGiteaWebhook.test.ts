/*
 * Copyright 2026 The Backstage Authors
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

import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';
import {
  HttpPostIngressOptions,
  RequestDetails,
} from '@backstage/plugin-events-node';
import { createHmac } from 'node:crypto';
import eventsModuleGiteaWebhook from './eventsModuleGiteaWebhook';

describe('eventsModuleGiteaWebhook', () => {
  const secret = 'valid-secret';
  const payloadString = '{"test": "payload", "score": 5.0}';
  const payload = JSON.parse(payloadString);
  const payloadBuffer = Buffer.from(payloadString);
  const validSignature = createHmac('sha256', secret)
    .update(payloadBuffer)
    .digest('hex');
  const requestWithSignature = (signature?: string) => {
    return {
      body: payload,
      headers: {
        'x-gitea-signature': signature,
      },
      raw: {
        body: payloadBuffer,
        encoding: 'utf-8',
      },
    } as RequestDetails;
  };

  it('should not add ingress if validator is undefined', async () => {
    let addedIngress: HttpPostIngressOptions | undefined;
    const extensionPoint = {
      addHttpPostIngress: (ingress: any) => {
        addedIngress = ingress;
      },
    };

    await startTestBackend({
      extensionPoints: [[eventsExtensionPoint, extensionPoint]],
      features: [
        eventsModuleGiteaWebhook,
        mockServices.rootConfig.factory({
          data: {},
        }),
      ],
    });

    expect(addedIngress).toBeUndefined();
  });

  it('should be correctly wired and set up', async () => {
    let addedIngress: HttpPostIngressOptions | undefined;
    const extensionPoint = {
      addHttpPostIngress: (ingress: any) => {
        addedIngress = ingress;
      },
    };

    await startTestBackend({
      extensionPoints: [[eventsExtensionPoint, extensionPoint]],
      features: [
        eventsModuleGiteaWebhook,
        mockServices.rootConfig.factory({
          data: {
            events: {
              modules: {
                gitea: {
                  webhookSecret: secret,
                },
              },
            },
          },
        }),
      ],
    });

    expect(addedIngress).not.toBeUndefined();
    expect(addedIngress?.topic).toEqual('gitea');
    expect(addedIngress?.validator).not.toBeUndefined();
    const rejections: any[] = [];
    const context = {
      reject: (details: { status?: any; payload?: any }) => {
        rejections.push(details);
      },
    };
    await addedIngress!.validator!(requestWithSignature(), context);
    expect(rejections).toEqual([
      {
        status: 403,
        payload: {
          message: 'invalid signature',
        },
      },
    ]);
    await addedIngress!.validator!(
      requestWithSignature(validSignature),
      context,
    );
    expect(rejections.length).toEqual(1);
  });
});
