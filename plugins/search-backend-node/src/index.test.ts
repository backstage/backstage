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

import { getVoidLogger } from '@backstage/backend-common';
import {
  DocumentCollator,
  DocumentDecorator,
  IndexableDocument,
} from '@backstage/search-common';
import { IndexBuilder } from './IndexBuilder';

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

describe('IndexBuilder', () => {
  let testIndexBuilder: IndexBuilder;
  let testCollator: DocumentCollator;
  let testDecorator: DocumentDecorator;

  beforeEach(() => {
    testIndexBuilder = new IndexBuilder({ logger: getVoidLogger() });
    testCollator = new TestDocumentCollator();
    testDecorator = new TestDocumentDecorator();
  });

  describe('addCollator', () => {
    it('adds a collator', async () => {
      const collatorSpy = jest.spyOn(testCollator, 'execute');

      // Add a collator.
      testIndexBuilder.addCollator({
        type: 'anything',
        defaultRefreshIntervalSeconds: 600,
        collator: testCollator,
      });

      // Build the index and ensure the collator was invoked.
      await testIndexBuilder.build();
      expect(collatorSpy).toHaveBeenCalled();
    });
  });

  describe('addDecorator', () => {
    it('adds a decorator', async () => {
      const decoratorSpy = jest.spyOn(testDecorator, 'execute');

      // Add a collator.
      testIndexBuilder.addCollator({
        type: 'anything',
        defaultRefreshIntervalSeconds: 600,
        collator: testCollator,
      });

      // Add a decorator.
      testIndexBuilder.addDecorator({
        decorator: testDecorator,
      });

      // Build the index and ensure the decorator was invoked.
      await testIndexBuilder.build();
      expect(decoratorSpy).toHaveBeenCalled();
    });

    it('adds a type-specific decorator', async () => {
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

      // Add a collator.
      testIndexBuilder.addCollator({
        type: expectedType,
        defaultRefreshIntervalSeconds: 600,
        collator: testCollator,
      });

      // Add a decorator for the same type.
      testIndexBuilder.addDecorator({
        types: [expectedType],
        decorator: testDecorator,
      });

      // Build the index and ensure the decorator was invoked.
      await testIndexBuilder.build();
      expect(decoratorSpy).toHaveBeenCalled();
      expect(decoratorSpy).toHaveBeenCalledWith([docFixture]);
    });

    it('adds a type-specific decorator that should not be called', async () => {
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

      // Add a collator.
      testIndexBuilder.addCollator({
        type: expectedType,
        defaultRefreshIntervalSeconds: 600,
        collator: testCollator,
      });

      // Add a decorator for a different type.
      testIndexBuilder.addDecorator({
        types: ['not-the-expected-type'],
        decorator: testDecorator,
      });

      // Build the index and ensure the decorator was not invoked.
      await testIndexBuilder.build();
      expect(decoratorSpy).not.toHaveBeenCalled();
    });
  });
});
