/*
 * Copyright 2025 The Backstage Authors
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
import { createGetDocumentTypesAction } from './createGetDocumentTypesAction';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';

describe('createGetDocumentTypesAction', () => {
  it('returns the correct document types', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockGetDocumentTypes = jest.fn().mockReturnValue({
      a: {},
      b: {},
      c: {},
    });
    const mockSearchIndexService = {
      getDocumentTypes: mockGetDocumentTypes,
    } as any;
    createGetDocumentTypesAction({
      searchIndexService: mockSearchIndexService,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke<{ types: string[] }>({
      id: 'test:get-document-types',
      input: {},
    });

    expect(result.output.types).toEqual(['a', 'b', 'c']);
  });
});
