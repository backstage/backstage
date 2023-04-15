/*
 * Copyright 2023 The Backstage Authors
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

import { IconComponent } from '@backstage/core-plugin-api';
import { defaultEntityPresentation } from '@backstage/plugin-catalog-react';
import { HumanDuration } from '@backstage/types';
import ApartmentIcon from '@material-ui/icons/Apartment';
import BusinessIcon from '@material-ui/icons/Business';
import ExtensionIcon from '@material-ui/icons/Extension';
import HelpIcon from '@material-ui/icons/Help';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MemoryIcon from '@material-ui/icons/Memory';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import { DefaultEntityPresentationApiRenderer } from './DefaultEntityPresentationApi';

export const DEFAULT_CACHE_TTL: HumanDuration = { seconds: 30 };

export const DEFAULT_BATCH_DELAY: HumanDuration = { milliseconds: 50 };

export const DEFAULT_ENTITY_FIELDS: string[] = [
  'apiVersion',
  'kind',
  'metadata.uid',
  'metadata.etag',
  'metadata.name',
  'metadata.namespace',
  'metadata.title',
  'metadata.description',
  'spec.type',
  'spec.profile',
];

export const UNKNOWN_KIND_ICON: IconComponent = HelpIcon;

export const DEFAULT_ICONS: Record<string, IconComponent> = {
  api: ExtensionIcon,
  component: MemoryIcon,
  system: BusinessIcon,
  domain: ApartmentIcon,
  location: LocationOnIcon,
  user: PersonIcon,
  group: PeopleIcon,
  template: LibraryAddIcon,
};

export function createDefaultRenderer(options: {
  async: boolean;
}): DefaultEntityPresentationApiRenderer {
  return {
    async: options.async,

    render: ({ entityRef, entity, context }) => {
      const presentation = defaultEntityPresentation(
        entity || entityRef,
        context,
      );
      return {
        snapshot: presentation,
        loadEntity: options.async,
      };
    },
  };
}
