/*
 * Copyright 2025 The Backstage Authors
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

import { AlertMessage } from '@backstage/frontend-plugin-api';
import { AlertApi } from '@backstage/frontend-plugin-api';
import { Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';

/**
 * Mock implementation of {@link @backstage/frontend-plugin-api#AlertApi} for testing alert behavior.
 *
 * @public
 * @example
 * ```ts
 * const alertApi = new MockAlertApi();
 * alertApi.post({ message: 'Test alert' });
 * expect(alertApi.getAlerts()).toHaveLength(1);
 * ```
 */
export class MockAlertApi implements AlertApi {
  private alerts: AlertMessage[] = [];
  private observers = new Set<(alert: AlertMessage) => void>();

  post(alert: AlertMessage) {
    this.alerts.push(alert);
    this.observers.forEach(observer => observer(alert));
  }

  alert$(): Observable<AlertMessage> {
    return new ObservableImpl(subscriber => {
      const observer = (alert: AlertMessage) => {
        subscriber.next(alert);
      };
      this.observers.add(observer);
      return () => {
        this.observers.delete(observer);
      };
    });
  }

  /**
   * Get all alerts that have been posted.
   */
  getAlerts(): AlertMessage[] {
    return this.alerts;
  }

  /**
   * Clear all collected alerts.
   */
  clearAlerts(): void {
    this.alerts = [];
  }

  /**
   * Wait for an alert matching the given predicate.
   *
   * @param predicate - Function to test each alert
   * @param timeoutMs - Maximum time to wait in milliseconds
   * @returns Promise that resolves with the matching alert
   */
  async waitForAlert(
    predicate: (alert: AlertMessage) => boolean,
    timeoutMs: number = 2000,
  ): Promise<AlertMessage> {
    const existing = this.alerts.find(predicate);
    if (existing) {
      return existing;
    }
    const observers = this.observers;

    return new Promise<AlertMessage>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        observers.delete(observer);
        reject(new Error('Timed out waiting for alert'));
      }, timeoutMs);

      function observer(alert: AlertMessage) {
        if (predicate(alert)) {
          clearTimeout(timeoutId);
          observers.delete(observer);
          resolve(alert);
        }
      }

      observers.add(observer);
    });
  }
}
