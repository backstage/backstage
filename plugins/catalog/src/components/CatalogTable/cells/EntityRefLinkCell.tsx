/*
 * Copyright 2025 The Backstage Authors
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
import { Cell, Tooltip, TooltipTrigger } from '@backstage/ui';
import { useRouteRef } from '@backstage/core-plugin-api';
import {
  entityRouteParams,
  entityRouteRef,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import { useEntityDisplayNameContent } from './EntityDisplayNameCell';

/**
 * Props for EntityRefLinkCell
 * @internal
 */
export interface EntityRefLinkCellProps {
  id?: string;
  hidden?: boolean;
  entityRef: Entity | CompoundEntityRef | string;
  defaultKind?: string;
  defaultNamespace?: string;
  hideIcon?: boolean;
  disableTooltip?: boolean;
}

/**
 * Cell component that displays a clickable link to an entity
 * @internal
 */
export function EntityRefLinkCell(props: EntityRefLinkCellProps) {
  const {
    id,
    hidden,
    entityRef,
    defaultKind,
    defaultNamespace,
    hideIcon,
    disableTooltip,
  } = props;

  const entityRoute = useRouteRef(entityRouteRef);
  const routeParams = entityRouteParams(entityRef, { encodeParams: true });
  const href = entityRoute(routeParams);

  // Always call the hook unconditionally
  const { primaryTitle, secondaryTitle, icon } = useEntityDisplayNameContent({
    entityRef,
    defaultKind,
    defaultNamespace,
    hideIcon,
    disableTooltip,
  });

  // Format the title the same way as the original column does
  // This matches the logic in createNameColumn which uses humanizeEntityRef
  let displayTitle: string;
  if (typeof entityRef === 'object' && 'metadata' in entityRef) {
    // Use the entity's kind as defaultKind if defaultKind doesn't match the entity's kind
    // This ensures the kind prefix is omitted when viewing entities of that kind
    const entityKind = entityRef.kind.toLocaleLowerCase('en-US');
    const providedDefaultKind = defaultKind?.toLocaleLowerCase('en-US');
    const effectiveDefaultKind =
      providedDefaultKind === entityKind ? defaultKind : entityRef.kind;
    displayTitle =
      entityRef.metadata?.title ||
      humanizeEntityRef(entityRef, {
        defaultKind: effectiveDefaultKind,
        defaultNamespace,
      });
  } else {
    // For string or CompoundEntityRef, use useEntityDisplayNameContent's primaryTitle
    displayTitle = primaryTitle;
  }

  let cell = (
    <Cell
      id={id}
      title={displayTitle}
      leadingIcon={icon}
      href={href}
      color="primary"
      hidden={hidden}
    />
  );

  // Wrap with tooltip if secondary title exists and tooltip is enabled
  if (secondaryTitle && !disableTooltip) {
    cell = (
      <TooltipTrigger delay={1500}>
        {cell}
        <Tooltip>{secondaryTitle}</Tooltip>
      </TooltipTrigger>
    );
  }

  return cell;
}
