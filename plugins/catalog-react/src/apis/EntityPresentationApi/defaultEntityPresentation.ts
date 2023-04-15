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

import {
  CompoundEntityRef,
  DEFAULT_NAMESPACE,
  Entity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { IconComponent } from '@backstage/core-plugin-api';
import ApartmentIcon from '@material-ui/icons/Apartment';
import BusinessIcon from '@material-ui/icons/Business';
import ExtensionIcon from '@material-ui/icons/Extension';
import HelpIcon from '@material-ui/icons/Help';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MemoryIcon from '@material-ui/icons/Memory';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import get from 'lodash/get';
import { EntityRefPresentationSnapshot } from './EntityPresentationApi';

const UNKNOWN_KIND_ICON: IconComponent = HelpIcon;

const DEFAULT_ICONS: Record<string, IconComponent> = {
  api: ExtensionIcon,
  component: MemoryIcon,
  system: BusinessIcon,
  domain: ApartmentIcon,
  location: LocationOnIcon,
  user: PersonIcon,
  group: PeopleIcon,
  template: LibraryAddIcon,
};

/**
 * This returns the default representation of an entity.
 *
 * @public
 * @param entityOrRef - Either an entity, or a ref to it.
 * @param context - Contextual information that may affect the presentation.
 */
export function defaultEntityPresentation(
  entityOrRef: Entity | CompoundEntityRef | string,
  context?: {
    defaultKind?: string;
    defaultNamespace?: string;
  },
): EntityRefPresentationSnapshot {
  // NOTE(freben): This code may look convoluted, but it tries its very best to
  // be defensive and handling any type of malformed input and still producing
  // some form of result without crashing.
  const { kind, namespace, name, title, description, displayName, type } =
    getParts(entityOrRef);

  const Icon =
    (kind && DEFAULT_ICONS[kind.toLocaleLowerCase('en-US')]) ||
    UNKNOWN_KIND_ICON;

  const entity: Entity | undefined =
    typeof entityOrRef === 'object' &&
    entityOrRef !== null &&
    'metadata' in entityOrRef
      ? entityOrRef
      : undefined;

  const entityRef: string = stringifyEntityRef({
    kind: kind || 'unknown',
    namespace: namespace || DEFAULT_NAMESPACE,
    name: name || 'unknown',
  });

  const shortRef = getShortRef({ kind, namespace, name, context });

  const primary = [displayName, title, shortRef].filter(
    candidate => candidate && typeof candidate === 'string',
  )[0]!;

  const secondary = [
    primary !== entityRef ? entityRef : undefined,
    type,
    description,
  ]
    .filter(candidate => candidate && typeof candidate === 'string')
    .join(' | ');

  return {
    entity,
    entityRef,
    primaryTitle: primary,
    secondaryTitle: secondary || undefined,
    Icon,
  };
}

// Try to extract display-worthy parts of an entity or ref as best we can, without throwing
function getParts(entityOrRef: Entity | CompoundEntityRef | string): {
  kind?: string;
  namespace?: string;
  name?: string;
  title?: string;
  description?: string;
  displayName?: string;
  type?: string;
} {
  if (typeof entityOrRef === 'string') {
    let colonI = entityOrRef.indexOf(':');
    const slashI = entityOrRef.indexOf('/');

    // If the / is ahead of the :, treat the rest as the name
    if (slashI !== -1 && slashI < colonI) {
      colonI = -1;
    }

    const kind = colonI === -1 ? undefined : entityOrRef.slice(0, colonI);
    const namespace =
      slashI === -1 ? undefined : entityOrRef.slice(colonI + 1, slashI);
    const name = entityOrRef.slice(Math.max(colonI + 1, slashI + 1));

    return { kind, namespace, name };
  }

  if (typeof entityOrRef === 'object' && entityOrRef !== null) {
    const kind = [get(entityOrRef, 'kind')].filter(
      candidate => candidate && typeof candidate === 'string',
    )[0];

    const namespace = [
      get(entityOrRef, 'metadata.namespace'),
      get(entityOrRef, 'namespace'),
    ].filter(candidate => candidate && typeof candidate === 'string')[0];

    const name = [
      get(entityOrRef, 'metadata.name'),
      get(entityOrRef, 'name'),
    ].filter(candidate => candidate && typeof candidate === 'string')[0];

    const title = [get(entityOrRef, 'metadata.title')].filter(
      candidate => candidate && typeof candidate === 'string',
    )[0];

    const description = [get(entityOrRef, 'metadata.description')].filter(
      candidate => candidate && typeof candidate === 'string',
    )[0];

    const displayName = [get(entityOrRef, 'spec.profile.displayName')].filter(
      candidate => candidate && typeof candidate === 'string',
    )[0];

    const type = [get(entityOrRef, 'spec.type')].filter(
      candidate => candidate && typeof candidate === 'string',
    )[0];

    return { kind, namespace, name, title, description, displayName, type };
  }

  return {};
}

function getShortRef(options: {
  kind?: string;
  namespace?: string;
  name?: string;
  context?: { defaultKind?: string; defaultNamespace?: string };
}): string {
  const kind = options.kind?.toLocaleLowerCase('en-US') || 'unknown';
  const namespace =
    options.namespace?.toLocaleLowerCase('en-US') || DEFAULT_NAMESPACE;
  const name = options.name?.toLocaleLowerCase('en-US') || 'unknown';
  const defaultKind = options.context?.defaultKind?.toLocaleLowerCase('en-US');
  const defaultNamespace =
    options.context?.defaultNamespace?.toLocaleLowerCase('en-US');

  let result = name;

  if (
    (defaultNamespace && namespace !== defaultNamespace) ||
    namespace !== DEFAULT_NAMESPACE
  ) {
    result = `${namespace}/${result}`;
  }

  if (defaultKind && kind !== defaultKind) {
    result = `${kind}:${result}`;
  }

  return result;
}
