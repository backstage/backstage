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

import { createElement } from 'react';
import { DefaultIconsApi } from './DefaultIconsApi';
import { LegacyIconsApi } from './LegacyIconsApi';

describe('LegacyIconsApi', () => {
  it('delegates to a custom v2 API and preserves missing and empty icons', () => {
    const element = createElement('svg');
    const iconsApi = {
      icon: jest.fn((key: string) => (key === 'custom' ? element : undefined)),
      listIconKeys: jest.fn(() => ['custom']),
    };
    const api = new LegacyIconsApi(iconsApi);
    expect(api.icon('custom')).toBe(element);
    expect(api.listIconKeys()).toEqual(['custom']);
    expect(api.getIcon('missing')).toBeUndefined();
    const component = api.getIcon('custom');
    expect(component).toEqual(expect.any(Function));
    expect(api.getIcon('custom')).toBe(component);
    expect(iconsApi.icon).toHaveBeenCalledWith('custom');
    expect(iconsApi.listIconKeys).toHaveBeenCalledTimes(1);
  });

  it('should wrap IconElement values in a component for getIcon()', () => {
    const element = createElement('span', null, 'test-icon');
    const api = new LegacyIconsApi(new DefaultIconsApi({ myIcon: element }));

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
    const api = new LegacyIconsApi(new DefaultIconsApi({ myIcon: element }));
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
    const api = new LegacyIconsApi(new DefaultIconsApi({ myIcon: element }));
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
    const api = new LegacyIconsApi(new DefaultIconsApi({ empty: null }));

    const icon = api.getIcon('empty');
    expect(icon).toBeDefined();
    expect(typeof icon).toBe('function');
    // @ts-expect-error testing runtime behavior
    expect(icon({})).toBeNull();
  });
});
