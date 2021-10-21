/*
 * Copyright 2020 The Backstage Authors
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
  Observer as CoreObserver,
  Subscription as CoreSubscription,
  Observable as CoreObservable,
} from '@backstage/core-types';

/**
 * Observer interface for consuming an Observer, see TC39.
 *
 * @deprecated Please use the same type from `@backstage/core-types` instead
 */
export type Observer<T> = CoreObserver<T>;

/**
 * Subscription returned when subscribing to an Observable, see TC39.
 *
 * @deprecated Please use the same type from `@backstage/core-types` instead
 */
export type Subscription = CoreSubscription;

/**
 * Observable sequence of values and errors, see TC39.
 *
 * https://github.com/tc39/proposal-observable
 *
 * This is used as a common return type for observable values and can be created
 * using many different observable implementations, such as zen-observable or RxJS 5.
 *
 * @deprecated Please use the same type from `@backstage/core-types` instead
 */
export type Observable<T> = CoreObservable<T>;
