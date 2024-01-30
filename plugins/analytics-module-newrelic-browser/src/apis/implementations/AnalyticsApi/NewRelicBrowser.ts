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
import {
  AnalyticsApi as NewAnalyicsApi,
  AnalyticsEvent as NewAnalyticsEvent,
} from '@backstage/frontend-plugin-api';
import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent';
import type { setAPI } from '@newrelic/browser-agent/loaders/api/api';

type NewRelicAPI = ReturnType<typeof setAPI>;

type NewRelicBrowserOptions = {
  endpoint: string;
  accountId: string;
  applicationId: string;
  licenseKey: string;
  distributedTracingEnabled: boolean;
  cookiesEnabled: boolean;
};

/**
 * New Relic Browser API provider for the Backstage Analytics API.
 * @public
 */
export class NewRelicBrowser implements AnalyticsApi, NewAnalyicsApi {
  private readonly agent: NewRelicAPI;

  private constructor(
    options: NewRelicBrowserOptions,
    identityApi?: IdentityApi,
    userIdTransform?: 'sha-256' | ((userEntityRef: string) => Promise<string>),
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
          deny_list: [options.endpoint],
        },
      },
      info: {
        beacon: options.endpoint,
        errorBeacon: options.endpoint,
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

    // Check if identity has been provided
    if (identityApi) {
      identityApi.getBackstageIdentity().then(identity => {
        if (typeof userIdTransform === 'function') {
          userIdTransform(identity.userEntityRef).then(userId => {
            this.agent.setUserId(userId);
          });
        } else {
          this.hash(identity.userEntityRef).then(userId => {
            this.agent.setUserId(userId);
          });
        }
      });
    }
  }

  static fromConfig(
    config: Config,
    options: {
      identityApi?: IdentityApi;
      userIdTransform?:
        | 'sha-256'
        | ((userEntityRef: string) => Promise<string>);
    },
  ) {
    const newRelicBrowserConfig = config.getConfig('app.analytics.newRelic');
    const browserOptions: NewRelicBrowserOptions = {
      endpoint: newRelicBrowserConfig.getString('endpoint'),
      accountId: newRelicBrowserConfig.getString('accountId'),
      applicationId: newRelicBrowserConfig.getString('applicationId'),
      licenseKey: newRelicBrowserConfig.getString('licenseKey'),
      distributedTracingEnabled:
        newRelicBrowserConfig.getOptionalBoolean('distributedTracingEnabled') ??
        false,
      cookiesEnabled:
        newRelicBrowserConfig.getOptionalBoolean('cookiesEnabled') ?? false,
    };
    return new NewRelicBrowser(
      browserOptions,
      options.identityApi,
      options.userIdTransform,
    );
  }

  captureEvent(event: AnalyticsEvent | NewAnalyticsEvent) {
    const { context, action, subject, value, attributes } = event;

    const extensionId = context.extensionId || context.extension;
    const category = extensionId ? String(extensionId) : 'App';

    // The legacy default extension was 'App' and the new one is 'app'
    if (
      action === 'navigate' &&
      category.toLocaleLowerCase('en-US').startsWith('app')
    ) {
      const interaction = this.agent.interaction();
      interaction.setName(subject);
      if (value) {
        interaction.setAttribute('value', value);
      }
      Object.keys(context).forEach(key => {
        if (context[key]) {
          interaction.setAttribute(`context.${key}`, context[key]);
        }
      });
      if (attributes) {
        Object.keys(attributes).forEach(key => {
          interaction.setAttribute(`attributes.${key}`, attributes[key]);
        });
      }
    } else {
      const customAttributes: {
        [x: string]: string | number | boolean | undefined;
      } = {};
      if (value) {
        customAttributes.value = value;
      }
      Object.keys(context).forEach(key => {
        if (context[key]) {
          customAttributes[`context.${key}`] = context[key];
        }
      });
      if (attributes) {
        Object.keys(attributes).forEach(key => {
          customAttributes[`attributes.${key}`] = attributes[key];
        });
      }

      this.agent.addPageAction(action, customAttributes);
    }
  }

  /**
   * Simple hash function; relies on web cryptography + the sha-256 algorithm.
   * @param value value to be hashed
   */
  private async hash(value: string): Promise<string> {
    const digest = await window.crypto.subtle.digest(
      'sha-256',
      new TextEncoder().encode(value),
    );
    const hashArray = Array.from(new Uint8Array(digest));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
