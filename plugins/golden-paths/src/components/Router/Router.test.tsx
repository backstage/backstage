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
import { renderInTestApp } from '@backstage/test-utils';

import { Router } from './Router';

const HOMEPAGE = 'GP Homepage';
const DETAILS = 'GP Details';

jest.mock('../GoldenPathsHomepage', () => ({
  GoldenPathsHomepage: () => <div>{HOMEPAGE}</div>,
}));

jest.mock('../GoldenPathDetailsPage', () => ({
  GoldenPathDetailsPage: () => <div>{DETAILS}</div>,
}));

jest.mock('@backstage/plugin-scaffolder-react', () => ({
  useCustomFieldExtensions: jest.fn(() => []),
}));

describe('Router', () => {
  it("should render GoldenPathsHomepage on path '/'", async () => {
    const { getByText } = await renderInTestApp(<Router />, {
      routeEntries: ['/'],
    });

    expect(getByText(HOMEPAGE)).toBeInTheDocument();
  });

  it("should render GoldenPathDetailsPage on path '/:namespace/:name'", async () => {
    const { getByText } = await renderInTestApp(<Router />, {
      routeEntries: ['/development/test-golden-path'],
    });

    expect(getByText(DETAILS)).toBeInTheDocument();
  });

  it('should render GoldenPathsHomepage on non-existent path', async () => {
    const { getByText } = await renderInTestApp(<Router />, {
      routeEntries: ['/qwerty1234'],
    });

    expect(getByText(HOMEPAGE)).toBeInTheDocument();
  });
});
