/*
 * Copyright 2021 Spotify AB
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
  DocumentCollator,
  DocumentDecorator,
  IndexableDocument,
} from '@backstage/search-common';
import { Registry } from './registry';

class TestDocumentCollator implements DocumentCollator {
  async execute() {
    return [];
  }
}

class TestDocumentDecorator implements DocumentDecorator {
  async execute(documents: IndexableDocument[]) {
    return documents;
  }
}

describe('search indexer external api', () => {
  let testRegistry: Registry;
  let testCollator: DocumentCollator;
  let testDecorator: DocumentDecorator;

  beforeEach(() => {
    testRegistry = new Registry();
    testCollator = new TestDocumentCollator();
    testDecorator = new TestDocumentDecorator();
  });

  describe('registerCollator', () => {
    it('registers a collator', async () => {
      const collatorSpy = jest.spyOn(testCollator, 'execute');

      // Register a collator.
      testRegistry.addCollator({
        type: 'anything',
        defaultRefreshIntervalSeconds: 600,
        collator: testCollator,
      });

      // Execute the registry and ensure the collator was invoked.
      await testRegistry.execute();
      expect(collatorSpy).toHaveBeenCalled();
    });
  });

  describe('registerDecorator', () => {
    it('registers a decorator', async () => {
      const decoratorSpy = jest.spyOn(testDecorator, 'execute');

      // Register a collator.
      testRegistry.addCollator({
        type: 'anything',
        defaultRefreshIntervalSeconds: 600,
        collator: testCollator,
      });

      // Register a decorator.
      testRegistry.addDecorator({
        decorator: testDecorator,
      });

      // Execute the registry and ensure the decorator was invoked.
      await testRegistry.execute();
      expect(decoratorSpy).toHaveBeenCalled();
    });

    it('registers a type-specific decorator', async () => {
      const expectedType = 'an-expected-type';
      const docFixture = {
        title: 'Test',
        text: 'Test text.',
        location: '/test/location',
      };
      jest
        .spyOn(testCollator, 'execute')
        .mockImplementation(async () => [docFixture]);
      const decoratorSpy = jest.spyOn(testDecorator, 'execute');

      // Register a collator.
      testRegistry.addCollator({
        type: expectedType,
        defaultRefreshIntervalSeconds: 600,
        collator: testCollator,
      });

      // Register a decorator for the same type.
      testRegistry.addDecorator({
        types: [expectedType],
        decorator: testDecorator,
      });

      // Execute the registry and ensure the decorator was invoked.
      await testRegistry.execute();
      expect(decoratorSpy).toHaveBeenCalled();
      expect(decoratorSpy).toHaveBeenCalledWith([docFixture]);
    });

    it('registers a type-specific decorator that should not be called', async () => {
      const expectedType = 'an-expected-type';
      const docFixture = {
        title: 'Test',
        text: 'Test text.',
        location: '/test/location',
      };
      jest
        .spyOn(testCollator, 'execute')
        .mockImplementation(async () => [docFixture]);
      const decoratorSpy = jest.spyOn(testDecorator, 'execute');

      // Register a collator.
      testRegistry.addCollator({
        type: expectedType,
        defaultRefreshIntervalSeconds: 600,
        collator: testCollator,
      });

      // Register a decorator for a different type.
      testRegistry.addDecorator({
        types: ['not-the-expected-type'],
        decorator: testDecorator,
      });

      // Execute the registry and ensure the decorator was not invoked.
      await testRegistry.execute();
      expect(decoratorSpy).not.toHaveBeenCalled();
    });
  });
});
