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

describe.each(['beta', 'stable'])('react-router %s', rrVersion => {
  it('should return the correct value for the different version', () => {
    jest.isolateModules(() => {
      jest.doMock('react-router', () =>
        rrVersion === 'beta'
          ? jest.requireActual('react-router-beta')
          : jest.requireActual('react-router-stable'),
      );
      jest.doMock('react-router-dom', () =>
        rrVersion === 'beta'
          ? jest.requireActual('react-router-dom-beta')
          : jest.requireActual('react-router-dom-stable'),
      );

      const { isReactRouterBeta } = require('./isReactRouterBeta');
      expect(isReactRouterBeta()).toBe(rrVersion === 'beta');
    });
  });
});

// eslint-disable-next-line jest/no-export
export {};
