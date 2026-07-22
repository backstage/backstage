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
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { GoldenPathTitleColumn } from './GoldenPathTitleColumn';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import {
  GoldenPathsApi,
  goldenPathsApiRef,
} from '@backstage/plugin-golden-paths-react';

describe('<GoldenPathTitleColumn />', () => {
  const goldenPathsApiMock: jest.Mocked<GoldenPathsApi> = {
    getGoldenPathParameterSchema: jest.fn(),
  } as any;

  it('should render the column with the golden path name', async () => {
    const props = {
      entityRef: 'goldenpath:default/one-golden-path',
    };
    goldenPathsApiMock.getGoldenPathParameterSchema.mockResolvedValue({
      title: 'One Golden Path',
      steps: [],
    });

    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[goldenPathsApiRef, goldenPathsApiMock]]}>
        <GoldenPathTitleColumn {...props} />
      </TestApiProvider>,
      { mountedRoutes: { '/test': entityRouteRef } },
    );

    const text = getByText('One Golden Path');
    expect(text).toBeDefined();
  });
});
