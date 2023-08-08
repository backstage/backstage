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

import {
  Entity,
  KubernetesValidatorFunctions,
  LocationEntityV1alpha1,
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  stringifyEntityRef,
  stringifyLocationRef,
} from '@backstage/catalog-model';
import { createHash } from 'crypto';
import { LocationSpec } from '@backstage/plugin-catalog-common';

/**
 * A standard way of producing a machine generated name for a location.
 *
 * @public
 */
export function locationSpecToMetadataName(location: LocationSpec) {
  const hash = createHash('sha1')
    .update(`${location.type}:${location.target}`)
    .digest('hex');
  return `generated-${hash}`;
}

/**
 * A standard way of producing a valid name for an entity in case repo name is invalid.
 *
 * @public
 * @param name - The current (or inferred) entity name
 * @param type - The type of Location for the entity (default: url)
 * @param target - The target/path for the entity (i.e. catalog-info url)
 */
export function repoNameToMetadataName(
  name: string,
  type: string = 'url',
  target: string,
) {
  if (KubernetesValidatorFunctions.isValidObjectName(name)) {
    return name;
  }

  let validName = name;
  const hashLength = 8;

  // force /^([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$/
  // remove invalid leading chars
  validName = validName.replace(/^[^A-Za-z0-9]/, '');
  // replace white space with -
  validName = validName.replace(/\s/, '-');
  // remove invalid inner chars
  validName = validName.replace(/[^-A-Za-z0-9_.]/, '');
  // remove invalid trailing chars
  validName = validName.replace(/[^A-Za-z0-9]$/, '');

  // force maxLength (63) - hashLength
  if (validName.length > 63) {
    validName = validName.substring(0, 63 - (hashLength + 1));
  }

  const hash = createHash('sha1').update(`${type}:${target}`).digest('hex');

  return `${validName}-${hash.substring(0, hashLength)}`;
}

/**
 * A standard way of producing a machine generated Location kind entity for a
 * location.
 *
 * @public
 */
export function locationSpecToLocationEntity(opts: {
  location: LocationSpec;
  parentEntity?: Entity;
}): LocationEntityV1alpha1 {
  const location = opts.location;
  const parentEntity = opts.parentEntity;

  let ownLocation: string;
  let originLocation: string;
  if (parentEntity) {
    const maybeOwnLocation =
      parentEntity.metadata.annotations?.[ANNOTATION_LOCATION];
    if (!maybeOwnLocation) {
      throw new Error(
        `Parent entity '${stringifyEntityRef(
          parentEntity,
        )}' of location '${stringifyLocationRef(
          location,
        )}' does not have a location annotation`,
      );
    }
    ownLocation = maybeOwnLocation;
    const maybeOriginLocation =
      parentEntity.metadata.annotations?.[ANNOTATION_ORIGIN_LOCATION];
    if (!maybeOriginLocation) {
      throw new Error(
        `Parent entity '${stringifyEntityRef(
          parentEntity,
        )}' of location '${stringifyLocationRef(
          location,
        )}' does not have an origin location annotation`,
      );
    }
    originLocation = maybeOriginLocation;
  } else {
    ownLocation = stringifyLocationRef(location);
    originLocation = ownLocation;
  }

  const result: LocationEntityV1alpha1 = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Location',
    metadata: {
      name: locationSpecToMetadataName(location),
      annotations: {
        [ANNOTATION_LOCATION]: ownLocation,
        [ANNOTATION_ORIGIN_LOCATION]: originLocation,
      },
    },
    spec: {
      type: location.type,
      target: location.target,
      presence: location.presence,
    },
  };

  return result;
}
