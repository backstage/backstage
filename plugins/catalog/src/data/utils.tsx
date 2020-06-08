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
import React from 'react';
import { Component } from './component';
import {
  Entity,
  Location,
  LOCATION_ANNOTATION,
  LocationSpec,
} from '@backstage/catalog-model';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { styled } from '@material-ui/core/styles';

const DescriptionWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
});

const createEditLink = (location: Location): string => {
  switch (location.type) {
    case 'github':
      return location.target.replace('/blob/', '/edit/');
    default:
      return location.target;
  }
};

export function entityToComponent(envelope: Entity): Component {
  const location = findLocationForEntity(envelope);
  return {
    name: envelope.metadata?.name ?? '',
    kind: envelope.kind ?? 'unknown',
    metadata: envelope.metadata,
    description: (
      <DescriptionWrapper>
        {envelope.metadata?.annotations?.description ?? 'placeholder'}
        {location?.target ? (
          <a href={createEditLink(location)}>
            <IconButton size="small">
              <Edit fontSize="small" />
            </IconButton>
          </a>
        ) : null}
      </DescriptionWrapper>
    ),
    location: findLocationForEntity(envelope),
  };
}

export function findLocationForEntity(
  entity: Entity,
): LocationSpec | undefined {
  const annotation = entity.metadata.annotations?.[LOCATION_ANNOTATION];
  if (!annotation) {
    return undefined;
  }

  const separatorIndex = annotation.indexOf(':');
  if (separatorIndex === -1) {
    return undefined;
  }

  return {
    type: annotation.substring(0, separatorIndex),
    target: annotation.substring(separatorIndex + 1),
  };
}
