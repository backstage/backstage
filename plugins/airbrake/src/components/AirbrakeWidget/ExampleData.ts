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
export default {
  count: 2,
  end: '',
  groups: [
    {
      id: '1',
      projectId: 123,
      resolved: false,
      muted: false,
      mutedBy: 0,
      mutedAt: null,
      errors: [
        {
          type: 'Error',
          message: 'useSearch must be used within a SearchContextProvider',
          backtrace: [
            {
              file: 'webpack-internal:///../../node_modules/@backstage/plugin-search/dist/esm/index-893ec2f5.esm.js',
              function: 'useSearch',
              line: 303,
              column: 11,
              code: null,
            },
          ],
        },
      ],
      attributes: null,
      context: {
        action: '',
        component: '',
        environment: 'local',
        severity: 'error',
      },
      lastDeployId: '0',
      lastDeployAt: null,
      lastNoticeId: '234',
      lastNoticeAt: '2021-12-19T09:59:00.124Z',
      noticeCount: 5,
      noticeTotalCount: 5,
      commentCount: 0,
      createdAt: '2021-12-19T09:44:30.067447Z',
    },
    {
      id: '2',
      projectId: 123,
      resolved: true,
      muted: false,
      mutedBy: 0,
      mutedAt: null,
      errors: [
        {
          type: 'ChunkLoadError',
          message:
            'Loading chunk 7764 failed.\n(error: https://example.com/static/react-syntax-highlighter/lowlight-import.9ac339f2.chunk.js)',
          backtrace: [
            {
              file: '/PROJECT_ROOT/static/runtime.069c874d.js',
              function: 'Object._.f.j',
              line: 1,
              column: 19465,
              code: null,
            },
          ],
        },
      ],
      attributes: null,
      context: {
        action: '',
        component: '',
        environment: 'local',
        severity: 'error',
      },
      lastDeployId: '0',
      lastDeployAt: null,
      lastNoticeId: '345',
      lastNoticeAt: '2021-12-15T17:16:38.419Z',
      noticeCount: 1,
      noticeTotalCount: 1,
      commentCount: 0,
      createdAt: '2021-12-15T17:16:38.41983Z',
    },
  ],
  page: 1,
  resolvedCount: 1,
  unresolvedCount: 1,
};
