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

import { createElement, memo, forwardRef } from 'react';
import { DefaultIconsApi } from './DefaultIconsApi';

describe('DefaultIconsApi', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return undefined for unknown keys', () => {
    const api = new DefaultIconsApi({});
    expect(api.icon('missing')).toBeUndefined();
    expect(api.getIcon('missing')).toBeUndefined();
  });

  it('should list all registered icon keys', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const api = new DefaultIconsApi({
      a: createElement('span'),
      b: () => createElement('span'),
      c: null,
    });
    expect(api.listIconKeys()).toEqual(['a', 'b', 'c']);
  });

  it('should return IconElement values directly via icon()', () => {
    const element = createElement('span', null, 'test-icon');
    const api = new DefaultIconsApi({ myIcon: element });

    expect(api.icon('myIcon')).toBe(element);
  });

  it('should return null IconElement values via icon()', () => {
    const api = new DefaultIconsApi({ empty: null });
    expect(api.icon('empty')).toBeNull();
  });

  it('should convert IconComponent values to elements for icon()', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const MyIcon = () => createElement('span', null, 'rendered');
    const api = new DefaultIconsApi({ myIcon: MyIcon });

    const result = api.icon('myIcon');
    expect(result).toBeTruthy();
    // @ts-expect-error accessing internal React element structure
    expect(result.type).toBe(MyIcon);
    // @ts-expect-error accessing internal React element structure
    expect(result.props.fontSize).toBe('inherit');
  });

  it('should wrap IconElement values in a component for getIcon()', () => {
    const element = createElement('span', null, 'test-icon');
    const api = new DefaultIconsApi({ myIcon: element });

    const icon = api.getIcon('myIcon');
    expect(icon).toBeDefined();
    expect(typeof icon).toBe('function');
    // @ts-expect-error testing runtime behavior
    const result = icon({});
    expect(result.type).toBe('span');
    expect(result.props.style).toEqual({ fontSize: '1.5rem' });
    expect(result.props.children).toBe(element.props.children);
    expect(api.getIcon('myIcon')).toBe(icon);
  });

  it('should honor fontSize for getIcon()', () => {
    const element = createElement('svg');
    const api = new DefaultIconsApi({ myIcon: element });
    const icon = api.getIcon('myIcon');

    // @ts-expect-error testing runtime behavior
    const result = icon({ fontSize: 'small' });
    expect(result.props.style.fontSize).toBe('1.25rem');
  });

  it('should forward runtime props to the original icon element', () => {
    const element = createElement('svg', {
      className: 'existing',
      style: { color: 'red' },
    });
    const api = new DefaultIconsApi({ myIcon: element });
    const icon = api.getIcon('myIcon');

    // @ts-expect-error testing runtime behavior
    const result = icon({ className: 'extra', style: { width: '2em' } });

    expect(result.type).toBe('svg');
    expect(result.props.className).toBe('existing extra');
    expect(result.props.style).toEqual({
      color: 'red',
      fontSize: '1.5rem',
      width: '2em',
    });
  });

  it('should wrap null IconElement in a component for getIcon()', () => {
    const api = new DefaultIconsApi({ empty: null });

    const icon = api.getIcon('empty');
    expect(icon).toBeDefined();
    expect(typeof icon).toBe('function');
    // @ts-expect-error testing runtime behavior
    expect(icon({})).toBeNull();
  });

  it('should log a single warning listing all IconComponent keys', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    void new DefaultIconsApi({
      a: () => createElement('span'),
      elem: createElement('span'),
      b: () => createElement('span'),
      empty: null,
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching(/a, b$/));
  });

  it('should not warn when only IconElement values are provided', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    void new DefaultIconsApi({
      element: createElement('span'),
      empty: null,
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should treat React.memo components as IconComponent', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const MemoIcon = memo(() => createElement('svg'));
    const api = new DefaultIconsApi({ myIcon: MemoIcon });

    const el = api.icon('myIcon');
    expect(el).toBeTruthy();
    // @ts-expect-error accessing internal React element structure
    expect(el.type).toBe(MemoIcon);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('myIcon'));
  });

  it('should treat React.forwardRef components as IconComponent', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const RefIcon = forwardRef(() => createElement('svg'));
    // @ts-expect-error forwardRef is not strictly IconComponent but should be handled
    const api = new DefaultIconsApi({ myIcon: RefIcon });

    const el = api.icon('myIcon');
    expect(el).toBeTruthy();
    // @ts-expect-error accessing internal React element structure
    expect(el.type).toBe(RefIcon);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('myIcon'));
  });
});
