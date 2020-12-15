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
export const tracksMock = {
  tracks: [
    {
      releases: [
        {
          name: '8.5.71.723',
          releaseNotes: [
            {
              language: 'en-US',
              text: 'test',
            },
          ],
          status: 'completed',
          versionCodes: [
            '12312312',
            '12312333',
            '33333333',
            '33333334',
            '44412444',
          ],
        },
      ],
      track: 'production',
    },
    {
      releases: [
        {
          name: '8.5.72.800',
          status: 'completed',
          versionCodes: ['123123123', '123123'],
        },
      ],
      track: 'beta',
    },
    {
      releases: [
        {
          name: '8.5.73.490',
          status: 'completed',
          versionCodes: [
            '31233245',
            '3563442280',
            '63534425281',
            '63442223585',
          ],
        },
      ],
      track: 'alpha',
    },
    {
      releases: [
        {
          status: 'draft',
        },
        {
          name: '8.5.20.835',
          status: 'completed',
          versionCodes: [
            '123062',
            '123063',
            '1231064',
            '441266',
            '491241067',
            '495541268',
          ],
        },
      ],
      track: 'internal',
    },
    {
      releases: [
        {
          status: 'draft',
        },
        {
          name: '2018-06-26',
          releaseNotes: [
            {
              language: 'en-US',
              text: 'test2',
            },
          ],
          status: 'completed',
          versionCodes: ['123123', '214124', '124124'],
        },
      ],
      track: 'test2',
    },
    {
      releases: [
        {
          name: '4.1.2.1334',
          status: 'completed',
          versionCodes: ['12874'],
        },
      ],
      track: 'test',
    },
    {
      releases: [
        {
          name: '4.1.2.1334',
          releaseNotes: [
            {
              language: 'en-US',
              text: 'test3',
            },
          ],
          status: 'completed',
          versionCodes: ['12874'],
        },
      ],
      track: 'test',
    },
  ],
};
