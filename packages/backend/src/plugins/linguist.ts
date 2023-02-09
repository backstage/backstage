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

import { TaskScheduleDefinition } from '@backstage/backend-tasks';
import { createRouter } from '@backstage/plugin-linguist-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const schedule: TaskScheduleDefinition = {
    frequency: { minutes: 2 },
    timeout: { minutes: 15 },
    initialDelay: { seconds: 15 },
  };

  return createRouter(
    {
      schedule: schedule,
      age: { days: 30 },
      batchSize: 2,
      useSourceLocation: false,
    },
    { ...env },
  );
}
