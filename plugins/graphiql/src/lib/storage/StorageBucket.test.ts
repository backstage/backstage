/*
 * Copyright 2020 Spotify AB
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

import { StorageBucket } from './StorageBucket';

describe('StorageBucket', () => {
  it('should forbid access to unknown keys', () => {
    const bucket = StorageBucket.forStorage(localStorage, 'hello');

    expect(() => {
      bucket['dunno-this-one'] = 'nope';
    }).toThrow('Direct property access is not allowed for StorageBuckets');
    expect(() => {
      return bucket['dunno-this-one'];
    }).toThrow('Direct property access is not allowed for StorageBuckets');
  });

  describe('with mocked underlying storage', () => {
    const mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    const bucket = StorageBucket.forStorage(
      (mockStorage as unknown) as Storage,
      'my-bucket',
    );

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should set a first item', () => {
      bucket.setItem('x', 'a');

      expect(mockStorage.getItem).toHaveBeenCalledTimes(1);
      expect(mockStorage.getItem).toHaveBeenLastCalledWith('my-bucket');
      expect(mockStorage.setItem).toHaveBeenCalledTimes(1);
      expect(mockStorage.setItem).toHaveBeenLastCalledWith(
        'my-bucket',
        JSON.stringify({ x: 'a' }),
      );
      expect(mockStorage.removeItem).toHaveBeenCalledTimes(0);
    });

    it('should set a second item', () => {
      mockStorage.getItem.mockReturnValueOnce(JSON.stringify({ y: 'b' }));
      bucket.setItem('x', 'a');

      expect(mockStorage.getItem).toHaveBeenCalledTimes(1);
      expect(mockStorage.getItem).toHaveBeenLastCalledWith('my-bucket');
      expect(mockStorage.setItem).toHaveBeenCalledTimes(1);
      expect(mockStorage.setItem).toHaveBeenLastCalledWith(
        'my-bucket',
        JSON.stringify({ y: 'b', x: 'a' }),
      );
      expect(mockStorage.removeItem).toHaveBeenCalledTimes(0);
    });

    it('should clear the bucket', () => {
      bucket.clear();

      expect(mockStorage.getItem).toHaveBeenCalledTimes(0);
      expect(mockStorage.setItem).toHaveBeenCalledTimes(0);
      expect(mockStorage.removeItem).toHaveBeenCalledTimes(1);
      expect(mockStorage.removeItem).toHaveBeenLastCalledWith('my-bucket');
    });

    it('should get an item', () => {
      mockStorage.getItem.mockReturnValueOnce(JSON.stringify({ x: 'X' }));
      expect(bucket.getItem('x')).toBe('X');

      expect(mockStorage.getItem).toHaveBeenCalledTimes(1);
      expect(mockStorage.getItem).toHaveBeenLastCalledWith('my-bucket');
      expect(mockStorage.setItem).toHaveBeenCalledTimes(0);
      expect(mockStorage.removeItem).toHaveBeenCalledTimes(0);
    });
  });
});
