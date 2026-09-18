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

import { render, screen } from '@testing-library/react';

jest.mock('../../Router', () => ({
  EmbeddedDocsRouter: () => {
    const { useTechDocsReaderLayout } = jest.requireActual(
      '../../reader/TechDocsReaderLayoutContext',
    );
    return <span data-testid="reader-layout">{useTechDocsReaderLayout()}</span>;
  },
  TechDocsReaderRouter: () => null,
}));

import { TechDocsEntityContent } from './TechDocsReaderPage';

describe('<TechDocsEntityContent />', () => {
  it('selects the BUI reader layout for entity content', () => {
    render(<TechDocsEntityContent addonOptions={[]} />);

    expect(screen.getByTestId('reader-layout')).toHaveTextContent('bui');
  });
});
