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

import { registerCollator, registerDecorator } from './';
import { Registry } from './registry';

describe('external api', () => {
  afterEach(() => {
    Registry.getInstance()._reset();
  });

  describe('registerCollator', () => {
    it('registers a collator', async () => {
      const collatorSpy = jest.fn(async () => []);

      // Register a collator.
      registerCollator({
        type: 'anything',
        defaultRefreshIntervalSeconds: 600,
        collator: collatorSpy,
      });

      // Execute the registry and ensure the collator was invoked.
      await Registry.getInstance().execute();
      expect(collatorSpy).toHaveBeenCalled();
    });
  });

  describe('registerDecorator', () => {
    it('registers a decorator', async () => {
      const mockCollator = jest.fn(async () => []);
      const decoratorSpy = jest.fn(async docs => docs);

      // Register a collator.
      registerCollator({
        type: 'anything',
        defaultRefreshIntervalSeconds: 600,
        collator: mockCollator,
      });

      // Register a decorator.
      registerDecorator({
        decorator: decoratorSpy,
      });

      // Execute the registry and ensure the decorator was invoked.
      await Registry.getInstance().execute();
      expect(decoratorSpy).toHaveBeenCalled();
    });

    it('registers a type-specific decorator', async () => {
      const expectedType = 'an-expected-type';
      const docFixture = {
        title: 'Test',
        text: 'Test text.',
        location: '/test/location',
      };
      const mockCollator = jest.fn(async () => [docFixture]);
      const decoratorSpy = jest.fn(async docs => docs);

      // Register a collator.
      registerCollator({
        type: expectedType,
        defaultRefreshIntervalSeconds: 600,
        collator: mockCollator,
      });

      // Register a decorator for the same type.
      registerDecorator({
        types: [expectedType],
        decorator: decoratorSpy,
      });

      // Execute the registry and ensure the decorator was invoked.
      await Registry.getInstance().execute();
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
      const mockCollator = jest.fn(async () => [docFixture]);
      const decoratorSpy = jest.fn(async docs => docs);

      // Register a collator.
      registerCollator({
        type: expectedType,
        defaultRefreshIntervalSeconds: 600,
        collator: mockCollator,
      });

      // Register a decorator for a different type.
      registerDecorator({
        types: ['not-the-expected-type'],
        decorator: decoratorSpy,
      });

      // Execute the registry and ensure the decorator was not invoked.
      await Registry.getInstance().execute();
      expect(decoratorSpy).not.toHaveBeenCalled();
    });
  });
});
