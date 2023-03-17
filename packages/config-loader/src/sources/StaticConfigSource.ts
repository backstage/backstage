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

import { JsonObject, Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';
import { ConfigSource, ConfigSourceData } from './types';

export class StaticConfigSource implements ConfigSource {
  static create(options: {
    data: JsonObject | Observable<JsonObject> | Promise<JsonObject>;
    context?: string;
  }): ConfigSource {
    const { data, context = 'static-config' } = options;
    if (!data) {
      return new StaticConfigSource(ObservableImpl.of({}), context);
    }

    if ('subscribe' in data && typeof data.subscribe === 'function') {
      return new StaticConfigSource(
        ObservableImpl.from(data as Observable<JsonObject>),
        context,
      );
    }
    if ('then' in data && typeof data.then === 'function') {
      return new StaticConfigSource(
        new ObservableImpl(subscriber => {
          (data as Promise<JsonObject>).then(
            value => subscriber.next(value),
            error => subscriber.error(error),
          );
          return () => {};
        }),
        context,
      );
    }

    return new StaticConfigSource(
      ObservableImpl.of(data as JsonObject),
      context,
    );
  }

  readonly data$: Observable<ConfigSourceData[]>;

  private constructor(observable: ObservableImpl<JsonObject>, context: string) {
    this.data$ = observable.map(data => [{ context, data }]);
  }
}
