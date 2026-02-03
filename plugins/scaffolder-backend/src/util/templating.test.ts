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
import {
  TemplateFilter,
  CreatedTemplateGlobal,
  createTemplateFilter,
  createTemplateGlobalFunction,
  createTemplateGlobalValue,
} from '@backstage/plugin-scaffolder-node/alpha';
import {
  convertFiltersToRecord,
  extractFilterMetadata,
  extractGlobalFunctionMetadata,
  convertGlobalsToRecord,
  extractGlobalValueMetadata,
} from './templating';
import { JsonValue } from '@backstage/types';
import { createDefaultFilters } from '../lib/templating/filters/createDefaultFilters';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';

describe('templating utilities', () => {
  describe('built-in filters', () => {
    const integrations = ScmIntegrations.fromConfig(new ConfigReader({}));
    const filters = createDefaultFilters({ integrations });
    it('generates equivalent filter metadata', () => {
      const metadata = extractFilterMetadata(filters);
      expect(metadata).toMatchObject(extractFilterMetadata(filters));
    });
  });
  describe('api filters', () => {
    const filters = [
      createTemplateFilter({
        id: 'nop',
        description: 'nop',
        schema: z => z.function().args(z.any()).returns(z.any()),
        filter: (x: JsonValue) => x,
      }),
      createTemplateFilter({
        id: 'nul',
        filter: (_: JsonValue) => null,
      }),
      createTemplateFilter({
        id: 'repeat',
        schema: z =>
          z
            .function()
            .args(
              z.string().describe('input'),
              z.number().describe('times'),
              z.string().describe('separator').optional(),
            )
            .returns(z.string()),
        filter: (input, times, separator) =>
          Array(times)
            .fill(input)
            .join(separator ?? ''),
      }),
    ];
    it('extracts filter implementations', () => {
      const impls = convertFiltersToRecord(filters);
      expect(impls).toHaveProperty('nop');
      expect(impls.nop(42)).toBe(42);
      expect(impls).toHaveProperty('nul');
      expect(impls.nul('anything')).toBeNull();
      expect(impls).toHaveProperty('repeat');
      expect(impls.repeat('foo', 3)).toBe('foofoofoo');
      expect(impls.repeat('foo', 3, '-')).toBe('foo-foo-foo');
    });
    it('extracts filter metadata', () => {
      const metadata = extractFilterMetadata(filters);
      expect(metadata).toHaveProperty('nop');
      expect(metadata.nop).toHaveProperty('description', 'nop');
      expect(metadata.nop).toHaveProperty(
        'schema',
        expect.objectContaining({
          input: expect.not.objectContaining({ type: expect.anything() }),
          output: expect.not.objectContaining({ type: expect.anything() }),
        }),
      );
      expect(metadata.nop.schema).not.toHaveProperty('arguments');
      expect(metadata).toHaveProperty('nul', {});
      expect(metadata).toHaveProperty('repeat');
      expect(metadata.repeat).not.toHaveProperty('description');
      expect(metadata.repeat).toHaveProperty(
        'schema',
        expect.objectContaining({
          input: expect.objectContaining({ type: 'string' }),
          arguments: expect.arrayContaining([
            expect.objectContaining({
              type: 'number',
            }),
            expect.objectContaining({
              anyOf: expect.arrayContaining([
                expect.objectContaining({ not: {} }),
                expect.objectContaining({ type: 'string' }),
              ]),
            }),
          ]),
          output: expect.objectContaining({ type: 'string' }),
        }),
      );
    });
  });
  describe('legacy filters', () => {
    const filters = {
      nop: x => x,
      nul: _ => null,
    } as Record<string, TemplateFilter>;
    it('extracts filter implementations', () => {
      const impls = convertFiltersToRecord(filters);
      expect(impls).toHaveProperty('nop');
      expect(impls.nop(42)).toBe(42);
      expect(impls).toHaveProperty('nul');
      expect(impls.nul('anything')).toBeNull();
    });
    it('extracts filter metadata', () => {
      const metadata = extractFilterMetadata(filters);
      expect(metadata).toHaveProperty('nop', {});
      expect(metadata).toHaveProperty('nul', {});
    });
  });

  const documentedGlobals: CreatedTemplateGlobal[] = [
    createTemplateGlobalFunction({
      id: 'foo',
      description: 'foo something',
      fn: (x: any) => `${x}_FOO`,
    }),
    createTemplateGlobalValue({
      id: 'bar',
      description: 'bar value',
      value: 'bar',
    }),
    createTemplateGlobalFunction({
      id: 'respond',
      schema: z =>
        z.function().args(z.string().describe('prompt')).returns(z.string()),
      fn: prompt =>
        prompt === 'knock knock' ? "who's there?" : "nobody's home",
    }),
  ];
  it('extracts global function metadata', () => {
    const metadata = extractGlobalFunctionMetadata(documentedGlobals);
    expect(metadata).toHaveProperty('foo');
    expect(metadata.foo).toHaveProperty('description', 'foo something');
    expect(metadata).not.toHaveProperty('bar');
    expect(metadata).toHaveProperty(
      'respond',
      expect.objectContaining({
        schema: expect.objectContaining({
          arguments: expect.arrayContaining([
            expect.objectContaining({ type: 'string' }),
          ]),
          output: expect.objectContaining({ type: 'string' }),
        }),
      }),
    );
  });
  it('extracts global value metadata', () => {
    const metadata = extractGlobalValueMetadata(documentedGlobals);
    expect(metadata).not.toHaveProperty('foo');
    expect(metadata).toHaveProperty('bar');
    expect(metadata.bar).toHaveProperty('description', 'bar value');
    expect(metadata).not.toHaveProperty('respond');
  });
  const globals = convertGlobalsToRecord(documentedGlobals);
  it('extracts documented globals', () => {
    expect(globals).toHaveProperty('foo');
    expect((globals.foo as (x: any) => string)('something')).toBe(
      'something_FOO',
    );
    expect(globals).toHaveProperty('bar', 'bar');
    expect(globals).toHaveProperty('respond');
    expect(typeof globals.respond).toBe('function');
    expect((globals.respond as Function)('knock knock')).toBe("who's there?");
  });
  it('extracts backward-compatible/undocumented globals', () => {
    expect(convertGlobalsToRecord(globals)).toBe(globals);
  });
});
