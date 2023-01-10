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
import { OpenAPISpecParser } from './OpenAPISpecParser';
import { readFileSync } from 'fs';
import * as path from 'path';

describe('OpenAPISpecParser', () => {
  const parser = new OpenAPISpecParser();

  const v3Spec = readFileSync(
    path.resolve(__dirname, './test_specs/petstore_v3.yml'),
    'utf-8',
  );

  const v31Spec = readFileSync(
    path.resolve(__dirname, './test_specs/petstore_v31.yml'),
    'utf-8',
  );

  const v2Spec = readFileSync(
    path.resolve(__dirname, './test_specs/petstore_v2.yml'),
    'utf-8',
  );

  it('has expected type', () => {
    expect(parser.specType).toBe('openapi');
  });

  describe('getSpecText', () => {
    it('detects 2.0 spec version', () => {
      const parseSpecSpy = jest.spyOn(
        OpenAPISpecParser.prototype as any,
        'parseSpec',
      );
      const indexableContent = parser.getSpecText(v2Spec);
      expect(parseSpecSpy).toHaveBeenCalledWith(expect.anything(), '2.0');
      expect(indexableContent.length).toBe(511);
    });

    it('detects 3.0 spec version', () => {
      const parseSpecSpy = jest.spyOn(
        OpenAPISpecParser.prototype as any,
        'parseSpec',
      );
      const indexableContent = parser.getSpecText(v3Spec);
      expect(parseSpecSpy).toHaveBeenCalledWith(expect.anything(), '3.0.0');
      expect(indexableContent.length).toBe(1989);
    });

    it('detects 3.1 spec version', () => {
      const parseSpecSpy = jest.spyOn(
        OpenAPISpecParser.prototype as any,
        'parseSpec',
      );
      const indexableContent = parser.getSpecText(v31Spec);
      expect(parseSpecSpy).toHaveBeenCalledWith(expect.anything(), '3.1.0');
      expect(indexableContent.length).toBe(1989);
    });
  });
});
