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
import { Entity, Location } from '@backstage/catalog-model';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { styled } from '@material-ui/core/styles';
import { LOCATION_ANNOTATION } from '../../../../packages/catalog-model/src/location/annotation';

const DescriptionWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
});

const createEditLink = (url: string): string => url.replace('blob', 'edit');

export function entityToComponent(
  envelope: Entity,
  location?: Location,
): Component {
  return {
    name: envelope.metadata?.name ?? '',
    kind: envelope.kind ?? 'unknown',
    description: (
      <DescriptionWrapper>
        {envelope.metadata?.annotations?.description ?? 'placeholder'}
        {location?.target ? (
          <a href={createEditLink(location?.target)}>
            <IconButton size="small">
              <Edit fontSize="small" />
            </IconButton>
          </a>
        ) : null}
      </DescriptionWrapper>
    ),
    location,
  };
}

export function findLocationForEntity(
  entity: Entity,
  locations: Location[],
): Location | undefined {
  for (const loc of locations) {
    if (loc.id === entity.metadata.annotations?.[LOCATION_ANNOTATION]) {
      return loc;
    }
  }
  return undefined;
}
