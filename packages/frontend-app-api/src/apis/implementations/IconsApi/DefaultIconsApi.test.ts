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

import { createElement, type ReactNode } from 'react';
import { DefaultIconsApi } from './DefaultIconsApi';

describe('DefaultIconsApi', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return undefined for unknown keys', () => {
    const api = new DefaultIconsApi({});
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

  it('should support IconElement values and wrap them in a component', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const element = createElement('span', null, 'test-icon');
    const api = new DefaultIconsApi({ myIcon: element });

    const Icon = api.getIcon('myIcon');
    expect(Icon).toBeDefined();
    expect(typeof Icon).toBe('function');
    expect((Icon! as (props: object) => ReactNode)({})).toBe(element);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should support null IconElement values', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const api = new DefaultIconsApi({ empty: null });

    const Icon = api.getIcon('empty');
    expect(Icon).toBeDefined();
    expect(typeof Icon).toBe('function');
    expect((Icon! as (props: object) => ReactNode)({})).toBeNull();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should support IconComponent values and return them directly', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const MyIcon = () => createElement('span', null, 'component-icon');
    const api = new DefaultIconsApi({ myIcon: MyIcon });

    expect(api.getIcon('myIcon')).toBe(MyIcon);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('myIcon'));
  });

  it('should log a single warning listing all IconComponent keys', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const A = () => createElement('span');
    const B = () => createElement('span');

    const api = new DefaultIconsApi({
      a: A,
      elem: createElement('span'),
      b: B,
      empty: null,
    });
    expect(api.getIcon('a')).toBe(A);
    expect(api.getIcon('b')).toBe(B);
    expect(api.getIcon('elem')).toEqual(expect.any(Function));
    expect(api.getIcon('empty')).toEqual(expect.any(Function));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching(/a, b$/));
  });

  it('should handle a mix of IconComponent and IconElement values', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const element = createElement('span', null, 'elem');
    const Component = () => createElement('span', null, 'comp');

    const api = new DefaultIconsApi({
      elem: element,
      comp: Component,
      empty: null,
    });

    // Element - wrapped in a component, returned via getIcon
    const ElemIcon = api.getIcon('elem');
    expect(ElemIcon).toBeDefined();
    expect((ElemIcon! as (props: object) => ReactNode)({})).toBe(element);

    // Component - returned directly
    expect(api.getIcon('comp')).toBe(Component);

    // Null element - wrapped in a component
    const EmptyIcon = api.getIcon('empty');
    expect(EmptyIcon).toBeDefined();
    expect((EmptyIcon! as (props: object) => ReactNode)({})).toBeNull();

    // Single warning mentioning only the component key
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('comp'));
    expect(warnSpy).toHaveBeenCalledWith(expect.not.stringContaining('elem'));
  });
});
