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
  type AnyApiFactory,
  createApiRef,
} from '@backstage/frontend-plugin-api';
import {
  FrontendApiRegistry,
  FrontendApiResolver,
} from './FrontendApiRegistry';

describe('FrontendApiResolver', () => {
  it('should cache falsy API values', () => {
    const falseApiRef = createApiRef<boolean>({ id: 'test.false' });
    const falseFactoryFn = jest.fn(() => false);
    const registry = new FrontendApiRegistry();

    registry.register({
      api: falseApiRef,
      deps: {},
      factory: falseFactoryFn,
    } as AnyApiFactory);

    const resolver = new FrontendApiResolver({ primaryRegistry: registry });

    expect(resolver.get(falseApiRef)).toBe(false);
    expect(resolver.get(falseApiRef)).toBe(false);
    expect(falseFactoryFn).toHaveBeenCalledTimes(1);
  });

  it('should resolve falsy dependencies', () => {
    const falseApiRef = createApiRef<boolean>({ id: 'test.false' });
    const dependentApiRef = createApiRef<string>({ id: 'test.dependent' });
    const falseFactoryFn = jest.fn(() => false);
    const dependentFactoryFn = jest.fn((deps: { falseDependency: boolean }) =>
      deps.falseDependency === false ? 'resolved' : 'unexpected',
    );
    const registry = new FrontendApiRegistry();

    registry.register({
      api: falseApiRef,
      deps: {},
      factory: falseFactoryFn,
    } as AnyApiFactory);
    registry.register({
      api: dependentApiRef,
      deps: { falseDependency: falseApiRef },
      factory: dependentFactoryFn,
    } as AnyApiFactory);

    const resolver = new FrontendApiResolver({ primaryRegistry: registry });

    expect(resolver.get(dependentApiRef)).toBe('resolved');
    expect(dependentFactoryFn).toHaveBeenCalledWith({
      falseDependency: false,
    });
  });
});
