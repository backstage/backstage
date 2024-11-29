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
import { resolvePackageName } from './util';

describe('resolvePackageName', () => {
  it('should generate correct name without scope', () => {
    expect(resolvePackageName({ baseName: 'test', plugin: true })).toEqual(
      'backstage-plugin-test',
    );
    expect(resolvePackageName({ baseName: 'test', plugin: false })).toEqual(
      'test',
    );
  });

  it('should generate correct name for backstage scope', () => {
    expect(
      resolvePackageName({
        baseName: 'test',
        scope: 'backstage',
        plugin: true,
      }),
    ).toEqual('@backstage/plugin-test');
    expect(
      resolvePackageName({
        baseName: 'test',
        scope: 'backstage',
        plugin: false,
      }),
    ).toEqual('@backstage/test');
  });

  it('should generate correct name for custom scope', () => {
    expect(
      resolvePackageName({
        baseName: 'test',
        scope: 'custom',
        plugin: true,
      }),
    ).toEqual('@custom/backstage-plugin-test');
    expect(
      resolvePackageName({
        baseName: 'test',
        scope: 'custom',
        plugin: false,
      }),
    ).toEqual('@custom/test');
  });

  it('should generate correct name for custom scope and custom prefix', () => {
    expect(
      resolvePackageName({
        baseName: 'test',
        scope: 'custom/myapp.',
        plugin: true,
      }),
    ).toEqual('@custom/myapp.backstage-plugin-test');
    expect(
      resolvePackageName({
        baseName: 'test',
        scope: 'custom/myapp.',
        plugin: false,
      }),
    ).toEqual('@custom/myapp.test');
  });
});
