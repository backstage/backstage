/*
 * Copyright 2020 The Backstage Authors
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

import { parseEntityYaml } from './parse';
import { processingResult } from '@backstage/plugin-catalog-node';

const testLoc = {
  target: 'my-loc-target',
  type: 'my-loc-type',
};

describe('parseEntityYaml', () => {
  it('should parse a yaml', () => {
    const results = Array.from(
      parseEntityYaml(
        Buffer.from(
          `
      apiVersion: backstage.io/v1alpha1
      kind: Component
      metadata:
        name: backstage
        description: backstage.io
        annotations:
          github.com/project-slug: 'backstage/backstage'
      spec:
        type: website
        lifecycle: production
        owner: user:guest
    `,
          'utf8',
        ),
        testLoc,
      ),
    );

    expect(results).toEqual([
      processingResult.entity(testLoc, {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'backstage',
          description: 'backstage.io',
          annotations: {
            'github.com/project-slug': 'backstage/backstage',
          },
        },
        spec: {
          type: 'website',
          lifecycle: 'production',
          owner: 'user:guest',
        },
      }),
    ]);
  });

  it('should parse multiple docs', () => {
    const results = Array.from(
      parseEntityYaml(
        Buffer.from(
          `
      apiVersion: backstage.io/v1alpha1
      kind: Component
      metadata:
        name: web
      spec:
        type: website
---
      apiVersion: backstage.io/v1alpha1
      kind: Component
      metadata:
        name: srv
      spec:
        type: service
    `,
          'utf8',
        ),
        testLoc,
      ),
    );

    expect(results).toEqual([
      processingResult.entity(testLoc, {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'web',
        },
        spec: {
          type: 'website',
        },
      }),
      processingResult.entity(testLoc, {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'srv',
        },
        spec: {
          type: 'service',
        },
      }),
    ]);
  });

  it('should handle empty yaml documents', () => {
    // This happens if the user accidentally adds a "---"
    // at the end of a file
    const results = Array.from(
      parseEntityYaml(
        Buffer.from(
          `
      apiVersion: backstage.io/v1alpha1
      kind: Component
      metadata:
        name: web
      spec:
        type: website
---
    `,
          'utf8',
        ),
        testLoc,
      ),
    );

    expect(results).toEqual([
      processingResult.entity(testLoc, {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'web',
        },
        spec: {
          type: 'website',
        },
      }),
    ]);
  });

  it('should emit parsing errors', () => {
    const results = Array.from(
      parseEntityYaml(Buffer.from('`', 'utf8'), testLoc),
    );

    // Parse errors are always per document
    expect(results.length).toBe(1);
    expect(results[0]).toEqual({
      type: 'error',
      location: testLoc,
      error: expect.objectContaining({
        message: expect.stringMatching(
          /YAML error at my-loc-type:my-loc-target, YAMLParseError: Plain value cannot start with reserved character ` at line 1, column 1:/,
        ),
      }),
    });
  });

  it('should emit parsing errors for individual documents', () => {
    const results = Array.from(
      parseEntityYaml(
        Buffer.from(
          `
      apiVersion: backstage.io/v1alpha1
      kind: Component
      metadata:
        name: web
      spec:
        type: website
---
      apiVersion: backstage.io/v1alpha1
        this: - is - not [valid] yaml
      `,
          'utf8',
        ),
        testLoc,
      ),
    );

    expect(results.length).toBe(2);
    expect(results[0]).toEqual(
      processingResult.entity(testLoc, {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'web',
        },
        spec: {
          type: 'website',
        },
      }),
    );
    expect(results[1]).toEqual({
      type: 'error',
      location: testLoc,
      error: expect.objectContaining({
        message: expect.stringMatching(
          /YAML error at my-loc-type:my-loc-target, YAMLParseError: Nested mappings are not allowed in compact mappings at line 9, column 19:\s+apiVersion: backstage.io\/v1alpha1/,
        ),
      }),
    });
  });

  it('must be an object at root', () => {
    const results = Array.from(
      parseEntityYaml(Buffer.from('i-am-a-string', 'utf8'), testLoc),
    );

    expect(results).toEqual([
      processingResult.generalError(
        testLoc,
        'Expected object at root, got string',
      ),
    ]);
  });
});
