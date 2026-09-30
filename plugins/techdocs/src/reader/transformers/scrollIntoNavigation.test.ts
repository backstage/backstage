/*
 * Copyright 2021 The Backstage Authors
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

import { scrollIntoNavigation } from './scrollIntoNavigation';
import { createTestShadowDom, FIXTURES } from '../../test-utils';

jest.useFakeTimers();

describe('scrollIntoNavigation', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('keeps the active navigation item visible by scrolling only its sidebar', async () => {
    const shadowDom = await createTestShadowDom(
      FIXTURES.FIXTURE_STANDARD_PAGE,
      {
        preTransformers: [],
        postTransformers: [scrollIntoNavigation()],
      },
    );

    const sidebar = shadowDom.querySelector<HTMLElement>(
      '.md-sidebar--primary',
    )!;
    const activeNavItems = shadowDom.querySelectorAll<HTMLElement>(
      '.md-nav__item--active',
    );
    const activeNavItem = activeNavItems[activeNavItems.length - 1];
    sidebar.scrollTop = 100;
    jest.spyOn(sidebar, 'getBoundingClientRect').mockReturnValue({
      top: 20,
      bottom: 220,
    } as DOMRect);
    jest.spyOn(activeNavItem, 'getBoundingClientRect').mockReturnValue({
      top: 250,
      bottom: 270,
    } as DOMRect);
    const scrollNavIntoView = jest.spyOn(
      window.HTMLElement.prototype,
      'scrollIntoView',
    );

    jest.advanceTimersByTime(200);

    expect(sidebar.scrollTop).toBe(150);
    expect(scrollNavIntoView).not.toHaveBeenCalled();
  });

  it('expand active navigation items', async () => {
    const shadowDom = await createTestShadowDom(
      FIXTURES.FIXTURE_STANDARD_PAGE,
      {
        preTransformers: [],
        postTransformers: [scrollIntoNavigation()],
      },
    );

    const click = jest.fn();
    shadowDom.addEventListener('click', click);

    jest.advanceTimersByTime(200);

    expect(click).toHaveBeenCalled();
  });

  it('does not expand already expanded active navigation items', async () => {
    const shadowDom = await createTestShadowDom(
      FIXTURES.FIXTURE_STANDARD_PAGE_EXPANDED_NAVIGATION,
      {
        preTransformers: [],
        postTransformers: [scrollIntoNavigation()],
      },
    );

    const click = jest.fn();
    shadowDom.addEventListener('click', click);

    jest.advanceTimersByTime(200);

    expect(click).not.toHaveBeenCalled();
  });
});
