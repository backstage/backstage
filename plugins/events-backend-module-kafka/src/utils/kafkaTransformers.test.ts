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
import { convertHeadersToMetadata, payloadToBuffer } from './kafkaTransformers';

describe('kafka-transformers', () => {
  describe('convertHeadersToMetadata', () => {
    it('should return undefined when headers is undefined', () => {
      const result = convertHeadersToMetadata(undefined);
      expect(result).toBeUndefined();
    });

    it('should convert string headers to metadata', () => {
      const headers = {
        'content-type': 'application/json',
        'user-id': '12345',
      };

      const result = convertHeadersToMetadata(headers);

      expect(result).toEqual({
        'content-type': 'application/json',
        'user-id': '12345',
      });
    });

    it('should convert Buffer headers to string metadata', () => {
      const headers = {
        'content-type': Buffer.from('application/json'),
        'correlation-id': Buffer.from('abc-123'),
      };

      const result = convertHeadersToMetadata(headers);

      expect(result).toEqual({
        'content-type': 'application/json',
        'correlation-id': 'abc-123',
      });
    });

    it('should convert array headers to string array metadata', () => {
      const headers = {
        tags: ['tag1', 'tag2'],
        'buffer-tags': [Buffer.from('tag3'), Buffer.from('tag4')],
        'mixed-tags': ['tag5', Buffer.from('tag6')],
      };

      const result = convertHeadersToMetadata(headers);

      expect(result).toEqual({
        tags: ['tag1', 'tag2'],
        'buffer-tags': ['tag3', 'tag4'],
        'mixed-tags': ['tag5', 'tag6'],
      });
    });

    it('should handle mixed header types', () => {
      const headers = {
        'string-header': 'value',
        'buffer-header': Buffer.from('buffer-value'),
        'array-header': ['item1', Buffer.from('item2')],
        'undefined-header': undefined,
      };

      const result = convertHeadersToMetadata(headers);

      expect(result).toEqual({
        'string-header': 'value',
        'buffer-header': 'buffer-value',
        'array-header': ['item1', 'item2'],
        'undefined-header': undefined,
      });
    });

    it('should handle empty headers object', () => {
      const headers = {};
      const result = convertHeadersToMetadata(headers);
      expect(result).toEqual({});
    });
  });

  describe('payloadToBuffer', () => {
    it('should return the same Buffer when payload is already a Buffer', () => {
      const originalBuffer = Buffer.from('test data');

      const result = payloadToBuffer(originalBuffer);

      expect(result).toBe(originalBuffer);
      expect(Buffer.isBuffer(result)).toBe(true);
    });

    it('should convert string to Buffer', () => {
      const payload = 'hello world';

      const result = payloadToBuffer(payload);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.toString()).toBe('hello world');
    });

    it('should convert object to JSON Buffer', () => {
      const payload = { name: 'John', age: 30 };

      const result = payloadToBuffer(payload);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(JSON.parse(result.toString())).toEqual(payload);
    });

    it('should convert array to JSON Buffer', () => {
      const payload = [1, 2, 3, 'test'];

      const result = payloadToBuffer(payload);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(JSON.parse(result.toString())).toEqual(payload);
    });

    it('should convert primitives to JSON Buffer', () => {
      expect(payloadToBuffer(42).toString()).toBe('42');
      expect(payloadToBuffer(true).toString()).toBe('true');
      expect(payloadToBuffer(null).toString()).toBe('null');
    });
  });
});
