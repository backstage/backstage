/*
 * Copyright 2023 The Backstage Authors
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

import { DefaultTimestampStore, TimestampStore } from './timestampStore';

describe('DefaultTimestampStore', () => {
  let timestampStore: TimestampStore;
  const key = 'test-key';
  const date = new Date();

  beforeEach(() => {
    timestampStore = new DefaultTimestampStore(key);
    // Clear the mock storage before each test
    localStorage.clear();
  });

  it('should save the date into the localStorage', () => {
    timestampStore.save(date);
    expect(localStorage.setItem).toHaveBeenCalledWith(key, date.toJSON());
    expect(localStorage.__STORE__[key]).toBe(date.toJSON());
  });

  it('should get the date from the localStorage', () => {
    localStorage.setItem(key, date.toJSON());
    const retrievedDate = timestampStore.get();
    expect(localStorage.getItem).toHaveBeenCalledWith(key);
    expect(retrievedDate).toEqual(date);
  });

  it('should return null if no date is set in the localStorage', () => {
    const retrievedDate = timestampStore.get();
    expect(localStorage.getItem).toHaveBeenCalledWith(key);
    expect(retrievedDate).toBeNull();
  });

  it('should delete the date from the localStorage', () => {
    localStorage.setItem(key, date.toJSON());
    timestampStore.delete();
    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
    expect(localStorage.__STORE__[key]).toBeUndefined();
  });
});
