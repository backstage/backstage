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
import { InversifyApplicationContext } from './ApplicationContext';
import {
  createDependencyConfig,
  createDependencyDefinition,
} from '@backstage/app-context-common';
import { Container } from 'inversify';

interface TestInterface {
  text(): string;
}

interface TestInterface2 {
  internal(): TestInterface;
}

const singularDepDef = createDependencyDefinition<TestInterface>(
  Symbol.for('@backstage/backend-common.test.TestInterface'),
);
const dependantDepDef = createDependencyDefinition<TestInterface2>(
  Symbol.for('@backstage/backend-common.test.TestInterface2'),
);

describe('Application Context', () => {
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

  it('Should be able to initialize an App Context', () => {
    const ctx = InversifyApplicationContext.fromConfig({
      dependencies: [dependantDep, singularDep],
    });
    const singularInstance = ctx.get(singularDepDef);
    expect(singularInstance.text()).toEqual('hello');
  });
  it('should use the container passed in instead of creating a new one', () => {
    const container = new Container();
    const ctx = InversifyApplicationContext.fromConfig({
      dependencies: [dependantDep, singularDep],
      container,
    });
    const ctxContainer = ctx.getContainer();
    expect(ctxContainer).toBe(container);
  });
});
