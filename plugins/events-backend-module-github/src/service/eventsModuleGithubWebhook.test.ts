/*
 * Copyright 2022 The Backstage Authors
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
import { sign } from '@octokit/webhooks-methods';
import { eventsModuleGithubWebhook } from './eventsModuleGithubWebhook';

describe('eventsModuleGithubWebhook', () => {
  const secret = 'valid-secret';
  const payloadString = '{"test": "payload", "score": 5.0}';
  const payload = JSON.parse(payloadString);
  const payloadBuffer = Buffer.from(payloadString);
  const validSignature = sign({ secret, algorithm: 'sha256' }, payloadString);
  const requestWithSignature = async (signature?: string) => {
    return {
      body: payload,
      headers: {
        'x-hub-signature-256': signature,
      },
      raw: {
        body: payloadBuffer,
        encoding: 'utf-8',
      },
    } as RequestDetails;
  };

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
        eventsModuleGithubWebhook,
        mockServices.rootConfig.factory({
          data: {
            events: {
              modules: {
                github: {
                  webhookSecret: secret,
                },
              },
            },
          },
        }),
      ],
    });

    expect(addedIngress).not.toBeUndefined();
    expect(addedIngress?.topic).toEqual('github');
    expect(addedIngress?.validator).not.toBeUndefined();
    const rejections: any[] = [];
    const context = {
      reject: (details: { status?: any; payload?: any }) => {
        rejections.push(details);
      },
    };
    await addedIngress!.validator!(await requestWithSignature(), context);
    expect(rejections).toEqual([
      {
        status: 403,
        payload: {
          message: 'invalid signature',
        },
      },
    ]);
    await addedIngress!.validator!(
      await requestWithSignature(await validSignature),
      context,
    );
    expect(rejections.length).toEqual(1);
  });
});
