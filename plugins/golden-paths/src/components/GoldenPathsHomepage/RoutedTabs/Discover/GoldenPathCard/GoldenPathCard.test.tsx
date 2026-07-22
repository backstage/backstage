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

import { GoldenPathCard } from './GoldenPathCard';

const MOCK_HEADER = 'Golden Path 1';
const MOCK_REGIONS = 'Poland';
const MOCK_DESCRIPTION = 'Lorem ipsum.';
const MOCK_TAGS = 'azure, javascript';
const MOCK_ACTIONS = 'Choose';

jest.mock('./GoldenPathCardHeader', () => ({
  GoldenPathCardHeader: jest.fn(() => <div>{MOCK_HEADER}</div>),
}));

jest.mock('./RegionsAndTemplates', () => ({
  RegionsAndTemplates: jest.fn(() => <div>{MOCK_REGIONS}</div>),
}));

jest.mock('./GoldenPathCardDescription', () => ({
  GoldenPathCardDescription: jest.fn(() => <div>{MOCK_DESCRIPTION}</div>),
}));

jest.mock('./GoldenPathCardTags', () => ({
  GoldenPathCardTags: jest.fn(() => <div>{MOCK_TAGS}</div>),
}));

jest.mock('./GoldenPathCardActions', () => ({
  GoldenPathCardActions: jest.fn(() => <div>{MOCK_ACTIONS}</div>),
}));

describe('GoldenPathCard', () => {
  it('should render all content components properly', async () => {
    const { getByText } = await renderInTestApp(<GoldenPathCard />);

    const header = getByText(MOCK_HEADER);
    expect(header).toBeInTheDocument();

    const regions = getByText(MOCK_REGIONS);
    expect(regions).toBeInTheDocument();

    const description = getByText(MOCK_DESCRIPTION);
    expect(description).toBeInTheDocument();

    const tags = getByText(MOCK_TAGS);
    expect(tags).toBeInTheDocument();

    const actions = getByText(MOCK_ACTIONS);
    expect(actions).toBeInTheDocument();
  });
});
