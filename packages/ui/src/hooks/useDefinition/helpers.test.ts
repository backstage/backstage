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
import {
  resolveResponsiveValue,
  resolveDefinitionProps,
  processUtilityProps,
} from './helpers';
import type { ComponentConfig } from './types';

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

describe('resolveDefinitionProps', () => {
  it('separates own props from rest props based on propDefs keys', () => {
    const definition = {
      propDefs: { variant: {}, size: {} },
      utilityProps: [],
      styles: {},
      classNames: {},
    } as ComponentConfig<any, any>;

    const { ownPropsResolved, restProps } = resolveDefinitionProps(
      definition,
      { variant: 'primary', size: 'large', 'aria-label': 'test' },
      'initial',
    );

    expect(ownPropsResolved).toEqual({ variant: 'primary', size: 'large' });
    expect(restProps).toEqual({ 'aria-label': 'test' });
  });

  it('excludes utility props from rest props', () => {
    const definition = {
      propDefs: { variant: {} },
      utilityProps: ['m', 'p'] as const,
      styles: {},
      classNames: {},
    } as ComponentConfig<any, any>;

    const { restProps } = resolveDefinitionProps(
      definition,
      { variant: 'primary', m: '2', p: '4', 'aria-label': 'test' },
      'initial',
    );

    expect(restProps).toEqual({ 'aria-label': 'test' });
  });

  it('does not exclude utility props that are also in propDefs', () => {
    const definition = {
      propDefs: { gap: {} },
      utilityProps: ['gap'] as const,
      styles: {},
      classNames: {},
    } as ComponentConfig<any, any>;

    const { ownPropsResolved } = resolveDefinitionProps(
      definition,
      { gap: '4' },
      'initial',
    );

    expect(ownPropsResolved).toEqual({ gap: '4' });
  });

  it('applies default values from propDefs when prop is not provided', () => {
    const definition = {
      propDefs: { size: { default: 'medium' } },
      utilityProps: [],
      styles: {},
      classNames: {},
    } as ComponentConfig<any, any>;

    const { ownPropsResolved } = resolveDefinitionProps(
      definition,
      {},
      'initial',
    );

    expect(ownPropsResolved).toEqual({ size: 'medium' });
  });

  it('does not apply default when prop is explicitly provided', () => {
    const definition = {
      propDefs: { size: { default: 'medium' } },
      utilityProps: [],
      styles: {},
      classNames: {},
    } as ComponentConfig<any, any>;

    const { ownPropsResolved } = resolveDefinitionProps(
      definition,
      { size: 'large' },
      'initial',
    );

    expect(ownPropsResolved).toEqual({ size: 'large' });
  });

  it('preserves falsy prop values (false, 0, empty string) over defaults', () => {
    const definition = {
      propDefs: {
        disabled: { default: true },
        count: { default: 10 },
        label: { default: 'default' },
      },
      utilityProps: [],
      styles: {},
      classNames: {},
    } as ComponentConfig<any, any>;

    const { ownPropsResolved } = resolveDefinitionProps(
      definition,
      { disabled: false, count: 0, label: '' },
      'initial',
    );

    expect(ownPropsResolved).toEqual({
      disabled: false,
      count: 0,
      label: '',
    });
  });

  it('resolves responsive own prop values at the given breakpoint', () => {
    const definition = {
      propDefs: { variant: {} },
      utilityProps: [],
      styles: {},
      classNames: {},
    } as ComponentConfig<any, any>;

    const { ownPropsResolved } = resolveDefinitionProps(
      definition,
      { variant: { xs: 'small', md: 'large' } },
      'md',
    );

    expect(ownPropsResolved).toEqual({ variant: 'large' });
  });

  it('omits own props that are undefined and have no default', () => {
    const definition = {
      propDefs: { variant: {}, size: {} },
      utilityProps: [],
      styles: {},
      classNames: {},
    } as ComponentConfig<any, any>;

    const { ownPropsResolved } = resolveDefinitionProps(
      definition,
      { variant: 'primary' },
      'initial',
    );

    expect(ownPropsResolved).toEqual({ variant: 'primary' });
    expect('size' in ownPropsResolved).toBe(false);
  });

  it('passes through rest props without responsive resolution', () => {
    const definition = {
      propDefs: { variant: {} },
      utilityProps: [],
      styles: {},
      classNames: {},
    } as ComponentConfig<any, any>;

    const responsiveObj = { xs: 'small', md: 'large' };
    const { restProps } = resolveDefinitionProps(
      definition,
      { variant: 'primary', 'data-value': responsiveObj },
      'md',
    );

    expect(restProps['data-value']).toBe(responsiveObj);
  });

  it('returns empty ownPropsResolved when no props match propDefs', () => {
    const definition = {
      propDefs: { variant: {} },
      utilityProps: [],
      styles: {},
      classNames: {},
    } as ComponentConfig<any, any>;

    const { ownPropsResolved } = resolveDefinitionProps(
      definition,
      { 'aria-label': 'test' },
      'initial',
    );

    expect(ownPropsResolved).toEqual({});
  });

  it('returns empty restProps when all props are own or utility props', () => {
    const definition = {
      propDefs: { variant: {} },
      utilityProps: ['m'] as const,
      styles: {},
      classNames: {},
    } as ComponentConfig<any, any>;

    const { restProps } = resolveDefinitionProps(
      definition,
      { variant: 'primary', m: '2' },
      'initial',
    );

    expect(restProps).toEqual({});
  });
});

