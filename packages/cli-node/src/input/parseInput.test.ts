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

import { parseCommaSeparatedList, parseKeyValuePairs } from './parseInput';

describe('parseKeyValuePairs', () => {
  it('returns undefined when no pairs are provided', () => {
    expect(parseKeyValuePairs(undefined)).toBeUndefined();
    expect(parseKeyValuePairs([])).toBeUndefined();
  });

  it('parses repeated key-value pairs and coerces primitive values', () => {
    expect(
      parseKeyValuePairs([
        'name=my-app',
        'enabled=true',
        'disabled=false',
        'replicas=3',
        'ratio=0.5',
        'query=kind=Component',
        'description=   ',
      ]),
    ).toEqual({
      name: 'my-app',
      enabled: true,
      disabled: false,
      replicas: 3,
      ratio: 0.5,
      query: 'kind=Component',
      description: '   ',
    });
  });

  it('rejects malformed and JSON object inputs', () => {
    expect(() => parseKeyValuePairs(['missing-separator'])).toThrow(
      'expected format: key=value',
    );
    expect(() => parseKeyValuePairs(['=missing-key'])).toThrow(
      'expected format: key=value',
    );
    expect(() =>
      parseKeyValuePairs(['{"url":"https://example.com?a=b"}']),
    ).toThrow(
      'JSON object input is not supported; use repeatable key=value flags',
    );
  });
});

describe('parseCommaSeparatedList', () => {
  it('returns undefined when no items are provided', () => {
    expect(parseCommaSeparatedList(undefined)).toBeUndefined();
    expect(parseCommaSeparatedList('')).toBeUndefined();
    expect(parseCommaSeparatedList(' , ')).toBeUndefined();
  });

  it('splits, trims, and removes empty items', () => {
    expect(
      parseCommaSeparatedList('techdocs, software-catalog, ,templates'),
    ).toEqual(['techdocs', 'software-catalog', 'templates']);
  });

  it('rejects JSON array input', () => {
    expect(() => parseCommaSeparatedList('["techdocs"]')).toThrow(
      'JSON list input is not supported; use comma-separated values',
    );
  });
});
