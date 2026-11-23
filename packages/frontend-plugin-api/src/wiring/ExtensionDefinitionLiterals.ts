/*
 * Copyright 2026 The Backstage Authors
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

import { ExtensionBlueprintParams } from './createExtensionBlueprint';

/**
 * The values of an extension definition that are known statically, captured
 * from the literal values passed when the extension was created.
 *
 * @remarks
 *
 * This only exists at the type level and is never present at runtime. It lets
 * tools read what an extension declares from the emitted type declarations of
 * a package, without running the package code.
 *
 * Only literal values are captured. A value that was passed but is not a
 * literal, such as a variable of type `string`, is recorded as its wider type,
 * so that tools can tell it apart from a value that was not passed.
 *
 * @public
 */
export type ExtensionDefinitionLiterals = {
  /**
   * The identity of the blueprint that the extension was made with, if the
   * blueprint declares one.
   */
  blueprint?: string;
  /**
   * The params that were passed as string, number or boolean literals.
   */
  params?: object;
  /**
   * The names of all params that were passed, literal or not.
   */
  paramKeys?: string;
  /**
   * The literal values that a blueprint with a params callback records for
   * the params that were passed to the callback.
   */
  paramsCallback?: unknown;
  /**
   * The attachment point, if it was given as an ID or relative attachment
   * point rather than as a reference to the input of another extension.
   */
  attachTo?: unknown;
  disabled?: boolean;
  if?: unknown;
};

/**
 * Whether a type is a single string, number or boolean literal.
 *
 * @ignore
 */
type IsPrimitiveLiteral<V> = [V] extends [string]
  ? string extends V
    ? false
    : true
  : [V] extends [number]
  ? number extends V
    ? false
    : true
  : [V] extends [boolean]
  ? boolean extends V
    ? false
    : true
  : false;

/**
 * Picks the properties of the params of an extension that are primitive
 * literals.
 *
 * @ignore
 */
export type PickLiteralParams<TParams> = TParams extends object
  ? {
      -readonly [K in keyof TParams as IsPrimitiveLiteral<
        TParams[K]
      > extends true
        ? K
        : never]: TParams[K];
    }
  : {};

/**
 * Keeps the attachment point if it is given as a literal ID or relative
 * attachment point. An attachment point that was passed in any other form is
 * recorded as `unknown`.
 *
 * @ignore
 */
export type PickLiteralAttachTo<TAttachTo> = [TAttachTo] extends [undefined]
  ? undefined
  : TAttachTo extends {
      id: string;
      input: string;
    }
  ? IsPrimitiveLiteral<TAttachTo['id']> extends true
    ? IsPrimitiveLiteral<TAttachTo['input']> extends true
      ? { id: TAttachTo['id']; input: TAttachTo['input'] }
      : unknown
    : unknown
  : TAttachTo extends {
      relative: infer IRelative extends { kind?: string; name?: string };
      input: string;
    }
  ? IsPrimitiveLiteral<TAttachTo['input']> extends true
    ? {
        relative: { -readonly [K in keyof IRelative]: IRelative[K] };
        input: TAttachTo['input'];
      }
    : unknown
  : unknown;

/**
 * The literals that a params callback recorded through the second type
 * argument of {@link ExtensionBlueprintParams}.
 *
 * @ignore
 */
export type PickCallbackLiterals<TParamsInput> = TParamsInput extends (
  ...args: any[]
) => infer IReturn
  ? IReturn extends ExtensionBlueprintParams<any, infer ILiterals>
    ? ILiterals
    : undefined
  : undefined;
