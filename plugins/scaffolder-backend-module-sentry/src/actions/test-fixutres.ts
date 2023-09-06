/*
 * Copyright 2023 The Backstage Authors
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
export const exampleResponseBody = {
  id: '60120449b6b1d5e45f75561e6dabd80b',
  name: 'Liked Pegasus',
  label: 'Liked Pegasus',
  public: '60120449b6b1d5e45f75561e6dabd80b',
  secret: '189485c3b8ccf582bf5e12c530ef8858',
  projectId: 4505281256090153,
  isActive: true,
  rateLimit: {
    window: 7200,
    count: 1000,
  },
  dsn: {
    secret:
      'https://a785682ddda742d7a8a4088810e67701:bcd99b3790b3441c85ce4b1eaa854f66@o4504765715316736.ingest.sentry.io/4505281256090153',
    public:
      'https://a785682ddda742d7a8a4088810e67791@o4504765715316736.ingest.sentry.io/4505281256090153',
    csp: 'https://o4504765715316736.ingest.sentry.io/api/4505281256090153/csp-report/?sentry_key=a785682ddda719b7a8a4011110d75598',
    security:
      'https://o4504765715316736.ingest.sentry.io/api/4505281256090153/security/?sentry_key=a785682ddda719b7a8a4011110d75598',
    minidump:
      'https://o4504765715316736.ingest.sentry.io/api/4505281256090153/minidump/?sentry_key=a785682ddda719b7a8a4011110d75598',
    unreal:
      'https://o4504765715316736.ingest.sentry.io/api/4505281256090153/unreal/a785682ddda719b7a8a4011110d75598/',
    cdn: 'https://js.sentry-cdn.com/a785682ddda719b7a8a4011110d75598.min.js',
  },
  browserSdkVersion: '7.x',
  browserSdk: {
    choices: [
      ['latest', 'latest'],
      ['7.x', '7.x'],
    ],
  },
  dateCreated: '2023-06-21T19:50:26.036254Z',
  dynamicSdkLoaderOptions: {
    hasReplay: true,
    hasPerformance: true,
    hasDebug: true,
  },
};
