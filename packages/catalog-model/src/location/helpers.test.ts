/*
 * Copyright 2021 The Backstage Authors
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
  getEntitySourceLocation,
  parseLocationRef,
  stringifyLocationRef,
} from './helpers';

describe('parseLocationRef', () => {
  it('works for the simple case', () => {
    expect(parseLocationRef('url:https://www.google.com')).toEqual({
      type: 'url',
      target: 'https://www.google.com',
    });
  });

  it('rejects faulty inputs', () => {
    expect(() => parseLocationRef(7 as any)).toThrow(
      "Unable to parse location ref '7', unexpected argument number",
    );
    expect(() => parseLocationRef('')).toThrow(
      "Unable to parse location ref '', expected '<type>:<target>', e.g. 'url:https://host/path'",
    );
    expect(() => parseLocationRef('hello')).toThrow(
      "Unable to parse location ref 'hello', expected '<type>:<target>', e.g. 'url:https://host/path'",
    );
    expect(() => parseLocationRef(':hello')).toThrow(
      "Unable to parse location ref ':hello', expected '<type>:<target>', e.g. 'url:https://host/path'",
    );
    expect(() => parseLocationRef('hello:')).toThrow(
      "Unable to parse location ref 'hello:', expected '<type>:<target>', e.g. 'url:https://host/path'",
    );
    expect(() => parseLocationRef('http://blah')).toThrow(
      "Invalid location ref 'http://blah', please prefix it with 'url:', e.g. 'url:http://blah'",
    );
    expect(() => parseLocationRef('https://bleh')).toThrow(
      "Invalid location ref 'https://bleh', please prefix it with 'url:', e.g. 'url:https://bleh'",
    );
  });
});

describe('stringifyLocationRef', () => {
  it('works for the simple case', () => {
    expect(
      stringifyLocationRef({
        type: 'url',
        target: 'https://www.google.com',
      }),
    ).toEqual('url:https://www.google.com');
  });

  it('rejects faulty inputs', () => {
    expect(() => stringifyLocationRef({ type: '', target: 'hello' })).toThrow(
      'Unable to stringify location ref, empty type',
    );
    expect(() => stringifyLocationRef({ type: 'hello', target: '' })).toThrow(
      'Unable to stringify location ref, empty target',
    );
  });
});

describe('getEntitySourceLocation', () => {
  it('returns the source-location', () => {
    expect(
      getEntitySourceLocation({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Location',
        metadata: {
          name: 'test',
          namespace: 'default',
          annotations: {
            'backstage.io/source-location': 'url:https://backstage.io/foo.yaml',
            'backstage.io/managed-by-location': 'url:https://spotify.com',
          },
        },
      }),
    ).toEqual({ target: 'https://backstage.io/foo.yaml', type: 'url' });
  });

  it('returns the managed-by-location', () => {
    expect(
      getEntitySourceLocation({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Location',
        metadata: {
          name: 'test',
          namespace: 'default',
          annotations: {
            'backstage.io/managed-by-location': 'url:https://spotify.com',
          },
        },
      }),
    ).toEqual({ target: 'https://spotify.com', type: 'url' });
  });

  it('rejects missing location annotation', () => {
    expect(() =>
      getEntitySourceLocation({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Location',
        metadata: { name: 'test', namespace: 'default' },
      }),
    ).toThrow(`Entity 'location:default/test' is missing location`);
  });
});
