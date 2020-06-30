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

import URLFormatter from './urlFormatter';

describe('URLFormatter', () => {
  describe('formatURL', () => {
    it('should not change an absolute url', () => {
      const formatter = new URLFormatter('https://www.google.com/');
      expect(formatter.formatURL('https://www.mkdocs.org/')).toEqual(
        'https://www.mkdocs.org/',
      );
    });

    it('should convert a relative url to an absolute url', () => {
      const formatter = new URLFormatter(
        'https://www.mkdocs.org/user-guide/getting-started/',
      );
      expect(formatter.formatURL('../../support/installing/')).toEqual(
        'https://www.mkdocs.org/support/installing/',
      );
    });

    it('should add a trailing slash', () => {
      const formatter = new URLFormatter(
        'https://www.mkdocs.org/user-guide/getting-started',
      );
      expect(formatter.formatURL('./getting-started')).toEqual(
        'https://www.mkdocs.org/user-guide/getting-started/',
      );
    });

    it('should not add a trailing slash', () => {
      const formatter = new URLFormatter(
        'https://www.mkdocs.org/user-guide/getting-started/',
      );
      expect(formatter.formatURL('.')).toEqual(
        'https://www.mkdocs.org/user-guide/getting-started/',
      );
    });

    it('should not add multiple hashes', () => {
      const formatter = new URLFormatter(
        'https://www.mkdocs.org/user-guide/getting-started/#hash1',
      );
      expect(formatter.formatURL('./#hash2')).toEqual(
        'https://www.mkdocs.org/user-guide/getting-started/#hash2',
      );
    });
  });

  describe('formatBaseURL', () => {
    it('should keep query params in URL', () => {
      const formatter = new URLFormatter(
        'https://www.mkdocs.org/user-guide/getting-started/?query=hello+world',
      );
      expect(formatter.formatBaseURL()).toEqual(
        'https://www.mkdocs.org/user-guide/getting-started/?query=hello+world',
      );
    });

    it('should keep hash in URL', () => {
      const formatter = new URLFormatter(
        'https://www.mkdocs.org/user-guide/getting-started/#hash',
      );
      expect(formatter.formatBaseURL()).toEqual(
        'https://www.mkdocs.org/user-guide/getting-started/#hash',
      );
    });
  });
});
