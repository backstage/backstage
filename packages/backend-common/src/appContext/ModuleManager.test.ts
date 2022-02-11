/*
 * Copyright 2022 The Backstage Authors
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
import { ModuleManager } from './ModuleManager';
import { getVoidLogger } from '../logging';
import {
  createDependencyConfig,
  createDependencyDefinition,
} from '@backstage/app-context-common';

interface TestInterface {
  text(): string;
}

interface TestInterface2 {
  internal(): TestInterface;
}

interface ModuleInterface {
  moduleText(): string;
}
interface ModuleInterface2 {
  moduleInternal(): TestInterface;
}

const singularDepDef = createDependencyDefinition<TestInterface>(
  Symbol.for('@backstage/backend-common.test.TestInterface'),
);
const dependantDepDef = createDependencyDefinition<TestInterface2>(
  Symbol.for('@backstage/backend-common.test.TestInterface2'),
);

describe('ModuleManager', () => {
  const singularDep = createDependencyConfig({
    id: singularDepDef,
    factory: () => ({
      text() {
        return 'hello';
      },
    }),
  });
  const dependantDep = createDependencyConfig({
    id: dependantDepDef,
    dependencies: {
      internalDep: singularDepDef,
    },
    factory: ({ internalDep }) => ({
      internal() {
        return internalDep;
      },
    }),
  });

  describe('Root container', () => {
    it('should be able to create a container for root deps', () => {
      const moduleMgr = ModuleManager.fromConfig({
        logger: getVoidLogger(),
        rootDependencies: [singularDep],
      });
      const rootCtx = moduleMgr.createRootContext();
      expect(rootCtx.get(singularDepDef)).toBeTruthy();
    });

    it('should throw if a dependency is missing', () => {
      const moduleMgr = ModuleManager.fromConfig({
        logger: getVoidLogger(),
        rootDependencies: [dependantDep],
      });
      const rootCtx = moduleMgr.createRootContext();
      expect(() => rootCtx.get(singularDepDef)).toThrowError(
        'No matching bindings found for serviceIdentifier: Symbol(@backstage/backend-common.test.TestInterface',
      );
    });

    it('should bind create root container successfully when all deps provided', () => {
      const moduleMgr = ModuleManager.fromConfig({
        logger: getVoidLogger(),
        rootDependencies: [dependantDep, singularDep],
      });
      const rootCtx = moduleMgr.createRootContext();
      expect(rootCtx.get(singularDepDef).text()).toEqual('hello');
      expect(rootCtx.get(dependantDepDef).internal().text()).toEqual('hello');
    });
  });

  describe('Child contexts', () => {
    const moduleMgr = ModuleManager.fromConfig({
      logger: getVoidLogger(),
      rootDependencies: [singularDep],
    });
    const moduleDependantDepDef = createDependencyDefinition<ModuleInterface>(
      Symbol.for('@backstage/backend-common.test.ModuleInterface'),
    );
    const moduleDependantDepDef2 = createDependencyDefinition<ModuleInterface2>(
      Symbol.for('@backstage/backend-common.test.ModuleInterface2'),
    );
    const moduleDependantDep = createDependencyConfig({
      id: moduleDependantDepDef,
      dependencies: {
        internalDep: singularDepDef,
      },
      factory: ({ internalDep }) => ({
        moduleText() {
          return `module ${internalDep.text()}`;
        },
      }),
    });

    it('Should be able to construct an isolated context for modules', () => {
      const boundPlugin = moduleMgr.createModule({
        id: 'test plugin',
        initialize(ctx) {
          const modInterface: ModuleInterface = ctx.get(moduleDependantDepDef);
          expect(modInterface.moduleText()).toEqual('module hello');
        },
        dependencies: [moduleDependantDep],
      });
      expect(boundPlugin.name).toEqual('test plugin');
    });

    it('should throw on initialization if ctx deps not satisfied', () => {
      const secondDep = createDependencyConfig({
        id: moduleDependantDepDef2,
        dependencies: {
          internalDep: dependantDepDef, // Not bound in root
        },
        factory: () => ({}),
      });

      expect(() =>
        moduleMgr.createModule({
          id: 'test plugin',
          initialize(_ctx) {},
          dependencies: [moduleDependantDep, secondDep],
        }),
      ).toThrowError(
        'failed to retrieve injected dependency for @backstage/backend-common.test.ModuleInterface2; caused by Error: No matching bindings found for serviceIdentifier: Symbol(@backstage/backend-common.test.TestInterface2)',
      );
    });
    it('should create separate instances for root and children', () => {
      const rootCtx = moduleMgr.createRootContext();
      const singularRoot = rootCtx.get(singularDepDef);
      moduleMgr.createModule({
        id: 'test plugin',
        initialize(ctx) {
          expect(singularRoot.text()).toEqual(ctx.get(singularDepDef).text());
          expect(singularRoot).not.toEqual(ctx.get(singularDepDef));
          expect(singularRoot).not.toBe(ctx.get(singularDepDef));
        },
        dependencies: [moduleDependantDep],
      });
    });
  });
});
