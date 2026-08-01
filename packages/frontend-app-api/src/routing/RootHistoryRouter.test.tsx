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

import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { RootHistoryRouter } from './RootHistoryRouter';

/**
 * Reads everything the root projection is responsible for supplying: the
 * location it publishes, the route context it publishes (deliberately
 * empty — app chrome is not mounted under any page route), and the href a
 * `Link` ends up with.
 */
function ChromeProbe() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div>
      <span data-testid="pathname">{location.pathname}</span>
      <span data-testid="search">{location.search}</span>
      <span data-testid="hash">{location.hash}</span>
      <span data-testid="params">{JSON.stringify(useParams())}</span>
      <span data-testid="resolved">{useResolvedPath('./create').pathname}</span>
      <Link to="/catalog">Catalog</Link>
      <button type="button" onClick={() => navigate('/pushed')}>
        Push
      </button>
      <button
        type="button"
        onClick={() => navigate('/replaced', { replace: true })}
      >
        Replace
      </button>
      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}

describe('RootHistoryRouter', () => {
  it('should publish the app history location, follow it, and supply a neutral route context', () => {
    const history = createMockAppHistory({
      initialLocation: '/catalog/entity/foo?q=test#section',
    });

    render(
      <RootHistoryRouter history={history}>
        <ChromeProbe />
      </RootHistoryRouter>,
    );

    expect(screen.getByTestId('pathname')).toHaveTextContent(
      '/catalog/entity/foo',
    );
    expect(screen.getByTestId('search')).toHaveTextContent('?q=test');
    expect(screen.getByTestId('hash')).toHaveTextContent('#section');

    // App chrome is not mounted under any page route, so the route context is
    // deliberately empty: there is no route for a relative target to be
    // relative to, and it resolves from the app root instead.
    expect(screen.getByTestId('params')).toHaveTextContent('{}');
    expect(screen.getByTestId('resolved')).toHaveTextContent('/create');

    act(() => {
      history.navigate('/settings');
    });

    expect(screen.getByTestId('pathname')).toHaveTextContent('/settings');
    expect(screen.getByTestId('search')).toBeEmptyDOMElement();
    expect(screen.getByTestId('hash')).toBeEmptyDOMElement();
  });

  it('should delegate navigation and hrefs to the app history without touching window.history', () => {
    const pushSpy = jest.spyOn(window.history, 'pushState');
    const replaceSpy = jest.spyOn(window.history, 'replaceState');
    const goSpy = jest.spyOn(window.history, 'go');
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const history = createMockAppHistory({
      initialLocation: '/catalog',
      basename: '/backstage',
    });

    render(
      <RootHistoryRouter history={history}>
        <ChromeProbe />
      </RootHistoryRouter>,
    );

    // The deploy basename comes from the app history, not from this component.
    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute(
      'href',
      '/backstage/catalog',
    );

    act(() => {
      screen.getByRole('button', { name: 'Push' }).click();
    });
    act(() => {
      screen.getByRole('button', { name: 'Replace' }).click();
    });

    expect(history.navigateCalls).toEqual([
      { to: '/pushed', options: { state: undefined } },
      { to: '/replaced', options: { state: undefined, replace: true } },
    ]);
    expect(screen.getByTestId('pathname')).toHaveTextContent('/replaced');

    // There is a single, real browser history and this projection never owns
    // it, so back/forward is a warn-and-noop rather than a window.history.go.
    act(() => {
      screen.getByRole('button', { name: 'Back' }).click();
    });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('navigator.go() is not supported'),
    );
    expect(screen.getByTestId('pathname')).toHaveTextContent('/replaced');
    expect(pushSpy).not.toHaveBeenCalled();
    expect(replaceSpy).not.toHaveBeenCalled();
    expect(goSpy).not.toHaveBeenCalled();

    pushSpy.mockRestore();
    replaceSpy.mockRestore();
    goSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
