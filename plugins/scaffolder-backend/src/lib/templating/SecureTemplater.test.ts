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

import { SecureTemplater } from './SecureTemplater';

describe('SecureTemplater', () => {
  it('should render some templates', async () => {
    const templater = new SecureTemplater();
    await expect(
      templater.render('${{ test }}', { test: 'my-value' }),
    ).resolves.toBe('my-value');

    await expect(
      templater.render('${{ test | dump }}', { test: 'my-value' }),
    ).resolves.toBe('"my-value"');

    await expect(
      templater.render('${{ test | replace("my-", "our-") }}', {
        test: 'my-value',
      }),
    ).resolves.toBe('our-value');

    await expect(
      templater.render('${{ invalid...syntax }}', {
        test: 'my-value',
      }),
    ).rejects.toThrow(
      '(unknown path) [Line 1, Column 13]\n  expected name as lookup value, got .',
    );
  });
});
