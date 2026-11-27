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

describe('default extensions', () => {
  it.each(['./components', './AppThemeApi', './IconsApi'])(
    '%s does not load Material UI or core-components until rendered',
    path => {
      jest.isolateModules(() => {
        jest.doMock('@backstage/core-components', () => {
          throw new Error('core-components was loaded eagerly');
        });
        jest.doMock('@material-ui/core/Button', () => {
          throw new Error('Material UI was loaded eagerly');
        });
        jest.doMock('@material-ui/icons/WbSunny', () => {
          throw new Error('Material UI icons were loaded eagerly');
        });
        jest.doMock('@material-ui/icons/Brightness2', () => {
          throw new Error('Material UI icons were loaded eagerly');
        });
        jest.doMock(
          '../../../../packages/app-defaults/src/defaults/icons',
          () => {
            throw new Error('default icons were loaded eagerly');
          },
        );

        expect(() => require(path)).not.toThrow();
      });
    },
  );

  it('lists every shared default icon', () => {
    jest.resetModules();
    jest.dontMock('../../../../packages/app-defaults/src/defaults/icons');
    const { defaultIconKeys } = require('./IconsApi');
    const {
      icons,
      // eslint-disable-next-line @backstage/no-relative-monorepo-imports
    } = require('../../../../packages/app-defaults/src/defaults/icons');
    expect(defaultIconKeys).toEqual(Object.keys(icons));
  });
});
