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
import eventsModuleAzureDevOpsWebhook from './eventsModuleAzureDevOpsWebhook';

describe('eventsModuleAzureDevOpsWebhook', () => {
  const secret = 'my-webhook-secret';

  const requestWithHeader = (headerSecret?: string) => {
    return {
      body: { eventType: 'workitem.updated' },
      headers: {
        'x-ado-webhook-secret': headerSecret,
      },
      raw: {
        body: Buffer.from('{}'),
        encoding: 'utf-8',
      },
    } as RequestDetails;
  };

  it('should not register ingress when no secret configured', async () => {
    let addedIngress: HttpPostIngressOptions | undefined;
    const extensionPoint = {
      addHttpPostIngress: (ingress: HttpPostIngressOptions) => {
        addedIngress = ingress;
      },
    };

    await startTestBackend({
      extensionPoints: [[eventsExtensionPoint, extensionPoint]],
      features: [
        eventsModuleAzureDevOpsWebhook,
        mockServices.rootConfig.factory({
          data: {},
        }),
      ],
    });

    expect(addedIngress).toBeUndefined();
  });

  it('should be correctly wired and set up with secret', async () => {
    let addedIngress: HttpPostIngressOptions | undefined;
    const extensionPoint = {
      addHttpPostIngress: (ingress: HttpPostIngressOptions) => {
        addedIngress = ingress;
      },
    };

    await startTestBackend({
      extensionPoints: [[eventsExtensionPoint, extensionPoint]],
      features: [
        eventsModuleAzureDevOpsWebhook,
        mockServices.rootConfig.factory({
          data: {
            events: {
              modules: {
                azureDevOps: {
                  webhookSecret: secret,
                },
              },
            },
          },
        }),
      ],
    });

    expect(addedIngress).not.toBeUndefined();
    expect(addedIngress?.topic).toEqual('azureDevOps');
    expect(addedIngress?.validator).not.toBeUndefined();

    const rejections: any[] = [];
    const context = {
      reject: (details: { status?: any; payload?: any }) => {
        rejections.push(details);
      },
    };

    await addedIngress!.validator!(requestWithHeader(), context);
    expect(rejections).toEqual([
      {
        status: 403,
        payload: { message: 'invalid webhook secret' },
      },
    ]);

    await addedIngress!.validator!(requestWithHeader(secret), context);
    expect(rejections.length).toEqual(1);
  });
});
