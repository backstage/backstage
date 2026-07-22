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

import { GoldenPathInitialParams } from './GoldenPathInitialParams';

const CONTEXT_MENU = 'Frodo';
const TITLE = 'Shire';
const CARD_WRAPPER = 'Baggins';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: jest.fn(() => ({ entity: { metadata: { title: TITLE } } })),
}));

jest.mock('@backstage/plugin-golden-paths-react', () => ({
  GoldenPathContextMenu: () => CONTEXT_MENU,
}));

jest.mock('./ContentCard', () => ({
  ContentCardWrapper: () => CARD_WRAPPER,
}));

describe('GoldenPathInitialParams', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render all components', async () => {
    const { getByText } = await renderInTestApp(<GoldenPathInitialParams />);

    expect(getByText(TITLE)).toBeInTheDocument();
    expect(getByText(CONTEXT_MENU)).toBeInTheDocument();
    expect(getByText(CARD_WRAPPER)).toBeInTheDocument();
  });
});
