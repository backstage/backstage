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

import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import { Link, LinkProps } from '@backstage/core-components';
import { useApiHolder, useRouteRef } from '@backstage/core-plugin-api';
import {
  navigationControllerApiRef,
  RouteLink,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line no-restricted-imports
import MaterialLink from '@material-ui/core/Link';
import { ReactNode, forwardRef, useCallback, useMemo } from 'react';
import { entityRouteParams, entityRouteRef } from '../../routes';
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
 * Under the new frontend system, entity targets navigate via framework
 * {@link @backstage/frontend-plugin-api#RouteLink} (not the disposable NFS
 * `Link` shim). Without a navigation controller (old frontend system), the
 * shared {@link @backstage/core-components#Link} keeps today's react-router
 * behavior.
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
    const entityLink = useEntityRefLink();
    const apiHolder = useApiHolder();
    const hasNavigationController = Boolean(
      apiHolder.get(navigationControllerApiRef),
    );
    const frameworkEntityRouteRef = useMemo(
      () => convertLegacyRouteRef(entityRouteRef),
      [],
    );
    const routeParams = useMemo(
      () => entityRouteParams(entityRef, { encodeParams: true }),
      [entityRef],
    );

    const content = children ?? title ?? (
      <EntityDisplayName
        entityRef={entityRef}
        defaultKind={defaultKind}
        defaultNamespace={defaultNamespace}
        hideIcon={hideIcon}
        disableTooltip={disableTooltip}
      />
    );

    if (hasNavigationController) {
      return (
        <MaterialLink
          {...linkProps}
          ref={ref}
          component={RouteLink as any}
          routeRef={frameworkEntityRouteRef}
          params={routeParams}
        >
          {content}
        </MaterialLink>
      );
    }

    return (
      <Link {...linkProps} ref={ref} to={entityLink(props.entityRef)}>
        {content}
      </Link>
    );
  },
) as (props: EntityRefLinkProps) => JSX.Element;

/**
 * Returns a function that generates a route path to the given entity.
 *
 * @public
 */
export function useEntityRefLink(): (
  entityRef: Entity | CompoundEntityRef | string,
) => string {
  const entityRoute = useRouteRef(entityRouteRef);

  return useCallback(
    (ref: Entity | CompoundEntityRef | string) => {
      const routeParams = entityRouteParams(ref, { encodeParams: true });
      return entityRoute(routeParams);
    },
    [entityRoute],
  );
}
