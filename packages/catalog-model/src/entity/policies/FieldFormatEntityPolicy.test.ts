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

import yaml from 'yaml';
import { FieldFormatEntityPolicy } from './FieldFormatEntityPolicy';

describe('FieldFormatEntityPolicy', () => {
  let data: any;
  let policy: FieldFormatEntityPolicy;

  beforeEach(() => {
    data = yaml.parse(`
      apiVersion: backstage.io/v1alpha1
      kind: Component
      metadata:
        uid: e01199ab-08cc-44c2-8e19-5c29ded82521
        etag: lsndfkjsndfkjnsdfkjnsd==
        generation: 13
        name: my-component-yay
        namespace: the-namespace
        labels:
          backstage.io/custom: ValueStuff
        annotations:
          example.com/bindings: are-secret
        tags:
          - java
          - data-service
      spec:
        custom: stuff
    `);
    policy = new FieldFormatEntityPolicy();
  });

  it('works for the happy path', async () => {
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects bad apiVersion', async () => {
    data.apiVersion = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/apiVersion/);
    data.apiVersion = 'a#b';
    await expect(policy.enforce(data)).rejects.toThrow(/apiVersion/);
  });

  it('rejects bad kind', async () => {
    data.kind = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/kind/);
    data.kind = 'a#b';
    await expect(policy.enforce(data)).rejects.toThrow(/kind/);
  });

  it('handles missing metadata gracefully', async () => {
    delete data.medatata;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('handles missing spec gracefully', async () => {
    delete data.spec;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects bad name', async () => {
    data.metadata.name = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/name.*7/);
    data.metadata.name = 'a'.repeat(1000);
    await expect(policy.enforce(data)).rejects.toThrow(/name.*aaaa/);
  });

  it('rejects bad namespace', async () => {
    data.metadata.namespace = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/namespace.*7/);
    data.metadata.namespace = 'a'.repeat(1000);
    await expect(policy.enforce(data)).rejects.toThrow(/namespace.*aaaa/);
  });

  it('rejects bad label key', async () => {
    data.metadata.labels['a#b'] = 'value';
    await expect(policy.enforce(data)).rejects.toThrow(/label.*a#b/i);
  });

  it('rejects bad label value', async () => {
    data.metadata.labels.a = 'a#b';
    await expect(policy.enforce(data)).rejects.toThrow(/label.*a#b/i);
  });

  it('rejects bad annotation key', async () => {
    data.metadata.annotations['a#b'] = 'value';
    await expect(policy.enforce(data)).rejects.toThrow(/annotation.*a#b/i);
  });

  it('rejects bad annotation value', async () => {
    data.metadata.annotations.a = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/annotation.*7/i);
  });

  it('rejects bad tag value', async () => {
    data.metadata.tags.push('Hello World');
    await expect(policy.enforce(data)).rejects.toThrow(/tags.*"Hello World"/i);
  });
});
