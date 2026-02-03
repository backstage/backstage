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

import { PropsWithChildren } from 'react';
import { createPlugin } from '@backstage/core-plugin-api';
import { wrapInTestApp } from '@backstage/test-utils';
import { renderHook } from '@testing-library/react';
import { useCustomFieldExtensions } from './useCustomFieldExtensions';
import {
  ScaffolderFieldExtensions,
  createScaffolderFieldExtension,
} from '../extensions';

const plugin = createPlugin({
  id: 'scaffolder',
  apis: [],
  routes: {},
  externalRoutes: {},
});

describe('useCustomFieldExtensions', () => {
  const wrapper = ({ children }: PropsWithChildren<{}>) =>
    wrapInTestApp(<>{children}</>);

  it('should return field extensions from the React tree', async () => {
    const CustomFieldExtension = plugin.provide(
      createScaffolderFieldExtension({
        name: 'test',
        component: () => <div>Test</div>,
      }),
    );

    const { result } = renderHook(
      () =>
        useCustomFieldExtensions(
          <ScaffolderFieldExtensions>
            <CustomFieldExtension />
          </ScaffolderFieldExtensions>,
        ),
      {
        wrapper,
      },
    );

    expect(result.current).toEqual([expect.objectContaining({ name: 'test' })]);
  });
});
