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

import { coreServices } from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';
import {
  HttpPostIngressOptions,
  RequestDetails,
} from '@backstage/plugin-events-node';
import { sign } from '@octokit/webhooks-methods';
import { githubWebhookEventsModule } from './GithubWebhookEventsModule';

describe('githubWebhookEventsModule', () => {
  const secret = 'valid-secret';
  const payload = { test: 'payload' };
  const payloadString = JSON.stringify(payload);
  const validSignature = sign({ secret, algorithm: 'sha256' }, payloadString);
  const requestWithSignature = async (signature?: string) => {
    return {
      body: payload,
      headers: {
        'x-hub-signature-256': signature,
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

    const config = new ConfigReader({
      events: {
        modules: {
          github: {
            webhookSecret: secret,
          },
        },
      },
    });

    await startTestBackend({
      extensionPoints: [[eventsExtensionPoint, extensionPoint]],
      services: [[coreServices.config, config]],
      features: [githubWebhookEventsModule()],
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
