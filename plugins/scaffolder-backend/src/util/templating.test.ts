/*
 * Copyright 2024 The Backstage Authors
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
  TemplateFilter,
  CreatedTemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import { createTemplateFilter } from '@backstage/plugin-scaffolder-node';
import {
  templateFilterImpls,
  templateFilterMetadata,
  templateGlobalFunctionMetadata,
  templateGlobals,
  templateGlobalValueMetadata,
} from './templating';
import { JsonValue } from '@backstage/types';

describe('templating utilities', () => {
  describe('api filters', () => {
    const filters = [
      createTemplateFilter({
        id: 'nop',
        description: 'nop',
        filter: (x: JsonValue) => x,
      }),
      createTemplateFilter({
        id: 'nul',
        filter: (_: JsonValue) => null,
      }),
    ];
    it('extracts filter implementations', () => {
      const impls = templateFilterImpls(filters);
      expect(impls).toHaveProperty('nop');
      expect(impls.nop(42)).toBe(42);
      expect(impls).toHaveProperty('nul');
      expect(impls.nul('anything')).toBeNull();
    });
    it('extracts filter metadata', () => {
      const metadata = templateFilterMetadata(filters);
      expect(metadata).toHaveProperty('nop');
      expect(metadata.nop).toHaveProperty('description');
      expect(metadata.nop.description).toBe('nop');
      expect(metadata).toHaveProperty('nul');
      expect(Object.keys(metadata.nul)).toHaveLength(0);
    });
  });
  describe('legacy filters', () => {
    const filters = {
      nop: x => x,
      nul: _ => null,
    } as Record<string, TemplateFilter>;
    it('extracts filter implementations', () => {
      const impls = templateFilterImpls(filters);
      expect(impls).toHaveProperty('nop');
      expect(impls.nop(42)).toBe(42);
      expect(impls).toHaveProperty('nul');
      expect(impls.nul('anything')).toBeNull();
    });
    it('extracts filter metadata', () => {
      const metadata = templateFilterMetadata(filters);
      expect(metadata).toHaveProperty('nop');
      expect(Object.keys(metadata.nop)).toHaveLength(0);
      expect(metadata).toHaveProperty('nul');
      expect(Object.keys(metadata.nul)).toHaveLength(0);
    });
  });

  const documentedGlobals: CreatedTemplateGlobal[] = [
    {
      id: 'foo',
      description: 'foo something',
      fn: (x: any) => `${x}_FOO`,
    },
    {
      id: 'bar',
      description: 'bar value',
      value: 'bar',
    },
  ];
  it('extracts global function metadata', () => {
    const metadata = templateGlobalFunctionMetadata(documentedGlobals);
    expect(metadata).toHaveProperty('foo');
    expect(metadata.foo).toHaveProperty('description', 'foo something');
    expect(metadata).not.toHaveProperty('bar');
  });
  it('extracts global value metadata', () => {
    const metadata = templateGlobalValueMetadata(documentedGlobals);
    expect(metadata).not.toHaveProperty('foo');
    expect(metadata).toHaveProperty('bar');
    expect(metadata.bar).toHaveProperty('description', 'bar value');
  });
  const globals = templateGlobals(documentedGlobals);
  it('extracts documented globals', () => {
    expect(globals).toHaveProperty('foo');
    expect((globals.foo as (x: any) => string)('something')).toBe(
      'something_FOO',
    );
    expect(globals).toHaveProperty('bar', 'bar');
  });
  it('extracts backward-compatible/undocumented globals', () => {
    expect(templateGlobals(globals)).toBe(globals);
  });
});
