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
import { useTemplateTimeSavedMinutes } from './useTemplateTimeSaved';
import { renderHook, waitFor } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';

const getTemplateWithTimeSaved = (
  timeSaved: string | undefined,
): TemplateEntityV1beta3 => ({
  apiVersion: 'scaffolder.backstage.io/v1beta3',
  kind: 'Template',
  metadata: {
    name: 'test-fixture',
    ...(timeSaved
      ? {
          annotations: {
            'backstage.io/time-saved': timeSaved,
          },
        }
      : undefined),
  },
  spec: {
    type: 'test-fixture',
    steps: [],
  },
});

describe('useTemplateTimeSavedMinutes', () => {
  it.each([
    ['PT2H', 120],
    ['P3D', 4320],
    ['2 hours', undefined],
    [undefined, undefined],
  ])(
    'should return the expected duration given "%s"',
    async (given, expected) => {
      const templateRef = 'template:default/happy-path';
      const template = getTemplateWithTimeSaved(given);

      const { result } = renderHook(
        () => useTemplateTimeSavedMinutes(templateRef),
        {
          wrapper: ({ children }: React.PropsWithChildren<{}>) => (
            <TestApiProvider
              apis={[[catalogApiRef, { getEntityByRef: async () => template }]]}
            >
              {children}
            </TestApiProvider>
          ),
        },
      );

      await waitFor(() => {
        expect(result.current).toEqual(expected);
      });
    },
  );
});
