/*
 * Copyright 2020 Spotify AB
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

import { Alert, AlertStatus } from '../types';

const createStatusHandler = (status?: string) => (alert: Alert) =>
  alert.status === status;
export const isActive = createStatusHandler();
export const isSnoozed = createStatusHandler(AlertStatus.Snoozed);
export const isAccepted = createStatusHandler(AlertStatus.Accepted);
export const isDismissed = createStatusHandler(AlertStatus.Dismissed);

export const sumOfAllAlerts = (sum: number, alerts: Alert[]) =>
  sum + alerts.length;

export function choose<T>(
  status: readonly [boolean, boolean, boolean],
  values: [T, T, T],
): T | null {
  const i = status.indexOf(true);
  return i < 0 ? null : values[i];
}