describe('processUtilityProps', () => {
  it('returns empty classes and style when no utility props are provided', () => {
    const { utilityClasses, utilityStyle } = processUtilityProps({}, [
      'm',
      'p',
    ]);
    expect(utilityClasses).toBe('');
    expect(utilityStyle).toEqual({});
  });

  it('returns empty classes and style when utility values are undefined', () => {
    const { utilityClasses, utilityStyle } = processUtilityProps(
      { m: undefined },
      ['m'],
    );
    expect(utilityClasses).toBe('');
    expect(utilityStyle).toEqual({});
  });

  it('returns empty classes and style when utility values are null', () => {
    const { utilityClasses, utilityStyle } = processUtilityProps({ m: null }, [
      'm',
    ]);
    expect(utilityClasses).toBe('');
    expect(utilityStyle).toEqual({});
  });

  it('generates a utility class for a predefined spacing value', () => {
    const { utilityClasses } = processUtilityProps({ m: '2' }, ['m']);
    expect(utilityClasses).toBe('bui-m-2');
  });

  it('generates a CSS custom property for a custom value', () => {
    const { utilityStyle } = processUtilityProps({ width: '100px' }, ['width']);
    expect(utilityStyle).toEqual({ '--width': '100px' });
  });

  it('generates both the class name and CSS var for custom values', () => {
    const { utilityClasses, utilityStyle } = processUtilityProps(
      { width: '100px' },
      ['width'],
    );
    expect(utilityClasses).toBe('bui-w');
    expect(utilityStyle).toEqual({ '--width': '100px' });
  });

  it('handles responsive utility values with breakpoint prefixes', () => {
    const { utilityClasses } = processUtilityProps(
      { m: { initial: '2', md: '4' } },
      ['m'],
    );
    expect(utilityClasses).toContain('bui-m-2');
    expect(utilityClasses).toContain('md:bui-m-4');
  });

  it('uses no prefix for the initial breakpoint in responsive values', () => {
    const { utilityClasses } = processUtilityProps({ m: { initial: '2' } }, [
      'm',
    ]);
    expect(utilityClasses).toBe('bui-m-2');
  });

  it('applies the transform function (grow: true becomes 1)', () => {
    const { utilityStyle } = processUtilityProps({ grow: true }, ['grow']);
    expect(utilityStyle).toEqual({ '--grow': 1 });
  });

  it('applies the transform function (basis: 42 becomes "42px")', () => {
    const { utilityStyle } = processUtilityProps({ basis: 42 }, ['basis']);
    expect(utilityStyle).toEqual({ '--basis': '42px' });
  });

  it('ignores values not in the valid list for fixed-value props', () => {
    const { utilityClasses, utilityStyle } = processUtilityProps(
      { position: 'invalid' },
      ['position'],
    );
    expect(utilityClasses).toBe('');
    expect(utilityStyle).toEqual({});
  });

  it('combines classes and styles from multiple utility props', () => {
    const { utilityClasses, utilityStyle } = processUtilityProps(
      { m: '2', p: '4', width: '100px' },
      ['m', 'p', 'width'],
    );
    expect(utilityClasses).toContain('bui-m-2');
    expect(utilityClasses).toContain('bui-p-4');
    expect(utilityClasses).toContain('bui-w');
    expect(utilityStyle).toEqual({ '--width': '100px' });
  });

  it('handles a mix of predefined and custom values across different props', () => {
    const { utilityClasses, utilityStyle } = processUtilityProps(
      { m: '2', width: '100px', position: 'relative' },
      ['m', 'width', 'position'],
    );
    expect(utilityClasses).toContain('bui-m-2');
    expect(utilityClasses).toContain('bui-w');
    expect(utilityClasses).toContain('bui-position-relative');
    expect(utilityStyle).toEqual({ '--width': '100px' });
  });
});
