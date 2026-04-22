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
import { resolveResponsiveValue } from './helpers';

describe('resolveResponsiveValue', () => {
  it('returns a plain string unchanged', () => {
    expect(resolveResponsiveValue('hello', 'md')).toBe('hello');
  });

  it('returns a plain number unchanged', () => {
    expect(resolveResponsiveValue(42, 'md')).toBe(42);
  });

  it('returns undefined unchanged', () => {
    expect(resolveResponsiveValue(undefined, 'md')).toBeUndefined();
  });

  it('returns null unchanged', () => {
    expect(resolveResponsiveValue(null, 'md')).toBeNull();
  });

  it('returns a non-breakpoint object unchanged', () => {
    const obj = { foo: 'bar' };
    expect(resolveResponsiveValue(obj, 'md')).toBe(obj);
  });

  it('returns an object with only an initial key unchanged (not detected as responsive)', () => {
    const obj = { initial: 'base' };
    expect(resolveResponsiveValue(obj, 'md')).toBe(obj);
  });

  it('resolves exact breakpoint match', () => {
    expect(resolveResponsiveValue({ xs: 'small', md: 'medium' }, 'md')).toBe(
      'medium',
    );
  });

  it('falls back to the nearest smaller breakpoint', () => {
    expect(resolveResponsiveValue({ xs: 'small', md: 'medium' }, 'sm')).toBe(
      'small',
    );
  });

  it('falls back across multiple missing breakpoints', () => {
    expect(resolveResponsiveValue({ xs: 'small', xl: 'xlarge' }, 'lg')).toBe(
      'small',
    );
  });

  it('falls back to initial when no named breakpoint matches at or below current', () => {
    expect(
      resolveResponsiveValue({ initial: 'base', md: 'medium' }, 'sm'),
    ).toBe('base');
  });

  it('falls forward to the smallest available breakpoint when nothing is at or below current', () => {
    expect(
      resolveResponsiveValue({ md: 'medium', xl: 'xlarge' }, 'initial'),
    ).toBe('medium');
  });

  it('resolves initial breakpoint from a responsive object that includes initial', () => {
    expect(
      resolveResponsiveValue({ initial: 'base', xs: 'small' }, 'initial'),
    ).toBe('base');
  });

  it('skips undefined values during fallback', () => {
    expect(
      resolveResponsiveValue(
        { xs: undefined, sm: 'small', md: undefined },
        'md',
      ),
    ).toBe('small');
  });
});
