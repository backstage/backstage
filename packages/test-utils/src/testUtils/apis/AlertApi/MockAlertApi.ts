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

import { AlertApi, AlertMessage } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';

/**
 * Mock implementation of {@link core-plugin-api#AlertApi} with helpers to ensure that alerts are posted correctly.
 * Use getAlerts in tests to verify posted alerts.
 *
 * @public
 */
export class MockAlertApi implements AlertApi {
  private alerts: AlertMessage[] = [];
  private observers = new Set<(alert: AlertMessage) => void>();

  post(alert: AlertMessage) {
    this.alerts.push(alert);
    this.observers.forEach(observer => observer(alert));
  }

  alert$(): Observable<AlertMessage> {
    return new Observable(subscriber => {
      const observer = (alert: AlertMessage) => {
        subscriber.next(alert);
      };

      this.observers.add(observer);

      return () => {
        this.observers.delete(observer);
      };
    });
  }

  getAlerts(): AlertMessage[] {
    return this.alerts;
  }

  waitForAlert(
    predicate: (alert: AlertMessage) => boolean,
    timeoutMs: number = 2000,
  ): Promise<AlertMessage> {
    return new Promise<AlertMessage>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.observers.delete(observer);
        reject(new Error('Timed out waiting for alert'));
      }, timeoutMs);

      const observer = (alert: AlertMessage) => {
        if (predicate(alert)) {
          clearTimeout(timeout);
          this.observers.delete(observer);
          resolve(alert);
        }
      };

      this.observers.add(observer);

      // Check existing alerts
      const existingAlert = this.alerts.find(predicate);
      if (existingAlert) {
        clearTimeout(timeout);
        this.observers.delete(observer);
        resolve(existingAlert);
      }
    });
  }
}
