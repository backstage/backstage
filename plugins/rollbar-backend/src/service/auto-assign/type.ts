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

import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { Router } from 'express';
import { RollbarApi } from '../../api';

export interface AutoAssignOptions {
  rollbarApi: RollbarApi;
  logger: Logger;
  rollbarCheck: RollbarCheckers;
  router: Router;
}

// Rollbar API types. Just declared enough to use internally
export type RollbarOccurrenceTraceFrame = {
  filename: string;
  method: string;
  lineno?: string;
};
export type RollbarOccurrenceTrace = {
  frames: RollbarOccurrenceTraceFrame[];
};

export type RollbarItemLastOccurrenceBody = {
  trace: RollbarOccurrenceTrace;
};

export type RollbarItemLastOccurrence = {
  body: RollbarItemLastOccurrenceBody;
};

export type RollbarItem = {
  id: number;
  project_id: number;
  last_occurrence: RollbarItemLastOccurrence;
};

export interface RollbarManagerOptions {
  ownerChecks: RollbarCheckOwner[];
  logger: Logger;
  config: Config;
}

export type RollbarCheckOwnerContext = {
  config: Config;
  logger: Logger;
};

export interface RollbarCheckOwner {
  id: string;
  check: (
    ctx: RollbarCheckOwnerContext,
    rollbarItem: RollbarItem,
  ) => Promise<string | undefined>;
}

export interface RollbarCheckers {
  runChecks(
    rollbarItem: RollbarItem,
  ): Promise<{ ownerUserId: string } | undefined>;
}
