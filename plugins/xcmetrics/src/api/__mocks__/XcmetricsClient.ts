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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Build, BuildStatus, XcmetricsApi } from '../types';

export const mockBuild = {
  userid: 'userid1',
  warningCount: 1,
  duration: 1,
  startTimestamp: '2021-01-01T00:00:00Z',
  isCi: true,
  startTimestampMicroseconds: 0,
  category: '',
  endTimestampMicroseconds: 10000,
  day: '2021-01-01',
  compilationEndTimestamp: '2021-01-01T00:00:01Z',
  tag: '',
  projectName: 'Project',
  compilationEndTimestampMicroseconds: 1,
  errorCount: 1,
  id: 'buildId',
  buildStatus: 'succeeded',
  compilationDuration: 1,
  schema: 'Schema',
  compiledCount: 1,
  endTimestamp: '2021-01-01T00:00:01Z',
  userid256: 'userId256',
  machineName: 'Example_Machine',
  wasSuspended: true,
} as Build;

export const mockBuildCount = { day: '2021-07-10', builds: 10, errors: 1 };
export const mockBuildTime = {
  day: '2021-07-10',
  durationP50: 1.1,
  durationP95: 2.1,
  totalDuration: 3.1,
};
export const mockBuildStatus = { id: 'build_id', status: 'succeeded' };

export const XcmetricsClient: XcmetricsApi = {
  getBuild: (id: string) => {
    return Promise.resolve({ ...mockBuild, id });
  },
  getBuilds: () => {
    return Promise.resolve([
      { ...mockBuild, id: '1' },
      { ...mockBuild, id: '2', userid: 'userid2' },
    ]);
  },
  getFilteredBuilds: (
    from: string,
    to: string,
    status?: BuildStatus,
    page?: number,
    perPage?: number,
  ) => {
    return Promise.resolve({
      items: [mockBuild],
      metadata: {
        per: 10,
        total: 1,
        page: 1,
      },
    });
  },
  getBuildCounts: () => {
    return Promise.resolve([mockBuildCount, mockBuildCount]);
  },
  getBuildStatuses: (limit: number) => {
    return Promise.resolve([mockBuild].slice(0, limit));
  },
  getBuildTimes: (days: number) => {
    return Promise.resolve([mockBuildTime, mockBuildTime].slice(0, days));
  },
};
