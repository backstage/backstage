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
import { makeValidator } from '../../validation';
import { DescriptorEnvelopeParser } from './DescriptorEnvelopeParser';

describe('DescriptorEnvelopeParser', () => {
  let data: any;
  let parser: DescriptorEnvelopeParser;

  beforeEach(() => {
    data = yaml.parse(`
      apiVersion: backstage.io/v1beta1
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
      spec:
        custom: stuff
    `);
    parser = new DescriptorEnvelopeParser(makeValidator());
  });

  it('works for the happy path', async () => {
    await expect(parser.parse(data)).resolves.toBe(data);
  });

  it('rejects missing apiVersion', async () => {
    delete data.apiVersion;
    await expect(parser.parse(data)).rejects.toThrow(/apiVersion/);
  });

  it('rejects wrong root type', async () => {
    await expect(parser.parse(7)).rejects.toThrow(/object/);
  });

  it('rejects bad apiVersion', async () => {
    data.apiVersion = 'a#b';
    await expect(parser.parse(data)).rejects.toThrow(/apiVersion/);
  });

  it('rejects missing kind', async () => {
    delete data.kind;
    await expect(parser.parse(data)).rejects.toThrow(/kind/);
  });

  it('rejects bad kind', async () => {
    data.kind = 'a#b';
    await expect(parser.parse(data)).rejects.toThrow(/kind/);
  });

  it('accepts missing metadata', async () => {
    delete data.medatata;
    await expect(parser.parse(data)).resolves.toBe(data);
  });

  it('rejects non-object metadata', async () => {
    data.metadata = 7;
    await expect(parser.parse(data)).rejects.toThrow(/metadata/);
  });

  it('accepts missing uid', async () => {
    delete data.metadata.uid;
    await expect(parser.parse(data)).resolves.toBe(data);
  });

  it('rejects bad uid', async () => {
    data.metadata.uid = 7;
    await expect(parser.parse(data)).rejects.toThrow(/uid/);
  });

  it('accepts missing etag', async () => {
    delete data.metadata.etag;
    await expect(parser.parse(data)).resolves.toBe(data);
  });

  it('rejects bad etag', async () => {
    data.metadata.etag = 7;
    await expect(parser.parse(data)).rejects.toThrow(/etag/);
  });

  it('accepts missing generation', async () => {
    delete data.metadata.generation;
    await expect(parser.parse(data)).resolves.toBe(data);
  });

  it('rejects bad generation', async () => {
    data.metadata.generation = 'a';
    await expect(parser.parse(data)).rejects.toThrow(/generation/);
  });

  it('accepts missing spec', async () => {
    delete data.spec;
    await expect(parser.parse(data)).resolves.toBe(data);
  });

  it('rejects non-object spec', async () => {
    data.spec = 7;
    await expect(parser.parse(data)).rejects.toThrow(/spec/);
  });

  it('rejects bad name', async () => {
    data.metadata.name = 7;
    await expect(parser.parse(data)).rejects.toThrow(/name/);
  });

  it('rejects bad namespace', async () => {
    data.metadata.namespace = 7;
    await expect(parser.parse(data)).rejects.toThrow(/namespace/);
  });

  it('rejects bad label key', async () => {
    data.metadata.labels['a#b'] = 'value';
    await expect(parser.parse(data)).rejects.toThrow(/label.*key/i);
  });

  it('rejects bad label value', async () => {
    data.metadata.labels.a = 'a#b';
    await expect(parser.parse(data)).rejects.toThrow(/label.*value/i);
  });

  it('rejects bad annotation key', async () => {
    data.metadata.annotations['a#b'] = 'value';
    await expect(parser.parse(data)).rejects.toThrow(/annotation.*key/i);
  });

  it('rejects bad annotation value', async () => {
    data.metadata.annotations.a = [];
    await expect(parser.parse(data)).rejects.toThrow(/annotation.*value/i);
  });

  it('rejects unknown root keys', async () => {
    data.spec2 = {};
    await expect(parser.parse(data)).rejects.toThrow(/spec2/i);
  });

  it('rejects reserved keys in the spec root', async () => {
    data.spec.apiVersion = 'a/b';
    await expect(parser.parse(data)).rejects.toThrow(/spec.*apiVersion/i);
  });

  it('rejects reserved keys in labels', async () => {
    data.metadata.labels.apiVersion = 'a';
    await expect(parser.parse(data)).rejects.toThrow(/label.*apiVersion/i);
  });

  it('rejects reserved keys in annotations', async () => {
    data.metadata.annotations.apiVersion = 'a';
    await expect(parser.parse(data)).rejects.toThrow(/annotation.*apiVersion/i);
  });
});
