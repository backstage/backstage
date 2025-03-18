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
import { eventsModuleGitlabWebhook } from './eventsModuleGitlabWebhook';

describe('gitlabWebhookEventsModule', () => {
  const requestWithToken = (token?: string) => {
    return {
      headers: {
        'x-gitlab-token': token,
      },
    } as Partial<RequestDetails> as unknown as RequestDetails;
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
        eventsModuleGitlabWebhook,
        mockServices.rootConfig.factory({
          data: {
            events: {
              modules: {
                gitlab: {
                  webhookSecret: 'test-secret',
                },
              },
            },
          },
        }),
      ],
    });

    expect(addedIngress).not.toBeUndefined();
    expect(addedIngress?.topic).toEqual('gitlab');
    expect(addedIngress?.validator).not.toBeUndefined();
    const rejections: any[] = [];
    const context = {
      reject: (details: { status?: any; payload?: any }) => {
        rejections.push(details);
      },
    };
    await addedIngress!.validator!(requestWithToken(), context);
    expect(rejections).toEqual([
      {
        status: 403,
        payload: {
          message: 'invalid token',
        },
      },
    ]);
    await addedIngress!.validator!(requestWithToken('test-secret'), context);
    expect(rejections.length).toEqual(1);
  });
});
