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
import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { useSearchModal } from './useSearchModal';
import { BrowserRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

describe('useSearchModal', () => {
  it.each([
    [true, { open: true, hidden: false }],
    [false, { open: false, hidden: true }],
  ])(
    'should return the correct state when initial state is %s',
    (initialState, result) => {
      const rendered = renderHook(() => useSearchModal(initialState), {
        wrapper: BrowserRouter,
      });

      expect(rendered.result.current.state).toEqual(result);
    },
  );

  it('should keep open forever to true once modal is toggled', () => {
    const rendered = renderHook(() => useSearchModal(), {
      wrapper: BrowserRouter,
    });
    act(() => rendered.result.current.toggleModal());

    expect(rendered.result.current.state).toEqual({
      open: true,
      hidden: false,
    });

    act(() => rendered.result.current.toggleModal());
    expect(rendered.result.current.state).toEqual({
      open: true,
      hidden: true,
    });
  });

  it('should keep open to false if setOpen(false) is invoked on an initially closed modal', () => {
    const rendered = renderHook(() => useSearchModal(), {
      wrapper: BrowserRouter,
    });
    act(() => rendered.result.current.setOpen(false));
    expect(rendered.result.current.state).toEqual({
      open: false,
      hidden: true,
    });
  });

  it('should keep open forever to true even when the modal transition from opened to closed', () => {
    const rendered = renderHook(() => useSearchModal(), {
      wrapper: BrowserRouter,
    });

    act(() => rendered.result.current.setOpen(true));
    expect(rendered.result.current.state).toEqual({
      open: true,
      hidden: false,
    });

    act(() => rendered.result.current.setOpen(false));
    expect(rendered.result.current.state).toEqual({
      open: true,
      hidden: true,
    });
  });

  it('should hide when location changes', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });

    const rendered = renderHook(() => useSearchModal(true), {
      wrapper: ({ children }: React.PropsWithChildren<{}>) => (
        <Router location={history.location} navigator={history}>
          {children}
        </Router>
      ),
    });

    expect(rendered.result.current.state.hidden).toBe(false);
    act(() => history.push('/new/path'));
    rendered.rerender();
    expect(rendered.result.current.state.hidden).toBe(true);
  });
});
