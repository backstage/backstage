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
    jest.clearAllMocks();
  });

  it('scroll to active navigation item', async () => {
    await createTestShadowDom(FIXTURES.FIXTURE_STANDARD_PAGE, {
      preTransformers: [],
      postTransformers: [scrollIntoNavigation()],
    });

    // jsdom does not implement scrollIntoView so we attach a function to the
    // prototype to be able to test the expected behaviour.
    const scrollNavIntoView = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollNavIntoView;

    jest.advanceTimersByTime(200);

    expect(scrollNavIntoView).toHaveBeenCalledWith();
  });

  it('expand active navigation items', async () => {
    const shadowDom = await createTestShadowDom(
      FIXTURES.FIXTURE_STANDARD_PAGE,
      {
        preTransformers: [],
        postTransformers: [scrollIntoNavigation()],
      },
    );

    // jsdom does not implement scrollIntoView so we attach an empty function to
    // support the behaviour.
    window.HTMLElement.prototype.scrollIntoView = () => {};

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

    // jsdom does not implement scrollIntoView so we attach an empty function to
    // support the behaviour.
    window.HTMLElement.prototype.scrollIntoView = () => {};

    const click = jest.fn();
    shadowDom.addEventListener('click', click);

    jest.advanceTimersByTime(200);

    expect(click).not.toHaveBeenCalled();
  });
});
