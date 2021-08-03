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

import {
  Build,
  BuildCount,
  BuildError,
  BuildFilters,
  BuildHost,
  BuildMetadata,
  BuildStatusResult,
  BuildTime,
  BuildWarning,
  XcmetricsApi,
} from '../types';

export const mockBuild: Build = {
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
  projectName: 'ProjectName',
  compilationEndTimestampMicroseconds: 1,
  errorCount: 1,
  id: 'buildId',
  buildStatus: 'succeeded',
  compilationDuration: 1,
  schema: 'SchemaName',
  compiledCount: 1,
  endTimestamp: '2021-01-01T00:00:01Z',
  userid256: 'userId256',
  machineName: 'Example_Machine',
  wasSuspended: true,
};

export const mockBuildCount: BuildCount = {
  day: '2021-07-10',
  builds: 10,
  errors: 1,
};

export const mockBuildError: BuildError = {
  detail: `\/Users\/<redacted>\/myproject\/Sources\/MyClass.m:241:97:// /  error: instance method 'fetch' not found ; did you mean 'fetchIt'?\r
  myclass:[self.myService fetch]\r                                                                                                ^~~~~~~~~~~~~~\r                                                                                                fetch\r
  1 error generated.\r"`,
  characterRangeEnd: 13815,
  id: '3E6EF185-6AC1-4E95-87E8-E305F41916E9',
  endingColumn: 97,
  parentIdentifier: 'MyMac_34580469-5792-40F3-BEFB-7C5925996F23_8860',
  day: '2020-11-02T00:00:00Z',
  type: 'clangError',
  title: 'Instance method "fetch" not found ; did you mean "fetchIt"?',
  endingLine: 241,
  severity: 2,
  startingLine: 241,
  parentType: 'step',
  buildIdentifier: 'buildId',
  startingColumn: 97,
  characterRangeStart: 0,
  documentURL: 'file:///Users/<redacted>/myproject/Sources/MyClass.m',
};

export const mockBuildHost: BuildHost = {
  id: '9DD5508D-4AD9-4C1C-AB7C-45BC2183EC51',
  swapFreeMb: 1615.25,
  hostOsFamily: 'Darwin',
  isVirtual: false,
  uptimeSeconds: 1602055187,
  hostModel: 'MacBookPro14,2',
  hostOsVersion: '10.15.7',
  day: '2020-10-26T00:00:00Z',
  cpuCount: 4,
  swapTotalMb: 7168,
  hostOs: 'Mac OS X',
  hostArchitecture: 'x86_64',
  memoryTotalMb: 16384,
  timezone: 'CET',
  cpuModel: 'Intel(R) Core(TM) i7-7567U CPU @ 3.50GHz',
  buildIdentifier: 'buildId',
  memoryFreeMb: 24.5234375,
  cpuSpeedGhz: 3.5,
};

export const mockBuildMetadata: BuildMetadata = {
  anotherKey: '42',
  thirdKey: 'Third value',
  aKey: 'value1',
};

export const mockBuildTime: BuildTime = {
  day: '2021-07-10',
  durationP50: 1.1,
  durationP95: 2.1,
  totalDuration: 3.1,
};
export const mockBuildStatus: BuildStatusResult = {
  id: 'build_id',
  buildStatus: 'succeeded',
};

export const mockBuildWarning: BuildWarning = {
  detail: null,
  characterRangeEnd: 9817,
  documentURL: 'file:///Users/<redacted>/myproject/Sources/MyViewController.m',
  endingColumn: 22,
  id: '5F2011AC-F87F-4EDC-BBC6-2BBA3D789EB3',
  parentIdentifier: 'MyMac_34580469-5792-40F3-BEFB-7C5925996F23_1845',
  day: '2020-11-02T00:00:00Z',
  type: 'deprecatedWarning',
  title:
    "'dimsBackgroundDuringPresentation' is deprecated: first deprecated in iOS 12.0",
  endingLine: 235,
  severity: 1,
  startingLine: 235,
  parentType: 'step',
  clangFlag: '[-Wdeprecated-declarations]',
  startingColumn: 22,
  buildIdentifier: 'MyMac_34580469-5792-40F3-BEFB-7C5925996F23_1',
  characterRangeStart: 0,
};

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
    _filters: BuildFilters,
    _page?: number,
    _perPage?: number,
  ) => {
    return Promise.resolve({
      items: [
        mockBuild,
        { ...mockBuild, buildStatus: 'failed', projectName: 'ProjectName2' },
      ],
      metadata: {
        per: 10,
        total: 2,
        page: 1,
      },
    });
  },
  getBuildErrors: (buildId: string) => {
    return Promise.resolve([{ ...mockBuildError, buildIdentifier: buildId }]);
  },
  getBuildCounts: () => {
    return Promise.resolve([mockBuildCount, mockBuildCount]);
  },
  getBuildHost: (buildId: string) => {
    return Promise.resolve({ ...mockBuildHost, buildIdentifier: buildId });
  },
  getBuildMetadata: (_buildId: string) => {
    return Promise.resolve(mockBuildMetadata);
  },
  getBuildStatuses: (limit: number) => {
    return Promise.resolve([mockBuild].slice(0, limit));
  },
  getBuildTimes: (days: number) => {
    return Promise.resolve([mockBuildTime, mockBuildTime].slice(0, days));
  },
  getBuildWarnings: (buildId: string) => {
    return Promise.resolve([{ ...mockBuildWarning, buildIdentifier: buildId }]);
  },
  getProjects: () => {
    return Promise.resolve([mockBuild.projectName]);
  },
};
