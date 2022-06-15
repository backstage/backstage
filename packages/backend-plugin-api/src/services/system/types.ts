/*
 * Copyright 2022 The Backstage Authors
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

/**
 * TODO
 *
 * @public
 */
export interface ServiceRef<T> {
  id: string;

  /**
   * Utility for getting the type of the service, using `typeof serviceRef.T`.
   * Attempting to actually read this value will result in an exception.
   */
  T: T;

  toString(): string;

  $$ref: 'service';
}

type TypesToServiceRef<T> = { [key in keyof T]: ServiceRef<T[key]> };
type DepsToDepFactories<T> = {
  [key in keyof T]: (pluginId: string) => Promise<T[key]>;
};

export type FactoryFunc<Impl> = (pluginId: string) => Promise<Impl>;

export type ServiceFactory<
  TApi,
  TImpl extends TApi,
  TDeps extends { [name in string]: unknown },
> = {
  service: ServiceRef<TApi>;
  deps: TypesToServiceRef<TDeps>;
  factory(deps: DepsToDepFactories<TDeps>): Promise<FactoryFunc<TImpl>>;
};

export type AnyServiceFactory = ServiceFactory<
  unknown,
  unknown,
  { [key in string]: unknown }
>;

export function createServiceRef<T>(options: { id: string }): ServiceRef<T> {
  return {
    id: options.id,
    get T(): T {
      throw new Error(`tried to read ServiceRef.T of ${this}`);
    },
    toString() {
      return `serviceRef{${options.id}}`;
    },
    $$ref: 'service', // TODO: declare
  };
}
