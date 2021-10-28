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

import ZenObservable from 'zen-observable';
import { Observable, Observer, Subscription } from './observable';

describe('observable', () => {
  it('works in conjunction with zen-observables', () => {
    // Use ZenObservable as the concrete implementation, but use our types in
    // all other possible places in the code
    const observable: Observable<string> = new ZenObservable<string>(
      (subscriber: Observer<string>) => {
        subscriber.next!('a');
        subscriber.error!(new Error('e'));
        subscriber.complete!();
      },
    );

    const subscription: Subscription = observable.subscribe(
      _value => {},
      _error => {},
      () => {},
    );

    subscription.unsubscribe();

    expect(true).toBe(true);
  });
});
