/*
 * Copyright 2023 The Backstage Authors
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
import {
  AnalyticsApi,
  IdentityApi,
  AnalyticsEvent,
} from '@backstage/core-plugin-api';
import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent';
import type { setAPI } from '@newrelic/browser-agent/loaders/api/api';

type NewRelicAPI = ReturnType<typeof setAPI>;

export type NewRelicBrowserOptions = {
  accountId: string;
  applicationId: string;
  licenseKey: string;
  distributedTracingEnabled: boolean;
  cookiesEnabled: boolean;
  useEuEndpoint: boolean;
};

// Implementation that optionally initializes with a userId.
export class NewRelicBrowser implements AnalyticsApi {
  private readonly agent: NewRelicAPI;

  private constructor(
    options: NewRelicBrowserOptions,
    identityApi?: IdentityApi,
  ) {
    // Configure the New Relic Browser agent
    const agentOptions = {
      init: {
        distributed_tracing: {
          enabled: options.distributedTracingEnabled,
        },
        privacy: {
          cookies_enabled: options.cookiesEnabled,
        },
        ajax: {
          deny_list: [
            options.useEuEndpoint ? 'bam.eu01.nr-data.net' : 'bam.nr-data.net',
          ],
        },
      },
      info: {
        beacon: options.useEuEndpoint
          ? 'bam.eu01.nr-data.net'
          : 'bam.nr-data.net',
        errorBeacon: options.useEuEndpoint
          ? 'bam.eu01.nr-data.net'
          : 'bam.nr-data.net',
        licenseKey: options.licenseKey,
        applicationID: options.applicationId,
        sa: 1,
      },
      loader_config: {
        accountID: options.accountId,
        trustKey: options.accountId,
        agentID: options.applicationId,
        licenseKey: options.licenseKey,
        applicationID: options.applicationId,
      },
    };

    // Initialize the agent
    this.agent = new BrowserAgent(agentOptions) as unknown as NewRelicAPI;

    if (identityApi) {
      identityApi.getBackstageIdentity().then(identity => {
        this.agent.setUserId(identity.userEntityRef);
      });
    }
  }

  static fromConfig(config: Config, options: { identityApi?: IdentityApi }) {
    const browserOptions: NewRelicBrowserOptions = {
      accountId: config.getString('app.analytics.nr.accountId'),
      applicationId: config.getString('app.analytics.nr.applicationId'),
      licenseKey: config.getString('app.analytics.nr.licenseKey'),
      distributedTracingEnabled:
        config.getOptionalBoolean(
          'app.analytics.nr.distributedTracingEnabled',
        ) ?? false,
      cookiesEnabled:
        config.getOptionalBoolean('app.analytics.nr.cookiesEnabled') ?? false,
      useEuEndpoint:
        config.getOptionalBoolean('app.analytics.nr.useEuEndpoint') ?? false,
    };
    return new NewRelicBrowser(browserOptions, options.identityApi);
  }

  captureEvent(event: AnalyticsEvent) {
    const { action, ...rest } = event;
    this.agent.addPageAction(action, rest);
  }
}
