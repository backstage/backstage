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

/**
 * This utilizes an experimental TypeScript feature called decorators.
 * This was originally added to allow us to expose a FeatureFlags API
 * with static methods (for backwards compatibility primarily). It takes
 * an existing interface and applies the types to static methods in classes.
 *
 * @see https://www.typescriptlang.org/docs/handbook/decorators.html
 * @example
 *    interface StaticProps {
 *      append(name: string, extra: string): string;
 *      reverse(name: string): string;
 *    }
 *
 *    @staticImplements<StaticProps>()
 *    class StaticPropsClass {
 *      static append(name, extra) {
 *        return `${name}${extra}`;
 *      }
 *
 *      static reverse(name) {
 *        return name.reverse();
 *      }
 *    }
 */
export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}
