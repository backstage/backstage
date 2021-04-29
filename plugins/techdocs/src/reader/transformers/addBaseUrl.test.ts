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

import { createTestShadowDom } from '../../test-utils';
import { addBaseUrl } from '../transformers';
import { TechDocsStorageApi } from '../../api';

const DOC_STORAGE_URL = 'https://example-host.storage.googleapis.com';

const techdocsStorageApi: TechDocsStorageApi = {
  getBaseUrl: jest.fn(() => Promise.resolve(DOC_STORAGE_URL)),
  getEntityDocs: () => new Promise(resolve => resolve('yes!')),
  syncEntityDocs: () => new Promise(resolve => resolve(true)),
  getApiOrigin: jest.fn(),
  getBuilder: jest.fn(),
  getStorageUrl: jest.fn(),
};

const fixture = `
  <html>
    <head>
      <link type="stylesheet" href="astyle.css" />
    </head>
    <body>
      <img src="test.jpg" />
      <script type="javascript" src="script.js"></script>
    </body>
  </html>
`;

const mockEntityId = {
  kind: '',
  namespace: '',
  name: '',
};

describe('addBaseUrl', () => {
  it('contains relative paths', () => {
    createTestShadowDom(fixture, {
      preTransformers: [
        addBaseUrl({
          techdocsStorageApi,
          entityId: mockEntityId,
          path: '',
        }),
      ],
      postTransformers: [],
    });

    expect(techdocsStorageApi.getBaseUrl).toHaveBeenNthCalledWith(
      1,
      'test.jpg',
      mockEntityId,
      '',
    );
    expect(techdocsStorageApi.getBaseUrl).toHaveBeenNthCalledWith(
      2,
      'script.js',
      mockEntityId,
      '',
    );
    expect(techdocsStorageApi.getBaseUrl).toHaveBeenNthCalledWith(
      3,
      'astyle.css',
      mockEntityId,
      '',
    );
  });
});
