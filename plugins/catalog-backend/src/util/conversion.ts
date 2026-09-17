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
  LocationEntityV1alpha1,
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  parseEntityRef,
  stringifyEntityRef,
  stringifyLocationRef,
} from '@backstage/catalog-model';
import { createHash } from 'node:crypto';
import { LocationSpec } from '@backstage/plugin-catalog-common';

export function locationSpecToMetadataName(location: LocationSpec) {
  const hash = createHash('sha1')
    .update(`${location.type}:${location.target}`)
    .digest('hex');
  return `generated-${hash}`;
}

/**
 * Computes the full entity ref for the Location kind entity corresponding to a
 * stored location row, e.g. `location:default/generated-<sha1hex>`.
 */
export function computeLocationEntityRef(type: string, target: string): string {
  return stringifyEntityRef({
    kind: 'Location',
    namespace: 'default',
    name: locationSpecToMetadataName({ type, target }),
  });
}

export function locationSpecToLocationEntity(opts: {
  location: LocationSpec;
  parentEntity?: Entity;
  /**
   * The pre-computed entity ref from the database, e.g.
   * `location:default/generated-<sha1hex>`. When provided the metadata name
   * is taken from the ref instead of being recomputed from the location spec.
   */
  locationEntityRef?: string;
}): LocationEntityV1alpha1 {
  const location = opts.location;
  const parentEntity = opts.parentEntity;

  const name = opts.locationEntityRef
    ? parseEntityRef(opts.locationEntityRef).name
    : locationSpecToMetadataName(location);

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
      name,
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
