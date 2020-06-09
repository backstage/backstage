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

import { BehaviorSubject } from '../../../lib';
import { Observable } from '../../../types';

export class ObservableSession<T> {
  private session: T | undefined;
  private readonly subject = new BehaviorSubject<T | undefined>(undefined);

  session$(): Observable<T | undefined> {
    return this.subject;
  }

  getSession(): T | undefined {
    return this.session;
  }

  setSession(session?: T): void {
    this.session = session;
    this.subject.next(session);
  }
}
