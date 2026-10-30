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

// A light-weight replacement for the `errorMessage` keyword of `ajv-errors`.
// This is a Backstage addition that is not part of `@rjsf/validator-cfworker`.
//
// Supported forms, matching `ajv-errors`:
//   errorMessage: 'message'                  - replaces every error in the schema
//   errorMessage: { pattern: 'message' }     - replaces errors for one keyword
//   errorMessage: { properties: { a: 'm' } } - replaces errors for one property
//   errorMessage: { items: ['m'] }           - replaces errors for one tuple item
//   errorMessage: { required: { a: 'm' } }   - replaces one required error
//   errorMessage: { _: 'message' }           - replaces all other errors
// Message templates such as `${/path}` are not supported.

import type { CFWorkerValidationError } from './types';

type SchemaNode = Record<string, any>;

interface Frame {
  node: SchemaNode;
  /** The number of keyword location segments that lead to this schema. */
  locationLength: number;
  /** The number of instance location segments that lead to this schema. */
  instanceDepth: number;
}

// Keywords that hold a single subschema
const SCHEMA_KEYWORDS = new Set([
  'additionalItems',
  'additionalProperties',
  'contains',
  'else',
  'if',
  'not',
  'propertyNames',
  'then',
  'unevaluatedItems',
  'unevaluatedProperties',
]);

// Keywords that hold a map or array of subschemas
const SCHEMA_MAP_KEYWORDS = new Set([
  '$defs',
  'allOf',
  'anyOf',
  'definitions',
  'dependencies',
  'dependentSchemas',
  'oneOf',
  'patternProperties',
  'prefixItems',
  'properties',
]);

// Keywords whose subschemas apply to a child of the instance
const CHILD_INSTANCE_KEYWORDS = new Set([
  'additionalItems',
  'additionalProperties',
  'items',
  'patternProperties',
  'prefixItems',
  'properties',
]);

function decodeSegment(segment: string) {
  return decodeURIComponent(segment).replace(/~1/g, '/').replace(/~0/g, '~');
}

function splitPointer(pointer: string): string[] {
  const trimmed = pointer.replace(/^#?\/?/, '');
  return trimmed ? trimmed.split('/').map(decodeSegment) : [];
}

function resolveRef(root: SchemaNode, ref: unknown): SchemaNode | undefined {
  if (typeof ref !== 'string' || !ref.startsWith('#')) {
    return undefined;
  }
  let node: any = root;
  for (const segment of splitPointer(ref)) {
    node = node?.[segment];
  }
  return node && typeof node === 'object' ? node : undefined;
}

/** Lists the schemas that an error was produced beneath, outermost first. */
function collectFrames(root: SchemaNode, keywordLocation: string[]): Frame[] {
  const frames: Frame[] = [{ node: root, locationLength: 0, instanceDepth: 0 }];
  let node = root;
  let instanceDepth = 0;
  let i = 0;
  while (i < keywordLocation.length) {
    const keyword = keywordLocation[i];
    let next: SchemaNode | undefined;
    if (keyword === '$ref') {
      next = resolveRef(root, node.$ref);
      i += 1;
    } else if (keyword === 'items' && !Array.isArray(node.items)) {
      next = node.items;
      i += 1;
    } else if (SCHEMA_KEYWORDS.has(keyword)) {
      next = node[keyword];
      i += 1;
    } else if (
      (keyword === 'items' || SCHEMA_MAP_KEYWORDS.has(keyword)) &&
      i + 1 < keywordLocation.length
    ) {
      next = node[keyword]?.[keywordLocation[i + 1]];
      i += 2;
    } else {
      break;
    }
    if (!next || typeof next !== 'object') {
      break;
    }
    if (CHILD_INSTANCE_KEYWORDS.has(keyword)) {
      instanceDepth += 1;
    }
    node = next;
    frames.push({ node, locationLength: i, instanceDepth });
  }
  return frames;
}

function missingPropertyOf(error: CFWorkerValidationError) {
  if (error.keyword !== 'required') {
    return undefined;
  }
  return error.error.match(/required property ["']([^"']+)["']/)?.[1];
}

function childLocation(instanceLocation: string, child: string) {
  return `${instanceLocation}/${child
    .replace(/~/g, '~0')
    .replace(/\//g, '~1')}`;
}

/** Finds the custom message that replaces an error, from the innermost schema that has one. */
function findReplacement(
  root: SchemaNode,
  error: CFWorkerValidationError,
):
  | { message: string; instanceLocation: string; keywordLocation: string }
  | undefined {
  const keywordLocation = splitPointer(error.keywordLocation);
  const instanceSegments = error.instanceLocation.split('/');
  const frames = collectFrames(root, keywordLocation);

  for (let f = frames.length - 1; f >= 0; f--) {
    const { node, locationLength, instanceDepth } = frames[f];
    const errorMessage = node.errorMessage;
    if (errorMessage === undefined) {
      continue;
    }
    const instanceLocation = instanceSegments
      .slice(0, instanceDepth + 1)
      .join('/');
    const location = `#${keywordLocation
      .slice(0, locationLength)
      .map(s => `/${s}`)
      .join('')}/errorMessage`;
    const [keyword, child] = keywordLocation.slice(locationLength);
    const missingProperty =
      locationLength === keywordLocation.length - 1
        ? missingPropertyOf(error)
        : undefined;
    const target = missingProperty
      ? childLocation(instanceLocation, missingProperty)
      : instanceLocation;

    if (typeof errorMessage === 'string') {
      return {
        message: errorMessage,
        instanceLocation: target,
        keywordLocation: location,
      };
    }
    if (!errorMessage || typeof errorMessage !== 'object') {
      continue;
    }

    let message: unknown;
    let messageLocation = target;
    if (keyword === 'properties' || keyword === 'items') {
      message = errorMessage[keyword]?.[child];
      messageLocation = childLocation(instanceLocation, child);
    } else if (keyword === 'required' && missingProperty) {
      const required = errorMessage.required;
      message =
        typeof required === 'object' ? required?.[missingProperty] : required;
    } else {
      message = errorMessage[keyword];
    }
    if (typeof message !== 'string') {
      message = errorMessage._;
      messageLocation = target;
    }
    if (typeof message === 'string') {
      return {
        message,
        instanceLocation: messageLocation,
        keywordLocation: location,
      };
    }
  }
  return undefined;
}

/** Replaces validation errors with the custom messages declared through the `errorMessage` keyword.
 *
 * @param errors - The cfworker errors, without summary errors
 * @param rootSchema - The schema that was validated against
 * @returns - The errors with custom messages applied, one per message and location
 */
export function applyErrorMessages(
  errors: CFWorkerValidationError[],
  rootSchema: unknown,
): CFWorkerValidationError[] {
  if (!rootSchema || typeof rootSchema !== 'object') {
    return errors;
  }
  const result: CFWorkerValidationError[] = [];
  const seen = new Set<string>();
  for (const error of errors) {
    const replacement = findReplacement(rootSchema as SchemaNode, error);
    if (!replacement) {
      result.push(error);
      continue;
    }
    const key = `${replacement.instanceLocation}\n${replacement.message}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({
        keyword: 'errorMessage',
        keywordLocation: replacement.keywordLocation,
        instanceLocation: replacement.instanceLocation,
        error: replacement.message,
      });
    }
  }
  return result;
}
