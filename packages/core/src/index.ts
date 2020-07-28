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

export * from '@backstage/core-api';

export * from './api-wrappers';
export * from './components';
export * from './layout';
export class ExtensionPoint<T> {
  get T(): T {
    throw new Error('Dont use T');
  }
  constructor(public type: string) {}
}

const extensions = new Map<ExtensionPoint<unknown>, Set<unknown>>();

export function registerExtension<T extends ExtensionPoint<any>>(
  extensionPoint: T,
  extension: T extends ExtensionPoint<infer X> ? X : never,
): void {
  if (!extensions.has(extensionPoint)) {
    extensions.set(extensionPoint, new Set<T>());
  }
  extensions.get(extensionPoint)?.add(extension);
}

export function useExtension<T extends ExtensionPoint<any>>(
  extensionPoint: T,
): Array<T extends ExtensionPoint<infer X> ? X : never> {
  return Array.from(extensions.get(extensionPoint)?.values() ?? []) as any;
}
