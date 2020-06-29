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

import URLParser from './urlParser';

describe('URLParser', () => {
  it('should not change an absolute url', () => {
    const urlParser = new URLParser(
      'https://www.google.com/',
      'https://www.mkdocs.org/',
    );

    expect(urlParser.parse()).toEqual('https://www.mkdocs.org/');
  });

  it('should convert a relative url to an absolute url', () => {
    const urlParser = new URLParser(
      'https://www.mkdocs.org/user-guide/getting-started/',
      '../../support/installing/',
    );

    expect(urlParser.parse()).toEqual(
      'https://www.mkdocs.org/support/installing/',
    );
  });

  it('should add a trailing slash', () => {
    const urlParser = new URLParser(
      'https://www.mkdocs.org/user-guide/getting-started',
      '.',
    );

    expect(urlParser.parse()).toEqual(
      'https://www.mkdocs.org/user-guide/getting-started/',
    );
  });

  it('should not add a trailing slash', () => {
    const urlParser = new URLParser(
      'https://www.mkdocs.org/user-guide/getting-started/',
      '.',
    );

    expect(urlParser.parse()).toEqual(
      'https://www.mkdocs.org/user-guide/getting-started/',
    );
  });
});
