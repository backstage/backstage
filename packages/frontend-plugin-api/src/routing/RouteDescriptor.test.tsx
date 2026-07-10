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

import { ComponentType } from 'react';
import {
  createRouteDescriptor,
  resolveRouteDescriptorLoader,
  type RouteDescriptor,
} from './RouteDescriptor';

describe('RouteDescriptor', () => {
  it('should create a path segment descriptor', () => {
    const route = createRouteDescriptor({
      path: 'overview',
    });

    expect(route.$$type).toBe('@backstage/RouteDescriptor');
    expect(route.path).toBe('overview');
    expect(route.index).toBe(false);
    expect(route.splat).toBe(false);
    expect(route.children).toEqual([]);
    expect(route.loader).toBeUndefined();
    expect(route.component).toBeUndefined();
  });

  it('should create nested children', () => {
    const child = createRouteDescriptor({ path: 'details' });
    const parent = createRouteDescriptor({
      path: 'entities',
      children: [child],
    });

    expect(parent.children).toHaveLength(1);
    expect(parent.children[0]).toBe(child);
    expect(parent.children[0].path).toBe('details');
  });

  it('should create descriptors with path params', () => {
    const route = createRouteDescriptor({
      path: 'entities/:kind/:namespace/:name',
    });

    expect(route.path).toBe('entities/:kind/:namespace/:name');
    expect(route.params).toEqual(['kind', 'namespace', 'name']);
  });

  it('should create an index route', () => {
    const route = createRouteDescriptor({
      index: true,
      loader: async () => <div>Index</div>,
    });

    expect(route.index).toBe(true);
    expect(route.path).toBeUndefined();
    expect(route.params).toEqual([]);
  });

  it('should create a splat route', () => {
    const route = createRouteDescriptor({
      path: 'docs/*',
    });

    expect(route.path).toBe('docs/*');
    expect(route.splat).toBe(true);
    expect(route.params).toEqual([]);
  });

  it('should create a root splat route', () => {
    const route = createRouteDescriptor({
      path: '*',
    });

    expect(route.path).toBe('*');
    expect(route.splat).toBe(true);
  });

  it('should accept a lazy element loader', async () => {
    const route = createRouteDescriptor({
      path: 'lazy',
      loader: async () => <div data-testid="lazy">Lazy</div>,
    });

    expect(route.loader).toBeDefined();
    const element = await route.loader!();
    expect(element).toEqual(<div data-testid="lazy">Lazy</div>);
  });

  it('should accept a component type as the element', async () => {
    const Page: ComponentType = () => <div>Page</div>;
    const route = createRouteDescriptor({
      path: 'component',
      component: Page,
    });

    expect(route.component).toBe(Page);
    const resolved = resolveRouteDescriptorLoader(route);
    expect(resolved).toBeDefined();
    const element = await resolved!();
    expect(element.type).toBe(Page);
  });

  it('should accept optional title and id for tab composition', () => {
    const route = createRouteDescriptor({
      id: 'settings',
      path: 'settings',
      title: 'Settings',
    });

    expect(route.id).toBe('settings');
    expect(route.title).toBe('Settings');
  });

  it('should reject absolute paths', () => {
    expect(() => createRouteDescriptor({ path: '/absolute' })).toThrow(
      /must not start with '\//,
    );
  });

  it('should reject paths that end with a slash', () => {
    expect(() => createRouteDescriptor({ path: 'trailing/' })).toThrow(
      /must not end with '\//,
    );
  });

  it('should reject index routes that also set a path', () => {
    expect(() =>
      createRouteDescriptor({ index: true, path: 'overview' }),
    ).toThrow(/index route must not set a path/);
  });

  it('should reject invalid param names', () => {
    expect(() => createRouteDescriptor({ path: 'x/:bad-name' })).toThrow(
      /invalid param/,
    );
  });

  it('should support deep nesting with params, splat, and lazy loaders', () => {
    const leaf: RouteDescriptor = createRouteDescriptor({
      path: 'files/*',
      loader: async () => <div>Files</div>,
    });
    const mid = createRouteDescriptor({
      path: ':id',
      children: [leaf],
    });
    const root = createRouteDescriptor({
      path: 'catalog',
      title: 'Catalog',
      children: [
        createRouteDescriptor({
          index: true,
          loader: async () => <div>Overview</div>,
        }),
        mid,
      ],
    });

    expect(root.children).toHaveLength(2);
    expect(root.children[0].index).toBe(true);
    expect(root.children[1].path).toBe(':id');
    expect(root.children[1].params).toEqual(['id']);
    expect(root.children[1].children[0].splat).toBe(true);
    expect(root.children[1].children[0].loader).toBeDefined();
  });
});
