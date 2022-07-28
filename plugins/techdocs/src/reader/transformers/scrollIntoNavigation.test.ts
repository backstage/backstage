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

import { scrollIntoNavigation } from '.';

jest.useFakeTimers();

describe('scrollIntoNavigation', () => {
  const transformer = scrollIntoNavigation();
  const dom = { querySelectorAll: jest.fn().mockReturnValue([]) };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('scroll to active navigation item', async () => {
    const scrollNavIntoView1 = jest.fn();
    const scrollNavIntoView2 = jest.fn();

    dom.querySelectorAll.mockReturnValue([
      {
        scrollIntoView: scrollNavIntoView1,
        querySelector: jest.fn(),
        click: jest.fn(),
      },
      {
        scrollIntoView: scrollNavIntoView2,
        querySelector: jest.fn(),
        click: jest.fn(),
      },
    ]);

    transformer(dom as unknown as Element);
    jest.advanceTimersByTime(200);

    expect(dom.querySelectorAll).toHaveBeenCalledWith(
      expect.stringMatching('li.md-nav__item--active'),
    );
    expect(scrollNavIntoView1).not.toHaveBeenCalled();
    expect(scrollNavIntoView2).toHaveBeenCalledWith();
  });

  it('expand active navigation items', async () => {
    const navItemClick1 = jest.fn();
    const navItemClick2 = jest.fn();

    dom.querySelectorAll.mockReturnValue([
      {
        scrollIntoView: jest.fn(),
        querySelector: jest.fn().mockReturnValue({ click: navItemClick1 }),
      },
      {
        scrollIntoView: jest.fn(),
        querySelector: jest.fn().mockReturnValue({ click: navItemClick2 }),
      },
    ]);

    transformer(dom as unknown as Element);
    jest.advanceTimersByTime(200);

    expect(dom.querySelectorAll).toHaveBeenCalledWith(
      expect.stringMatching('li.md-nav__item--active'),
    );
    expect(navItemClick1).toHaveBeenCalledWith();
    expect(navItemClick2).toHaveBeenCalledWith();
  });
});
