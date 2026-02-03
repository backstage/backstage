/*
 * Copyright 2023 The Backstage Authors
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

import { createSchemaFromZod } from './createSchemaFromZod';

describe('createSchemaFromZod', () => {
  it('should provide nice parse errors', () => {
    const { parse } = createSchemaFromZod(z =>
      z.object({
        foo: z.union([z.string(), z.number()]),
        derp: z.object({ bar: z.number() }),
      }),
    );

    expect(() => {
      // @ts-expect-error
      return parse({ derp: { bar: 'derp' } });
    }).toThrow(
      `Missing required value at 'foo'; Expected number, received string at 'derp.bar'`,
    );
    expect(() => {
      // @ts-expect-error
      return parse(undefined);
    }).toThrow(`Missing required value`);
    expect(() => {
      // @ts-expect-error
      return parse('derp');
    }).toThrow(`Expected object, received string`);
  });
});
