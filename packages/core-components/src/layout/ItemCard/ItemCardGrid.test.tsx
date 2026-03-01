/*
 * Copyright 2020 The Backstage Authors
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
import { screen } from '@testing-library/react';
import { ItemCardGrid } from './ItemCardGrid';

describe('<ItemCardGrid />', () => {
  it('renders default without exploding', async () => {
    await renderInTestApp(
      <ItemCardGrid>
        <div>Hello!</div>
      </ItemCardGrid>,
    );
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('renders custom styles', async () => {
    await renderInTestApp(
      <>
        <ItemCardGrid data-testid="cards-hello">
          <div>Hello!</div>
        </ItemCardGrid>
        <ItemCardGrid
          data-testid="cards-goodbye"
          classes={{ root: 'my-css-class' }}
        >
          <div>Goodbye!</div>
        </ItemCardGrid>
      </>,
    );
    // Tailwind grid classes are applied via className, not inline styles
    expect(screen.getByTestId('cards-hello')).toHaveClass('grid');
    expect(screen.getByTestId('cards-goodbye')).toHaveClass('my-css-class');
  });
});
