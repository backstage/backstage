/*
 * Copyright 2026 The Backstage Authors
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
  formatMessagePath,
  createMessagePathParser,
  messagePatternToGlob,
  patternHasSubdirectories,
  DEFAULT_MESSAGE_PATTERN,
} from './messageFilePath';

describe('messageFilePath', () => {
  describe('formatMessagePath', () => {
    it('formats the default pattern', () => {
      expect(formatMessagePath(DEFAULT_MESSAGE_PATTERN, 'org', 'en')).toBe(
        'org.en.json',
      );
    });

    it('formats with a different language', () => {
      expect(formatMessagePath(DEFAULT_MESSAGE_PATTERN, 'catalog', 'sv')).toBe(
        'catalog.sv.json',
      );
    });

    it('formats a language-directory pattern', () => {
      expect(formatMessagePath('{lang}/{id}.json', 'org', 'sv')).toBe(
        'sv/org.json',
      );
    });

    it('formats a pattern with lang first in filename', () => {
      expect(formatMessagePath('{lang}.{id}.json', 'org', 'de')).toBe(
        'de.org.json',
      );
    });
  });

  describe('createMessagePathParser', () => {
    it('parses the default pattern', () => {
      const parse = createMessagePathParser(DEFAULT_MESSAGE_PATTERN);
      expect(parse('org.en.json')).toEqual({ id: 'org', lang: 'en' });
    });

    it('parses dotted ref IDs in the default pattern', () => {
      const parse = createMessagePathParser(DEFAULT_MESSAGE_PATTERN);
      expect(parse('plugin.notifications.sv.json')).toEqual({
        id: 'plugin.notifications',
        lang: 'sv',
      });
    });

    it('parses a language-directory pattern', () => {
      const parse = createMessagePathParser('{lang}/{id}.json');
      expect(parse('sv/org.json')).toEqual({ id: 'org', lang: 'sv' });
    });

    it('returns undefined for non-matching paths', () => {
      const parse = createMessagePathParser(DEFAULT_MESSAGE_PATTERN);
      expect(parse('not-a-match.txt')).toBeUndefined();
      expect(parse('dir/org.en.json')).toBeUndefined();
    });

    it('returns undefined for invalid language code', () => {
      const parse = createMessagePathParser('{lang}/{id}.json');
      expect(parse('123/org.json')).toBeUndefined();
    });

    it('throws on pattern missing {id}', () => {
      expect(() => createMessagePathParser('{lang}.json')).toThrow(
        'must contain {id}',
      );
    });

    it('throws on pattern missing {lang}', () => {
      expect(() => createMessagePathParser('{id}.json')).toThrow(
        'must contain {lang}',
      );
    });

    it('throws on pattern not ending with .json', () => {
      expect(() => createMessagePathParser('{id}.{lang}.yaml')).toThrow(
        'must end with .json',
      );
    });
  });

  describe('messagePatternToGlob', () => {
    it('converts the default pattern', () => {
      expect(messagePatternToGlob(DEFAULT_MESSAGE_PATTERN)).toBe('*.*.json');
    });

    it('converts a language-directory pattern', () => {
      expect(messagePatternToGlob('{lang}/{id}.json')).toBe('*/*.json');
    });
  });

  describe('patternHasSubdirectories', () => {
    it('returns false for flat patterns', () => {
      expect(patternHasSubdirectories(DEFAULT_MESSAGE_PATTERN)).toBe(false);
    });

    it('returns true for patterns with directories', () => {
      expect(patternHasSubdirectories('{lang}/{id}.json')).toBe(true);
    });
  });
});
