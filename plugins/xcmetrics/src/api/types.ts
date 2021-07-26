/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createApiRef } from '@backstage/core-plugin-api';

export type BuildStatus = 'succeeded' | 'failed' | 'stopped';

export type BuildItem = {
  userid: string;
  warningCount: number;
  duration: number;
  startTimestamp: string;
  isCi: boolean;
  startTimestampMicroseconds: number;
  category: string;
  endTimestampMicroseconds: number;
  day: string;
  compilationEndTimestamp: string;
  tag: string;
  projectName: string;
  compilationEndTimestampMicroseconds: number;
  errorCount: number;
  id: string;
  buildStatus: BuildStatus;
  compilationDuration: number;
  schema: string;
  compiledCount: number;
  endTimestamp: string;
  userid256: string;
  machineName: string;
  wasSuspended: boolean;
};

export type BuildsResult = {
  items: BuildItem[];
  metadata: {
    per: number;
    total: number;
    page: number;
  };
};

export interface XcmetricsApi {
  getBuilds(): Promise<BuildItem[]>;
}

export const xcmetricsApiRef = createApiRef<XcmetricsApi>({
  id: 'plugin.xcmetrics.api',
  description: 'Used by the XCMetrics plugin to make requests',
});
