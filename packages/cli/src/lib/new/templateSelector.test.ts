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
import { readCliConfig, verifyTemplate } from './templateSelector';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('verifyTemplate', () => {
  it('throws an error if template target is a remote URL', () => {
    expect(() => verifyTemplate({ id: '', target: 'http' })).toThrow(
      'Remote templates are not supported yet',
    );
  });

  it('throws an error if template yaml file does not exist', () => {
    expect(() => verifyTemplate({ id: '', target: '/foo' })).toThrow(
      'Your CLI template does not exist: /foo',
    );
  });

  it('throws an error if the skeleton of the template does not exist', () => {
    const mockDir = createMockDirectory({
      content: { 'template.yaml': 'template: "foo"' },
    });
    expect(() =>
      verifyTemplate({ id: '', target: mockDir.resolve('template.yaml') }),
    ).toThrow();
  });

  it('throws an error if template is missing a targetPath', () => {
    const mockDir = createMockDirectory({
      content: { 'template.yaml': 'template: "foo"', foo: 'bar' },
    });
    expect(() =>
      verifyTemplate({ id: '', target: mockDir.resolve('template.yaml') }),
    ).toThrow();
  });
});
