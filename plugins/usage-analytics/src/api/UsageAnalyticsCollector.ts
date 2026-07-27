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
import {
  AnalyticsApi,
  AnalyticsEvent,
  DiscoveryApi,
  FetchApi,
} from '@backstage/core-plugin-api';
import { RecordUsageEventsRequest } from '@backstage/plugin-usage-analytics-common';

const FLUSH_DELAY_MS = 5_000;
const MAX_RETRY_ATTEMPTS = 3;
const HEARTBEAT_MS = 30_000;
const REQUEST_TIMEOUT_MS = 10_000;

/** @public */
export class UsageAnalyticsCollector implements AnalyticsApi {
  private readonly sessionId: string;
  private readonly queue: RecordUsageEventsRequest['events'] = [];
  private previousPath: string | undefined;
  private previousNavigationAt = Date.now();
  private flushTimer: ReturnType<typeof setTimeout> | undefined;
  private heartbeatTimer: ReturnType<typeof setInterval> | undefined;
  private activeBatchSize = 0;
  private retryAttempts = 0;
  private flushInProgress = false;
  private heartbeatInProgress = false;
  private stopped = false;

  constructor(
    private readonly options: {
      discoveryApi: DiscoveryApi;
      fetchApi: FetchApi;
    },
  ) {
    this.sessionId = window.crypto.randomUUID();
    this.previousPath = window.location.pathname;
    this.sendHeartbeat();
    this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), HEARTBEAT_MS);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('pagehide', this.handlePageHide);
  }

  captureEvent(event: AnalyticsEvent): void {
    const currentPath = window.location.pathname;
    const { pluginId, extension } = event.context;
    const value =
      event.action === 'navigate'
        ? Math.min(1_800, (Date.now() - this.previousNavigationAt) / 1_000)
        : event.value;
    this.queue.push({
      eventId: window.crypto.randomUUID(),
      occurredAt: new Date().toISOString(),
      action: event.action,
      subject: event.action === 'navigate' ? event.subject : undefined,
      value,
      pluginId,
      extensionId: extension,
      currentPath,
      previousPath: this.previousPath,
    });
    const maxQueueSize = 1_000 + this.activeBatchSize;
    if (this.queue.length > maxQueueSize) {
      this.queue.splice(this.activeBatchSize, this.queue.length - maxQueueSize);
    }
    if (event.action === 'navigate') {
      this.previousPath = currentPath;
      this.previousNavigationAt = Date.now();
    }
    if (this.queue.length >= 20) {
      this.flush();
    } else if (!this.flushTimer) {
      this.scheduleFlush(FLUSH_DELAY_MS);
    }
  }

  shutdown() {
    this.stopped = true;
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
    );
    window.removeEventListener('pagehide', this.handlePageHide);
  }

  private readonly handleVisibilityChange = () => this.sendHeartbeat();

  private readonly handlePageHide = () => {
    this.sendHeartbeat(true);
    this.flush(true);
  };

  private async flush(keepalive = false) {
    if (this.stopped) {
      return;
    }
    if (this.flushInProgress) {
      if (keepalive && this.queue.length > 0) {
        try {
          await this.post(
            '/v1/events',
            { sessionId: this.sessionId, events: this.queue.slice(0, 8) },
            true,
          );
        } catch {
          // The normal request still owns the batch and will retry it.
        }
      }
      return;
    }
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = undefined;
    }
    const batchSize = keepalive ? 8 : 100;
    const batch = this.queue.slice(0, batchSize);
    if (batch.length === 0) {
      return;
    }
    this.activeBatchSize = batch.length;
    this.flushInProgress = true;
    let status: number | undefined;
    try {
      const response = await this.post(
        '/v1/events',
        { sessionId: this.sessionId, events: batch },
        keepalive,
      );
      status = response.status;
      if (!response.ok) {
        throw new Error(`Usage analytics ingestion failed with ${status}`);
      }
      this.queue.splice(0, batch.length);
      this.retryAttempts = 0;
    } catch {
      const retryable =
        status === undefined ||
        status === 408 ||
        status === 429 ||
        status >= 500;
      if (!keepalive && retryable && this.retryAttempts < MAX_RETRY_ATTEMPTS) {
        this.scheduleFlush(FLUSH_DELAY_MS * 2 ** this.retryAttempts);
        this.retryAttempts += 1;
      } else if (!keepalive) {
        this.queue.splice(0, batch.length);
        this.retryAttempts = 0;
      }
    } finally {
      this.activeBatchSize = 0;
      this.flushInProgress = false;
    }
    if (this.queue.length > 0 && !this.flushTimer) {
      this.scheduleFlush(FLUSH_DELAY_MS);
    }
  }

  private async sendHeartbeat(keepalive = false) {
    if (this.heartbeatInProgress) {
      return;
    }
    this.heartbeatInProgress = true;
    try {
      await this.post(
        '/v1/presence/heartbeat',
        {
          sessionId: this.sessionId,
          currentPath: window.location.pathname,
        },
        keepalive,
      );
    } catch {
      // Presence is best-effort; the next interval retries it.
    } finally {
      this.heartbeatInProgress = false;
    }
  }

  private async post(path: string, body: unknown, keepalive: boolean) {
    const baseUrl = await this.options.discoveryApi.getBaseUrl(
      'usage-analytics',
    );
    const response = await this.options.fetchApi.fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      keepalive,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return response;
  }

  private scheduleFlush(delayMs: number) {
    if (!this.flushTimer && !this.stopped) {
      this.flushTimer = setTimeout(() => {
        this.flushTimer = undefined;
        this.flush();
      }, delayMs);
    }
  }
}
