/*
 * Copyright 2020 The Backstage Authors
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
  parseEntityRef,
} from '@backstage/catalog-model';
import { Link, LinkProps } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { ReactNode, forwardRef } from 'react';
import { entityRouteRef } from '../../routes';
import { EntityDisplayName } from '../EntityDisplayName';

/**
 * Props for {@link EntityRefLink}.
 *
 * @public
 */
export type EntityRefLinkProps = {
  entityRef: Entity | CompoundEntityRef | string;
  defaultKind?: string;
  defaultNamespace?: string;
  /** @deprecated This option should no longer be used; presentation is requested through the {@link entityPresentationApiRef} instead */
  title?: string;
  children?: ReactNode;
  hideIcon?: boolean;
  disableTooltip?: boolean;
} & Omit<LinkProps, 'to'>;

/**
 * Shows a clickable link to an entity.
 *
 * @public
 */
export const EntityRefLink = forwardRef<any, EntityRefLinkProps>(
  (props, ref) => {
    const {
      entityRef,
      defaultKind,
      defaultNamespace,
      title,
      children,
      hideIcon,
      disableTooltip,
      ...linkProps
    } = props;
    const entityRoute = useEntityRoute(props.entityRef);

    const content = children ?? title ?? (
      <EntityDisplayName
        entityRef={entityRef}
        defaultKind={defaultKind}
        defaultNamespace={defaultNamespace}
        hideIcon={hideIcon}
        disableTooltip={disableTooltip}
      />
    );

    return (
      <Link {...linkProps} ref={ref} to={entityRoute}>
        {content}
      </Link>
    );
  },
) as (props: EntityRefLinkProps) => JSX.Element;

// Hook that computes the route to a given entity / ref. This is a bit
// contrived, because it tries to retain the casing of the entity name if
// present, but not of other parts. This is in an attempt to make slightly more
// nice-looking URLs.
function useEntityRoute(
  entityRef: Entity | CompoundEntityRef | string,
): string {
  const entityRoute = useRouteRef(entityRouteRef);

  let kind;
  let namespace;
  let name;

  if (typeof entityRef === 'string') {
    const parsed = parseEntityRef(entityRef);
    kind = parsed.kind;
    namespace = parsed.namespace;
    name = parsed.name;
  } else if ('metadata' in entityRef) {
    kind = entityRef.kind;
    namespace = entityRef.metadata.namespace;
    name = entityRef.metadata.name;
  } else {
    kind = entityRef.kind;
    namespace = entityRef.namespace;
    name = entityRef.name;
  }

  kind = kind.toLocaleLowerCase('en-US');
  namespace = namespace?.toLocaleLowerCase('en-US') ?? DEFAULT_NAMESPACE;

  const routeParams = {
    kind: encodeURIComponent(kind),
    namespace: encodeURIComponent(namespace),
    name: encodeURIComponent(name),
  };

  return entityRoute(routeParams);
}
