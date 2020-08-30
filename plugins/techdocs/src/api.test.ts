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
import { TechDocsStorageApi } from './api';

const DOC_STORAGE_URL = 'https://example-storage.com';

const mockEntity = {
  kind: 'Component',
  namespace: 'default',
  name: 'test-component',
};

describe('TechDocsStorageApi', () => {
  it('should return correct base url based on defined storage', () => {
    const storageApi = new TechDocsStorageApi({ apiOrigin: DOC_STORAGE_URL });

    expect(storageApi.getBaseUrl('test.js', mockEntity, '')).toEqual(
      `${DOC_STORAGE_URL}/${mockEntity.kind}/${mockEntity.namespace}/${mockEntity.name}/test.js`,
    );
  });

  it('should return base url with correct entity structure', () => {
    const storageApi = new TechDocsStorageApi({ apiOrigin: DOC_STORAGE_URL });

    expect(storageApi.getBaseUrl('test/', mockEntity, '')).toEqual(
      `${DOC_STORAGE_URL}/${mockEntity.kind}/${mockEntity.namespace}/${mockEntity.name}/test/`,
    );
  });
});
