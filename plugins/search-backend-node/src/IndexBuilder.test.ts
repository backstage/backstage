/*
 * Copyright 2021 The Backstage Authors
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

import { getVoidLogger } from '@backstage/backend-common';
import { TaskInvocationDefinition, TaskRunner } from '@backstage/backend-tasks';
import {
  DocumentCollatorFactory,
  DocumentDecoratorFactory,
  SearchEngine,
} from '@backstage/plugin-search-common';
import { Readable, Transform } from 'stream';
import { IndexBuilder } from './IndexBuilder';
import { LunrSearchEngine } from './index';

class TestDocumentCollatorFactory implements DocumentCollatorFactory {
  readonly type: string = 'anything';
  async getCollator(): Promise<Readable> {
    const collator = new Readable({ objectMode: true });
    collator._read = () => {};
    return collator;
  }
}

class TypedDocumentCollatorFactory extends TestDocumentCollatorFactory {
  readonly type = 'an-expected-type';
}

class TestDocumentDecoratorFactory implements DocumentDecoratorFactory {
  async getDecorator(): Promise<Transform> {
    return new Transform();
  }
}

class TypedDocumentDecoratorFactory extends TestDocumentDecoratorFactory {
  readonly types = ['an-expected-type'];
}

class DifferentlyTypedDocumentDecoratorFactory extends TestDocumentDecoratorFactory {
  readonly types = ['not-the-expected-type'];
}

describe('IndexBuilder', () => {
  let testSearchEngine: SearchEngine;
  let testIndexBuilder: IndexBuilder;
  let testScheduledTaskRunner: TaskRunner;

  beforeEach(() => {
    const logger = getVoidLogger();
    testScheduledTaskRunner = {
      run: async (task: TaskInvocationDefinition & { fn: () => void }) => {
        task.fn();
      },
    };
    testSearchEngine = new LunrSearchEngine({ logger });
    testIndexBuilder = new IndexBuilder({
      logger,
      searchEngine: testSearchEngine,
    });
  });

  describe('addCollator', () => {
    it('adds a collator', async () => {
      const testCollatorFactory = new TestDocumentCollatorFactory();
      const collatorSpy = jest.spyOn(testCollatorFactory, 'getCollator');

      // Add a collator.
      testIndexBuilder.addCollator({
        factory: testCollatorFactory,
        schedule: testScheduledTaskRunner,
      });

      // Build the index and ensure the collator was invoked.
      const { scheduler } = await testIndexBuilder.build();
      scheduler.start();
      expect(collatorSpy).toHaveBeenCalled();
    });
  });

  describe('addDecorator', () => {
    it('adds a decorator', async () => {
      const testCollatorFactory = new TestDocumentCollatorFactory();
      const testDecoratorFactory = new TestDocumentDecoratorFactory();
      const decoratorSpy = jest.spyOn(testDecoratorFactory, 'getDecorator');

      // Add a collator.
      testIndexBuilder.addCollator({
        factory: testCollatorFactory,
        schedule: testScheduledTaskRunner,
      });

      // Add a decorator.
      testIndexBuilder.addDecorator({
        factory: testDecoratorFactory,
      });

      // Build the index and ensure the decorator was invoked.
      const { scheduler } = await testIndexBuilder.build();
      scheduler.start();
      // wait for async decorator execution
      await Promise.resolve();
      expect(decoratorSpy).toHaveBeenCalled();
    });

    it('adds a type-specific decorator', async () => {
      const testCollatorFactory = new TypedDocumentCollatorFactory();
      const testDecoratorFactory = new TypedDocumentDecoratorFactory();
      jest.spyOn(testCollatorFactory, 'getCollator');
      const decoratorSpy = jest.spyOn(testDecoratorFactory, 'getDecorator');

      // Add a collator.
      testIndexBuilder.addCollator({
        factory: testCollatorFactory,
        schedule: testScheduledTaskRunner,
      });

      // Add a decorator for the same type.
      testIndexBuilder.addDecorator({
        factory: testDecoratorFactory,
      });

      // Build the index and ensure the decorator was invoked.
      const { scheduler } = await testIndexBuilder.build();
      scheduler.start();
      // wait for async decorator execution
      await Promise.resolve();
      expect(decoratorSpy).toHaveBeenCalled();
    });

    it('adds a type-specific decorator that should not be called', async () => {
      const testCollatorFactory = new TestDocumentCollatorFactory();
      const testDecoratorFactory =
        new DifferentlyTypedDocumentDecoratorFactory();
      const collatorSpy = jest.spyOn(testCollatorFactory, 'getCollator');
      const decoratorSpy = jest.spyOn(testDecoratorFactory, 'getDecorator');

      // Add a collator.
      testIndexBuilder.addCollator({
        factory: testCollatorFactory,
        schedule: testScheduledTaskRunner,
      });

      // Add a decorator for a different type.
      testIndexBuilder.addDecorator({
        factory: testDecoratorFactory,
      });

      // Build the index and ensure the decorator was not invoked.
      const { scheduler } = await testIndexBuilder.build();
      scheduler.start();
      expect(collatorSpy).toHaveBeenCalled();
      expect(decoratorSpy).not.toHaveBeenCalled();
    });
  });
});
