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
import { Link, LinkProps } from '@backstage/core-components';
import {
  useAnalytics,
  useApiHolder,
  useRouteRef,
} from '@backstage/core-plugin-api';
import {
  appHistoryApiRef,
  routeResolutionApiRef,
  type RouteRef,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line no-restricted-imports
import MaterialLink from '@material-ui/core/Link';
import {
  MouseEvent as ReactMouseEvent,
  ReactNode,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
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

function isModifiedEvent(event: ReactMouseEvent): boolean {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * Shows a clickable link to an entity.
 *
 * Under the new frontend system, entity targets navigate via the app history.
 * Without an app history (old frontend system), the shared
 * {@link @backstage/core-components#Link} keeps today's react-router behavior.
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
      onClick,
      // Pulled out of the rest props: these are Link concerns and must not be
      // spread onto a plain anchor on the framework path.
      noTrack,
      externalLinkIcon,
      ...linkProps
    } = props;
    const entityLink = useEntityRefLink();
    const apiHolder = useApiHolder();
    const analytics = useAnalytics();
    const routeResolutionApi = apiHolder.get(routeResolutionApiRef);
    const appHistory = apiHolder.get(appHistoryApiRef);
    const routeParams = useMemo(
      () => entityRouteParams(entityRef, { encodeParams: true }),
      [entityRef],
    );

    // Prefer NFS route resolution when available. `entityRouteRef` is the same
    // object identity catalog alpha dual-types via convertLegacyRouteRef at app
    // load; avoid importing core-compat-api here (circular package graph).
    // Absolute entity routes do not need a react-router sourcePath.
    const resolvedFrameworkPath = useMemo(() => {
      if (!routeResolutionApi) {
        return undefined;
      }
      const routeFunc = routeResolutionApi.resolve(
        entityRouteRef as unknown as RouteRef<{
          name: string;
          kind: string;
          namespace: string;
        }>,
      );
      return routeFunc?.(routeParams);
    }, [routeResolutionApi, routeParams]);

    const content = children ?? title ?? (
      <EntityDisplayName
        entityRef={entityRef}
        defaultKind={defaultKind}
        defaultNamespace={defaultNamespace}
        hideIcon={hideIcon}
        disableTooltip={disableTooltip}
      />
    );

    // When an app history is present, always use framework navigate —
    // never fall back to the react-router Link shim under NFS.
    if (appHistory) {
      const to = resolvedFrameworkPath ?? entityLink(props.entityRef);
      // Mirrors Link: text content when there is any, otherwise the target.
      const linkText = typeof content === 'string' ? content : to;
      return (
        <MaterialLink
          {...linkProps}
          ref={ref}
          // The href has to be a real browser URL, including the app's deploy
          // basename, so middle-click and "open in new tab" work.
          href={appHistory.createHref(to)}
          onClick={(event: ReactMouseEvent<HTMLAnchorElement>) => {
            onClick?.(event as any);
            if (!noTrack) {
              analytics.captureEvent('click', linkText, {
                attributes: { to },
              });
            }
            if (
              event.defaultPrevented ||
              event.button !== 0 ||
              isModifiedEvent(event) ||
              linkProps.target === '_blank'
            ) {
              return;
            }
            event.preventDefault();
            appHistory.navigate(to);
          }}
        >
          {content}
        </MaterialLink>
      );
    }

    return (
      <Link
        {...linkProps}
        ref={ref}
        noTrack={noTrack}
        externalLinkIcon={externalLinkIcon}
        to={entityLink(props.entityRef)}
        onClick={onClick}
      >
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
