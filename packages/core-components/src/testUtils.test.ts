/*
 * Copyright 2024 The Backstage Authors
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
import { mockBreakpoint } from './testUtils';

describe('mockBreakpoint', () => {
  const originalMatchMedia = window.matchMedia;

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should remove the mock', () => {
    const { remove } = mockBreakpoint({ initialBreakpoint: 'md' });
    expect(originalMatchMedia).not.toBe(window.matchMedia);
    remove();
    expect(window.matchMedia).toBe(originalMatchMedia);
  });

  it('should mock matchMedia with initialBreakpoint', () => {
    const { set } = mockBreakpoint({ initialBreakpoint: 'md' });

    expect(window.matchMedia('(min-width:960px)').matches).toBe(true);
    expect(window.matchMedia('(min-width:1280px)').matches).toBe(false);

    set('lg');
    expect(window.matchMedia('(min-width:1280px)').matches).toBe(true);
  });

  it('should mock matchMedia with matches option', () => {
    mockBreakpoint({ matches: true });

    expect(window.matchMedia('(min-width:1920px)').matches).toBe(true);
    expect(window.matchMedia('(min-width:1280px)').matches).toBe(true);
    expect(window.matchMedia('(min-width:960px)').matches).toBe(true);
    expect(window.matchMedia('(min-width:600px)').matches).toBe(true);
    expect(window.matchMedia('(min-width:0px)').matches).toBe(true);
  });

  it('should mock matchMedia with custom queryBreakpointMap', () => {
    const customMap: Record<string, Breakpoint> = {
      '(min-width:1500px)': 'xl',
      '(min-width:1000px)': 'lg',
      '(min-width:700px)': 'md',
      '(min-width:400px)': 'sm',
      '(min-width:0px)': 'xs',
    };
    const { set } = mockBreakpoint({
      initialBreakpoint: 'sm',
      queryBreakpointMap: customMap,
    });

    expect(window.matchMedia('(min-width:400px)').matches).toBe(true);
    expect(window.matchMedia('(min-width:700px)').matches).toBe(false);

    set('md');
    expect(window.matchMedia('(min-width:700px)').matches).toBe(true);
  });
});
