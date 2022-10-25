/*
 * Copyright 2022 The Backstage Authors
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

import { OpenAPIV3_1, OpenAPIV3, OpenAPIV2 } from 'openapi-types';
import { OpenAPISpecParser } from './OpenAPISpecParser';
import { expect, jest } from '@jest/globals';
import { readFileSync } from 'fs';
import * as path from 'path';
import { parse } from 'yaml';

describe('OpenAPISpecParser', () => {
  const parser = new OpenAPISpecParser();

  const v3Spec = readFileSync(
    path.resolve(__dirname, './test_specs/petstore_v3.yml'),
    'utf-8',
  );
  const v3Document: OpenAPIV3.Document = parse(v3Spec);

  const v31Spec = readFileSync(
    path.resolve(__dirname, './test_specs/petstore_v31.yml'),
    'utf-8',
  );
  const v31Document: OpenAPIV3_1.Document = parse(v31Spec);

  const v2Spec = readFileSync(
    path.resolve(__dirname, './test_specs/petstore_v2.yml'),
    'utf-8',
  );
  const v2Document: OpenAPIV2.Document = parse(v2Spec);

  it('has expected type', () => {
    expect(parser.specType).toBe('openapi');
  });

  describe('getSpecText', () => {
    it('detects 2.0 spec version', () => {
      jest.spyOn(parser, 'parseSpec');
      parser.getSpecText(v2Spec);
      expect(parser.parseSpec).toBeCalledWith(expect.anything(), '2.0');
    });

    it('detects 3.0 spec version', () => {
      jest.spyOn(parser, 'parseSpec');
      parser.getSpecText(v3Spec);
      expect(parser.parseSpec).toBeCalledWith(expect.anything(), '3.0.0');
    });

    it('detects 3.1 spec version', () => {
      jest.spyOn(parser, 'parseSpec');
      parser.getSpecText(v31Spec);
      expect(parser.parseSpec).toBeCalledWith(expect.anything(), '3.1.0');
    });
  });

  describe('getSpecVersionText', () => {
    it('3.0.0 routes to version 3.0.0 Handler', () => {
      jest.spyOn(parser, 'getV3SpecText');
      parser.getSpecVersionText(v3Document, '3.0.0');
      expect(parser.getV3SpecText).toHaveBeenCalledWith(v3Document);
    });

    it('3.1.0 routes to version 3.0.0 Handler', () => {
      jest.spyOn(parser, 'getV3SpecText');
      parser.getSpecVersionText(v31Document, '3.1.0');
      expect(parser.getV3SpecText).toHaveBeenCalledWith(v31Document);
    });

    it('routes to version 2.0.0', () => {
      jest.spyOn(parser, 'getV2SpecText');
      parser.parseSpec(v2Document, '2.0');
      expect(parser.getV2SpecText).toHaveBeenCalledWith(v2Document);
    });
  });

  describe('getV2SpecText', () => {
    it('returns expected Parser Text', () => {
      const indexableStringArray = parser
        .getV2SpecText(v2Document as OpenAPIV2.Document)
        .filter(x => x);
      expect(indexableStringArray.length).toEqual(12);
    });
  });

  describe('getV3SpecText', () => {
    it('returns expected Parser Text', () => {
      const indexableStringArray = parser
        .getV3SpecText(v3Document as OpenAPIV3.Document)
        .filter(x => x);
      expect(indexableStringArray.length).toEqual(14);
    });
  });
});
