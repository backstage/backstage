/*
 * Copyright 2020 The Backstage Authors
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
import { basicIntegrations, defaultScmResolveUrl } from '../helpers';
import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import {
  GitLabIntegrationConfig,
  readGitLabIntegrationConfigs,
} from './config';
import pThrottle from 'p-throttle';
import { metrics, Counter, ObservableGauge, Meter } from '@opentelemetry/api';

type FetchFunction = typeof fetch;

/**
 * A GitLab based integration.
 *
 * @public
 */
export class GitLabIntegration implements ScmIntegration {
  static factory: ScmIntegrationsFactory<GitLabIntegration> = ({ config }) => {
    const configs = readGitLabIntegrationConfigs(
      config.getOptionalConfigArray('integrations.gitlab') ?? [],
    );
    return basicIntegrations(
      configs.map(c => new GitLabIntegration(c)),
      i => i.config.host,
    );
  };

  private readonly queue: Array<() => void> = [];
  private readonly meter: Meter;
  private gauge?: ObservableGauge;
  private counter429?: Counter;

  private readonly fetchImpl: FetchFunction;

  constructor(private readonly integrationConfig: GitLabIntegrationConfig) {
    this.meter = metrics.getMeter(
      `gitlab-integration-${this.integrationConfig.host}`,
    );

    this.setupTelemetry();

    // Configure fetch strategy based on configuration
    this.fetchImpl = this.createFetchStrategy();
  }

  get type(): string {
    return 'gitlab';
  }

  get title(): string {
    return this.integrationConfig.host;
  }

  get config(): GitLabIntegrationConfig {
    return this.integrationConfig;
  }

  resolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number;
  }): string {
    return defaultScmResolveUrl(options);
  }

  resolveEditUrl(url: string): string {
    return replaceGitLabUrlType(url, 'edit');
  }

  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    return this.fetchImpl(input, init);
  }

  private createFetchStrategy(): FetchFunction {
    let fetchFn: FetchFunction = async (url, options) => {
      return fetch(url, { ...options, mode: 'same-origin' });
    };

    // Early return for plain fetch (no enhancements needed)
    if (
      this.integrationConfig.limitPerMinute <= 0 &&
      this.integrationConfig.maxRetries <= 0
    ) {
      return fetchFn;
    }

    // Apply retry wrapper if configured
    if (this.integrationConfig.maxRetries > 0) {
      fetchFn = this.withRetry(fetchFn);
    }

    // Apply throttling wrapper if configured
    if (this.integrationConfig.limitPerMinute > 0) {
      fetchFn = pThrottle({
        limit: this.integrationConfig.limitPerMinute,
        interval: 60_000,
      })(fetchFn);
    }

    return fetchFn;
  }

  private withRetry(fetchFn: FetchFunction): FetchFunction {
    return async (url, options) => {
      let retries = 0;

      while (retries <= this.integrationConfig.maxRetries) {
        this.queue.push(() => {});

        const response = await fetchFn(url, options);

        if (
          !this.integrationConfig.retryStatusCodes.includes(response.status) ||
          retries >= this.integrationConfig.maxRetries
        ) {
          this.queue.pop();
          return response;
        }

        if (response.status === 429) {
          this.counter429?.add(1);
        }

        retries++;

        // Calculate delay from Retry-After header or use exponential backoff
        // Note: project, groups and users APIs may not respond with Retry-After header
        // depending on the used Gitlab instance
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : Math.min(500 * Math.pow(2, retries - 1), 10000); // Exponential backoff, cap at 10 seconds

        await new Promise(resolve => setTimeout(resolve, delay));
      }
      this.queue.pop();
      // This should never be reached due to the loop condition, but TypeScript needs it
      throw new Error('Max retries exceeded');
    };
  }

  private setupTelemetry() {
    this.gauge = this.meter.createObservableGauge('throttler.queue.size', {
      description: 'Number of requests in queue',
    });

    this.gauge.addCallback(observableResult => {
      observableResult.observe(this.queue.length);
    });

    this.counter429 = this.meter.createCounter('throttler.429.count', {
      description: 'Number of 429 responses',
    });
  }
}

/**
 * Takes a GitLab URL and replaces the type part (blob, tree etc).
 *
 * @param url - The original URL
 * @param type - The desired type, e.g. 'blob', 'tree', 'edit'
 * @public
 */
export function replaceGitLabUrlType(
  url: string,
  type: 'blob' | 'tree' | 'edit',
): string {
  return url.replace(/\/\-\/(blob|tree|edit)\//, `/-/${type}/`);
}
