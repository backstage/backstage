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

import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from '@backstage/test-utils';
import { Actions } from './Actions';
import { Content } from './Content';
import { ContextProvider, JokeType } from './Context';
import { fallbackJokes } from './fallbackJokes';

const joke = (name: string) => ({
  type: 'programming',
  setup: `${name} setup`,
  punchline: `${name} punchline`,
  id: 1,
});

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const deferred = () => {
  let resolve!: (response: Response) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<Response>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const renderWidget = (
  props: { baseUrl?: string; defaultCategory?: JokeType } = {},
) =>
  renderInTestApp(
    <ContextProvider {...props}>
      <>
        <Content />
        <Actions />
      </>
    </ContextProvider>,
  );

const expectFallbackJoke = async () => {
  await waitFor(() =>
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument(),
  );
  const shown = fallbackJokes.filter(fallback =>
    screen.queryByText(fallback.setup),
  );
  expect(shown).toHaveLength(1);
  expect(screen.getByText(shown[0].punchline)).toBeInTheDocument();
};

describe('RandomJoke', () => {
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it.each([
    {
      name: 'the default API and category',
      props: {},
      url: 'https://api.app-jokes.workers.dev/jokes/programming/random',
      body: [joke('default')],
    },
    {
      name: 'a custom baseUrl with a trailing slash and any category',
      props: { baseUrl: 'https://jokes.example/', defaultCategory: 'any' },
      url: 'https://jokes.example/jokes/random',
      body: joke('default'),
    },
  ] as const)('shows a joke from $name', async ({ props, url, body }) => {
    fetchMock.mockResolvedValue(jsonResponse(body));

    await renderWidget(props);

    expect(await screen.findByText('default setup')).toBeInTheDocument();
    expect(screen.getByText('default punchline')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(url, expect.anything());
  });

  it.each([
    [
      'an HTTP error',
      () => Promise.resolve(new Response('down', { status: 503 })),
    ],
    ['a network error', () => Promise.reject(new TypeError('Failed to fetch'))],
    ['an empty list', () => Promise.resolve(jsonResponse([]))],
  ])('shows a fallback joke after %s', async (_name, respond) => {
    fetchMock.mockImplementation(respond);

    await renderWidget();

    await expectFallbackJoke();
  });

  it.each([
    [
      'succeeds',
      (a: ReturnType<typeof deferred>) => a.resolve(jsonResponse(joke('old'))),
    ],
    [
      'fails',
      (a: ReturnType<typeof deferred>) => a.reject(new TypeError('timeout')),
    ],
  ])(
    'keeps the newest joke when an older request %s late',
    async (_name, settleOld) => {
      const oldRequest = deferred();
      const newRequest = deferred();
      fetchMock
        .mockReturnValueOnce(oldRequest.promise)
        .mockReturnValueOnce(newRequest.promise);

      await renderWidget();
      await userEvent.click(screen.getByRole('button', { name: 'Reroll' }));

      await act(async () => newRequest.resolve(jsonResponse(joke('new'))));
      expect(await screen.findByText('new setup')).toBeInTheDocument();

      await act(async () => settleOld(oldRequest));
      expect(screen.getByText('new setup')).toBeInTheDocument();
      expect(screen.queryByText('old setup')).not.toBeInTheDocument();
      fallbackJokes.forEach(fallback =>
        expect(screen.queryByText(fallback.setup)).not.toBeInTheDocument(),
      );
    },
  );
});
