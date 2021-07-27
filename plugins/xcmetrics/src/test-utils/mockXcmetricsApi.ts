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
import { XcmetricsApi } from '../api';

export const mockUserId = 'user_id';
export const mockBuildId = 'build_id';
export const mockStatus = 'succeeded';

export const createMockXcmetricsApi = (): jest.Mocked<XcmetricsApi> => ({
  getBuildStatuses: jest
    .fn()
    .mockResolvedValue([{ id: mockBuildId, status: mockStatus }]),
  getBuild: jest.fn().mockResolvedValue({
    id: mockBuildId,
    buildStatus: 'succeeded',
    duration: 10.0,
    startTimestamp: '1626365026',
  }),
  getBuilds: jest.fn().mockResolvedValue([
    {
      userid: mockUserId,
      warningCount: 1,
      duration: 123.45,
      isCi: false,
      projectName: 'App',
      buildStatus: mockStatus,
      schema: 'AppSchema',
    },
  ]),
  getBuildCounts: jest.fn().mockResolvedValue([
    { day: '2021-07-10', builds: 10, errors: 1 },
    { day: '2021-07-09', builds: 11, errors: 2 },
  ]),
  getBuildTimes: jest.fn().mockResolvedValue([
    {
      day: '2021-07-10',
      durationP50: 1.1,
      durationP95: 2.1,
      totalDuration: 3.1,
    },
    {
      day: '2021-07-09',
      durationP50: 1.2,
      durationP95: 2.2,
      totalDuration: 3.2,
    },
  ]),
});
