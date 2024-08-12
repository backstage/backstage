/*
 * Copyright 2024 The Backstage Authors
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

import { AppNode } from '../apis';
import { Expand } from '../types';
import { ResolvedExtensionInput } from './createExtension';
import {
  ExtensionDataContainer,
  createExtensionDataContainer,
} from './createExtensionDataContainer';
import {
  AnyExtensionDataRef,
  ExtensionDataRefToValue,
  ExtensionDataValue,
} from './createExtensionDataRef';
import { ExtensionInput } from './createExtensionInput';

/** @public */
export type ResolveInputValueOverrides<
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  } = {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
> = Expand<
  {
    [KName in keyof TInputs as TInputs[KName] extends ExtensionInput<
      any,
      {
        optional: infer IOptional extends boolean;
        singleton: boolean;
      }
    >
      ? IOptional extends true
        ? never
        : KName
      : never]: TInputs[KName] extends ExtensionInput<
      infer IDataRefs,
      { optional: boolean; singleton: infer ISingleton extends boolean }
    >
      ? ISingleton extends true
        ? Iterable<ExtensionDataRefToValue<IDataRefs>>
        : Array<Iterable<ExtensionDataRefToValue<IDataRefs>>>
      : never;
  } & {
    [KName in keyof TInputs as TInputs[KName] extends ExtensionInput<
      any,
      {
        optional: infer IOptional extends boolean;
        singleton: boolean;
      }
    >
      ? IOptional extends true
        ? KName
        : never
      : never]?: TInputs[KName] extends ExtensionInput<
      infer IDataRefs,
      { optional: boolean; singleton: infer ISingleton extends boolean }
    >
      ? ISingleton extends true
        ? Iterable<ExtensionDataRefToValue<IDataRefs>>
        : Array<Iterable<ExtensionDataRefToValue<IDataRefs>>>
      : never;
  }
>;

function expectArray<T>(value: T | T[]): T[] {
  return value as T[];
}
function expectItem<T>(value: T | T[]): T {
  return value as T;
}

/** @internal */
export function resolveInputOverrides(
  declaredInputs?: {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
  inputs?: {
    [KName in string]?:
      | ({ node: AppNode } & ExtensionDataContainer<any>)
      | Array<{ node: AppNode } & ExtensionDataContainer<any>>;
  },
  inputOverrides?: ResolveInputValueOverrides,
) {
  if (!declaredInputs || !inputs || !inputOverrides) {
    return inputs;
  }

  const newInputs: typeof inputs = {};
  for (const name in declaredInputs) {
    if (!Object.hasOwn(declaredInputs, name)) {
      continue;
    }
    const declaredInput = declaredInputs[name];
    const providedData = inputOverrides[name];
    if (declaredInput.config.singleton) {
      const originalInput = expectItem(inputs[name]);
      if (providedData) {
        const providedContainer = createExtensionDataContainer(
          providedData as Iterable<ExtensionDataValue<any, any>>,
          declaredInput.extensionData,
        );
        if (!originalInput) {
          throw new Error(
            `attempted to override data of input '${name}' but it is not present in the original inputs`,
          );
        }
        newInputs[name] = Object.assign(providedContainer, {
          name: (originalInput as ResolvedExtensionInput<any>).node,
        }) as any;
      }
    } else {
      const originalInput = expectArray(inputs[name]);
      if (!Array.isArray(providedData)) {
        throw new Error(
          `override data provided for input '${name}' must be an array`,
        );
      }
      if (
        originalInput.length !== providedData.length &&
        providedData.length > 0
      ) {
        throw new Error(
          `override data provided for input '${name}' must match the length of the original inputs`,
        );
      }
      newInputs[name] = providedData.map((data, i) => {
        const providedContainer = createExtensionDataContainer(
          data as Iterable<ExtensionDataValue<any, any>>,
          declaredInput.extensionData,
        );
        return Object.assign(providedContainer, {
          name: (originalInput[i] as ResolvedExtensionInput<any>).node,
        }) as any;
      });
    }
  }
  return newInputs;
}
