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

describe('catalog alpha entry point', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('does not load the entity page implementation until its loader runs', () => {
    jest.doMock('../components/CatalogEntityPage/useEntityFromUrl', () => {
      throw new Error('entity page implementation was loaded eagerly');
    });

    jest.isolateModules(() => {
      expect(() => require('./plugin')).not.toThrow();
    });
  });

  it('does not load the catalog overview page until its loader runs', () => {
    jest.doMock('./components/CatalogOverviewPage', () => {
      throw new Error('catalog overview page was loaded eagerly');
    });

    jest.isolateModules(() => {
      expect(() => require('./plugin')).not.toThrow();
    });
  });

  it('does not load the About card to provide the source icon link', () => {
    jest.doMock('../components/AboutCard/AboutCard', () => {
      throw new Error('AboutCard was loaded eagerly');
    });

    jest.isolateModules(() => {
      expect(() => require('./plugin')).not.toThrow();
    });
  });
});
