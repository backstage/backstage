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

export interface TimestampStore {
  save(date: Date): void;
  delete(): void;
  get(): Date | null;
}

export class DefaultTimestampStore implements TimestampStore {
  constructor(private readonly key: string) {}

  save(date: Date): void {
    localStorage.setItem(this.key, date.toJSON());
  }

  delete(): void {
    localStorage.removeItem(this.key);
  }

  get(): Date | null {
    const timestamp = localStorage.getItem(this.key);

    return timestamp !== null ? new Date(Date.parse(timestamp)) : null;
  }
}
