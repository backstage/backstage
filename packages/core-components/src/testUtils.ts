/*
 * Copyright 2023 The Backstage Authors
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

import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { act } from '@testing-library/react';

const originalMatchMedia = window.matchMedia;

/**
 *  This is a mocking method suggested in the Jest docs, as it is not implemented in JSDOM yet.
 *  It can be used to mock values for the Material UI `useMediaQuery` hook if it is used in a tested component.
 *
 *  For issues checkout the documentation:
 *  https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 *
 *  If there are any updates from Material UI React on testing `useMediaQuery` this mock should be replaced
 *  https://mui.com/material-ui/react-use-media-query/#testing
 *
 * @public
 *
 * @example
 * Match with any media query:
 * ```ts
 * mockBreakpoint({ matches: true });
 * ```
 */
export function mockBreakpoint(options: { matches: boolean }): void;
/**
 *  This is a mocking method suggested in the Jest docs, as it is not implemented in JSDOM yet.
 *  It can be used to mock values for the Material UI `useMediaQuery` hook if it is used in a tested component.
 *
 *  For issues checkout the documentation:
 *  https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 *
 *  If there are any updates from Material UI React on testing `useMediaQuery` this mock should be replaced
 *  https://mui.com/material-ui/react-use-media-query/#testing
 *
 * @public
 *
 * @example
 * Set the initial breakpoint:
 * ```ts
 * mockBreakpoint({ initialBreakpoint: 'md' });
 * ```
 *
 * @example
 * Map media queries to breakpoints:
 * ```ts
 * mockBreakpoint({ queryBreakpointMap: { '(min-width:1500px)': 'xl', '(min-width:1000px)': 'lg', '(min-width:700px)': 'md', '(min-width:400px)': 'sm', '(min-width:0px)': 'xs', } });
 * ```
 *
 * @example
 * Change the breakpoint during the test:
 * ```ts
 * const { set } = mockBreakpoint({ initialBreakpoint: 'md' });
 * set('lg');
 * ```
 **/
export function mockBreakpoint(options: {
  /** Defaults to 'lg' */
  initialBreakpoint?: Breakpoint;
  /** Defaults to \{ '(min-width:1920px)': 'xl', '(min-width:1280px)': 'lg', '(min-width:960px)': 'md', '(min-width:600px)': 'sm', '(min-width:0px)': 'xs' \} */
  queryBreakpointMap?: Record<string, Breakpoint>;
}): {
  set(value: string): void;
  remove(): void;
};
export function mockBreakpoint(
  options:
    | {
        matches: boolean;
      }
    | {
        initialBreakpoint?: Breakpoint;
        queryBreakpointMap?: Record<string, Breakpoint>;
      },
): {
  set(value: string): void;
  remove(): void;
} {
  const mediaQueries: {
    mediaQueryString: string;
    mediaQueryList: { matches: boolean };
    mediaQueryListeners: Set<(event: { matches: boolean }) => void>;
  }[] = [];
  let breakpoint: Breakpoint = 'lg';
  if ('initialBreakpoint' in options && options.initialBreakpoint) {
    breakpoint = options.initialBreakpoint;
  }
  const breakpoints: Record<string, Breakpoint> =
    'queryBreakpointMap' in options &&
    typeof options.queryBreakpointMap === 'object'
      ? options.queryBreakpointMap
      : {
          '(min-width:1920px)': 'xl',
          '(min-width:1280px)': 'lg',
          '(min-width:960px)': 'md',
          '(min-width:600px)': 'sm',
          '(min-width:0px)': 'xs',
        };
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(mediaQueryString => {
      const mediaQueryListeners = new Set<
        (event: { matches: boolean }) => void
      >();
      const mediaQueryList = {
        matches:
          'matches' in options
            ? options.matches
            : breakpoints[mediaQueryString] === breakpoint,
        media: mediaQueryString,
        onchange: null,
        addListener: jest.fn(listener => {
          mediaQueryListeners.add(listener);
        }),
        removeListener: jest.fn(listener => {
          mediaQueryListeners.delete(listener);
        }),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
      mediaQueries.push({
        mediaQueryString,
        mediaQueryList,
        mediaQueryListeners,
      });
      return mediaQueryList;
    }),
  });

  return {
    set(newBreakpoint: Breakpoint) {
      breakpoint = newBreakpoint;
      mediaQueries.forEach(
        ({ mediaQueryString, mediaQueryList, mediaQueryListeners }) => {
          act(() => {
            const matches =
              'matches' in options
                ? options.matches
                : breakpoints[mediaQueryString] === breakpoint;
            mediaQueryList.matches = matches;
            mediaQueryListeners.forEach(listener => listener({ matches }));
          });
        },
      );
    },
    remove() {
      window.matchMedia = originalMatchMedia;
    },
  };
}
