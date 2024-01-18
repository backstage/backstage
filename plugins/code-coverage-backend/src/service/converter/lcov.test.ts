/*
 * Copyright 2021 The Backstage Authors
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
import fs from 'fs';
import path from 'path';
import { Lcov } from './lcov';
import { getVoidLogger } from '@backstage/backend-common';

describe('convert lcov', () => {
  const converter = new Lcov(getVoidLogger());
  [1, 2].forEach(idx => {
    const lcov = fs
      .readFileSync(
        path.resolve(`${__dirname}/../__fixtures__/lcov-testdata-${idx}.info`),
      )
      .toString();
    const expected = JSON.parse(
      fs
        .readFileSync(
          path.resolve(
            `${__dirname}/../__fixtures__/lcov-jsoncoverage-files-${idx}.json`,
          ),
        )
        .toString(),
    );
    const scmFiles = fs
      .readFileSync(
        path.resolve(
          `${__dirname}/../__fixtures__/lcov-sourcefiles-${idx}.txt`,
        ),
      )
      .toString()
      .split('\n');

    it(`should convert the lcov report with index ${idx} to json`, async () => {
      const files = converter.convert(lcov, scmFiles);

      expect(files).toEqual(expected);
    });
  });
});
