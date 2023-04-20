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
import { createConfluenceVariables } from './helpers';

describe('createConfluenceVariables', () => {
  it('should return values for Confluence Url', async () => {
    const url = 'https://confluence.example.com/display/SPACEKEY/Page+Title';
    const { spacekey, title, titleWithSpaces } =
      await createConfluenceVariables(url);

    expect(spacekey).toEqual('SPACEKEY');
    expect(title).toEqual('Page+Title');
    expect(titleWithSpaces).toEqual('Page Title');
  });

  it('should return values for Confluence Cloud Url', async () => {
    const url =
      'https://example.atlassian.net/wiki/spaces/CLOUDSPACEKEY/pages/1234567/Cloud+Page+Title';

    const { spacekey, title, titleWithSpaces } =
      await createConfluenceVariables(url);

    expect(spacekey).toEqual('CLOUDSPACEKEY');
    expect(title).toEqual('Cloud+Page+Title');
    expect(titleWithSpaces).toEqual('Cloud Page Title');
  });
});
