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

import { Entity, stringifyEntityRef } from '../entity';
import { ANNOTATION_LOCATION, ANNOTATION_SOURCE_LOCATION } from './annotation';

/**
 * Parses a string form location reference.
 *
 * @public
 * @param ref - A string-form location ref, e.g. `'url:https://host'`
 * @returns A location ref, e.g. `{ type: 'url', target: 'https://host' }`
 */
export function parseLocationRef(ref: string): {
  type: string;
  target: string;
} {
  if (typeof ref !== 'string') {
    throw new TypeError(
      `Unable to parse location ref '${ref}', unexpected argument ${typeof ref}`,
    );
  }

  const splitIndex = ref.indexOf(':');
  if (splitIndex < 0) {
    throw new TypeError(
      `Unable to parse location ref '${ref}', expected '<type>:<target>', e.g. 'url:https://host/path'`,
    );
  }

  const type = ref.substring(0, splitIndex).trim();
  const target = ref.substring(splitIndex + 1).trim();

  if (!type || !target) {
    throw new TypeError(
      `Unable to parse location ref '${ref}', expected '<type>:<target>', e.g. 'url:https://host/path'`,
    );
  }

  if (type === 'http' || type === 'https') {
    throw new TypeError(
      `Invalid location ref '${ref}', please prefix it with 'url:', e.g. 'url:${ref}'`,
    );
  }

  return { type, target };
}

/**
 * Turns a location ref into its string form.
 *
 * @public
 * @param ref - A location ref, e.g. `{ type: 'url', target: 'https://host' }`
 * @returns A string-form location ref, e.g. `'url:https://host'`
 */
export function stringifyLocationRef(ref: {
  type: string;
  target: string;
}): string {
  const { type, target } = ref;

  if (!type) {
    throw new TypeError(`Unable to stringify location ref, empty type`);
  } else if (!target) {
    throw new TypeError(`Unable to stringify location ref, empty target`);
  }

  return `${type}:${target}`;
}

/**
 * Returns the source code location of the Entity, to the extent that one exists.
 *
 * @remarks
 *
 * If the returned location type is of type 'url', the target should be readable at least
 * using the UrlReader from `@backstage/backend-common`. If it is not of type 'url', the caller
 * needs to have explicit handling of each location type or signal that it is not supported.
 *
 * @public
 */
export function getEntitySourceLocation(entity: Entity): {
  type: string;
  target: string;
} {
  const locationRef =
    entity.metadata?.annotations?.[ANNOTATION_SOURCE_LOCATION] ??
    entity.metadata?.annotations?.[ANNOTATION_LOCATION];

  if (!locationRef) {
    throw new Error(
      `Entity '${stringifyEntityRef(entity)}' is missing location`,
    );
  }

  return parseLocationRef(locationRef);
}
