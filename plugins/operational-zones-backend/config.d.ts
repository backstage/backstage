/*
 * Copyright 2024 The Backstage Authors
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

export interface Config {
  /** Configuration for the operational-zones plugin */
  operationalZones?: {
    /** Static zone schedule definitions */
    schedules?: Array<{
      /** Unique operation identifier */
      operationId: string;
      /** Zone level when no window is active (default: 'green') */
      defaultLevel?: string;
      /** Time windows that override the default level */
      windows: Array<{
        /** Zone level during this window: 'green', 'yellow', or 'red' */
        level: string;
        /** 5-field cron expression for when this window starts */
        cron: string;
        /** Duration in minutes that this window remains active */
        durationMinutes: number;
      }>;
    }>;
  };
}
