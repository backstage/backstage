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

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from '@backstage/test-utils';
import { Actions } from './Actions';
import { Content } from './Content';
import { ContextProvider, JokeType } from './Context';
import jokes from './jokes.json';

const renderWidget = (defaultCategory?: JokeType) =>
  renderInTestApp(
    <ContextProvider defaultCategory={defaultCategory}>
      <>
        <Content />
        <Actions />
      </>
    </ContextProvider>,
  );

const lastOf = (type?: string) =>
  jokes.filter(joke => !type || joke.type === type).at(-1)!;

describe('RandomJoke', () => {
  let randomMock: jest.SpyInstance;

  beforeEach(() => {
    randomMock = jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    randomMock.mockRestore();
  });

  it.each([
    { category: undefined, expected: lastOf('programming') },
    { category: 'any', expected: lastOf() },
    { category: 'dad', expected: lastOf() },
  ])(
    'shows a built-in joke for the $category category',
    async ({ category, expected }) => {
      randomMock.mockReturnValue(0.999);

      await renderWidget(category as JokeType | undefined);

      expect(screen.getByText(expected.setup)).toBeInTheDocument();
      expect(screen.getByText(expected.punchline)).toBeInTheDocument();
    },
  );

  it('shows a different joke on reroll', async () => {
    randomMock.mockReturnValue(0);
    const [first, second] = jokes;

    await renderWidget('any');
    expect(screen.getByText(first.setup)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Reroll' }));

    expect(screen.getByText(second.setup)).toBeInTheDocument();
    expect(screen.queryByText(first.setup)).not.toBeInTheDocument();
  });
});
