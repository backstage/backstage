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

import {
  SchedulerServiceTaskRunner,
  SchedulerServiceTaskInvocationDefinition,
} from '@backstage/backend-plugin-api';
import {
  DocumentCollatorFactory,
  DocumentDecoratorFactory,
} from '@backstage/plugin-search-common';
import { Readable, Transform } from 'node:stream';
import { IndexBuilder } from './IndexBuilder';
import { LunrSearchEngine, SearchEngine } from './index';
import { mockServices } from '@backstage/backend-test-utils';

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
  let testScheduledTaskRunner: SchedulerServiceTaskRunner;

  beforeEach(() => {
    const logger = mockServices.logger.mock();
    testScheduledTaskRunner = {
      run: async (
        task: SchedulerServiceTaskInvocationDefinition & {
          fn: (signal: AbortSignal) => void;
        },
      ) => {
        task.fn(new AbortController().signal);
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

  describe('abort signal', () => {
    it('stops the pipeline when aborted and does not start when already aborted', async () => {
      const testCollatorFactory = new TestDocumentCollatorFactory();
      const collator = await testCollatorFactory.getCollator();
      const collatorSpy = jest
        .spyOn(testCollatorFactory, 'getCollator')
        .mockResolvedValue(collator);

      let runTask: (
        signal: AbortSignal,
      ) => void | Promise<void> = async () => {};
      testIndexBuilder.addCollator({
        factory: testCollatorFactory,
        schedule: {
          run: async task => {
            runTask = task.fn;
          },
        },
      });
      const { scheduler } = await testIndexBuilder.build();
      scheduler.start();

      const controller = new AbortController();
      const running = runTask(controller.signal);
      await new Promise(resolve => setImmediate(resolve));
      expect(collatorSpy).toHaveBeenCalledTimes(1);
      expect(collator.destroyed).toBe(false);

      controller.abort();
      await expect(running).rejects.toMatchObject({ name: 'AbortError' });
      expect(collator.destroyed).toBe(true);

      await expect(runTask(AbortSignal.abort())).rejects.toMatchObject({
        name: 'AbortError',
      });
      expect(collatorSpy).toHaveBeenCalledTimes(1);
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
