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

describe('module loading', () => {
  it('does not compile any schemas when the package is imported', () => {
    const cfworker = jest.fn();
    const ajv = jest.fn();

    jest.isolateModules(() => {
      jest.doMock('@cfworker/json-schema', () => {
        const actual = jest.requireActual('@cfworker/json-schema');
        return {
          ...actual,
          Validator: class extends actual.Validator {
            constructor(...args: any[]) {
              cfworker();
              super(...args);
            }
          },
        };
      });
      jest.doMock('ajv', () => {
        const actual = jest.requireActual('ajv');
        return {
          ...actual,
          __esModule: true,
          default: class extends actual.default {
            constructor(...args: any[]) {
              ajv();
              super(...args);
            }
          },
        };
      });

      require('./index');
      require('./alpha');
      require('./ajv');

      expect(cfworker).not.toHaveBeenCalled();
      expect(ajv).not.toHaveBeenCalled();

      // Make sure that the mocks are effective
      const {
        compileCatalogModel,
        defaultCatalogEntityModel,
      } = require('./alpha');
      compileCatalogModel([defaultCatalogEntityModel]);
      expect(cfworker).toHaveBeenCalled();
      require('./ajv').createAjvEntityValidators().entitySchemaValidator();
      expect(ajv).toHaveBeenCalled();
    });
  });
});
