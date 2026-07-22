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
import { GoldenPathEntityV1beta1 } from '@backstage/plugin-golden-paths-common';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_SOURCE_LOCATION,
  CompoundEntityRef,
  Entity,
  parseLocationRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/catalog-client';
import { InputError, NotFoundError } from '@backstage/errors';

export function getEntityBaseUrl(entity: Entity): string | undefined {
  const location =
    entity.metadata.annotations?.[ANNOTATION_SOURCE_LOCATION] ||
    entity.metadata.annotations?.[ANNOTATION_LOCATION];

  if (!location) {
    return undefined;
  }

  const { type, target } = parseLocationRef(location);
  if (type === 'url') {
    return target;
  } else if (type === 'file') {
    return `file://${target}`;
  }

  // Only url and file location are handled, as we otherwise don't know if
  // what the url is pointing to makes sense to use as a baseUrl
  return undefined;
}

/**
 * Will use the provided CatalogApi to go find the given golden path entity with an additional token.
 * Returns the matching golden path, or throws a NotFoundError if no such golden path existed.
 */
export async function findGoldenPath(options: {
  entityRef: CompoundEntityRef;
  token?: string;
  catalogApi: CatalogApi;
}): Promise<GoldenPathEntityV1beta1> {
  const { entityRef, token, catalogApi } = options;

  if (entityRef.kind.toLocaleLowerCase('en-US') !== 'goldenpath') {
    throw new InputError(`Invalid kind, only 'GoldenPath' kind is supported`);
  }

  const goldenPath = await catalogApi.getEntityByRef(entityRef, { token });

  if (!goldenPath) {
    throw new NotFoundError(
      `GoldenPath ${stringifyEntityRef(entityRef)} not found`,
    );
  }

  return goldenPath as GoldenPathEntityV1beta1;
}

/**
 * Takes a single unknown parameter and makes sure that it's a single string or
 * an array of strings, and returns as an array.
 */
export function parseStringsParam(
  param: unknown,
  paramName: string,
): string[] | undefined {
  if (param === undefined) {
    return undefined;
  }

  const array = [param].flat();
  if (array.some(p => typeof p !== 'string')) {
    throw new InputError(
      `Invalid ${paramName}, not a string or array of strings`,
    );
  }

  return array as string[];
}

export function parseNumberParam(
  param: unknown,
  paramName: string,
): number[] | undefined {
  return parseStringsParam(param, paramName)?.map(val => {
    const ret = Number.parseInt(val, 10);
    if (isNaN(ret)) {
      throw new InputError(
        `Invalid ${paramName} parameter "${val}", expected a number or array of numbers`,
      );
    }
    return ret;
  });
}

export function flattenParams<T>(...params: (undefined | T | T[])[]): T[] {
  return [...params].flat().filter(Boolean) as T[];
}
