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

import { YamlProcessor } from './YamlProcessor';
import { Entity } from '@backstage/catalog-model';
import yaml from 'yaml';
import { TextEncoder } from 'util';
import {
  LocationProcessorEntityResult,
  LocationProcessorErrorResult,
} from './types';

describe('YamlProcessor', () => {
  const processor = new YamlProcessor();
  const locationSpec = {
    type: 'url',
    target: 'http://example.com/component.yaml',
  };

  function encodeEntity(entity: string): Buffer {
    const data = new TextEncoder().encode(entity);
    return Buffer.from(data);
  }

  it('should only process files with yaml', async () => {
    const wrongLocationSpec = {
      type: 'url',
      target: 'http://example.com/component.json',
    };

    const buffer = Buffer.from([]);
    const never = jest.fn();

    expect(await processor.parseData(buffer, wrongLocationSpec, never)).toBe(
      false,
    );

    expect(never).not.toBeCalled();
  });

  it('should process url that contains yaml', async () => {
    const containsYamlLocationSpec = {
      type: 'url',
      target: 'http://example.com/component?path=test.yaml&c=1&d=2',
    };

    const buffer = Buffer.from([]);
    const emit = jest.fn();

    expect(
      await processor.parseData(buffer, containsYamlLocationSpec, emit),
    ).toBe(true);

    expect(emit).toBeCalled();
  });

  it('should process entity with yaml', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'my-component',
      },
      spec: {},
    } as Entity;

    const buffer = encodeEntity(yaml.stringify(entity));
    const emit = jest.fn();

    expect(await processor.parseData(buffer, locationSpec, emit)).toBe(true);

    const e = emit.mock.calls[0][0] as LocationProcessorEntityResult;
    expect(e.type).toBe('entity');
    expect(e.location).toBe(locationSpec);
    expect(e.entity).toEqual(entity);
  });

  it('should process multiple entities with yaml', async () => {
    const entityComponent = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'my-component',
      },
      spec: {},
    } as Entity;

    const entityApi = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name: 'my-api',
      },
      spec: {},
    } as Entity;

    const buffer = encodeEntity(
      `${yaml.stringify(entityComponent)}---\n${yaml.stringify(entityApi)}`,
    );
    const emit = jest.fn();

    expect(await processor.parseData(buffer, locationSpec, emit)).toBe(true);

    const eComponent = emit.mock.calls[0][0] as LocationProcessorEntityResult;
    expect(eComponent.type).toBe('entity');
    expect(eComponent.location).toBe(locationSpec);
    expect(eComponent.entity).toEqual(entityComponent);

    const eApi = emit.mock.calls[1][0] as LocationProcessorEntityResult;
    expect(eApi.type).toBe('entity');
    expect(eApi.location).toBe(locationSpec);
    expect(eApi.entity).toEqual(entityApi);
  });

  it('should fail process entity on invalid yaml', async () => {
    const buffer = encodeEntity('{');
    const emit = jest.fn();

    expect(await processor.parseData(buffer, locationSpec, emit)).toBe(true);

    const e = emit.mock.calls[0][0] as LocationProcessorErrorResult;
    expect(e.error.message).toMatch(/^YAML error, /);
    expect(e.type).toBe('error');
    expect(e.location).toBe(locationSpec);
  });

  it('should fail process entity if not object at root', async () => {
    const buffer = encodeEntity('[]');
    const emit = jest.fn();

    expect(await processor.parseData(buffer, locationSpec, emit)).toBe(true);

    const e = emit.mock.calls[0][0] as LocationProcessorErrorResult;
    expect(e.error.message).toMatch(/^Expected object at root, got /);
    expect(e.type).toBe('error');
    expect(e.location).toBe(locationSpec);
  });
});
