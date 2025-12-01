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
import { CellText, Tooltip, TooltipTrigger } from '@backstage/ui';
import { useEntityPresentation } from '@backstage/plugin-catalog-react';
import { ReactNode } from 'react';

/**
 * Props for EntityDisplayNameContent
 * @internal
 */
export interface EntityDisplayNameContentProps {
  entityRef: Entity | CompoundEntityRef | string;
  defaultKind?: string;
  defaultNamespace?: string;
  hideIcon?: boolean;
  disableTooltip?: boolean;
}

/**
 * Custom hook that returns entity presentation data
 * This is used by EntityRefLinkCell and EntityRefLinksCell
 * @internal
 */
export function useEntityDisplayNameContent(
  props: EntityDisplayNameContentProps,
): {
  primaryTitle: string;
  secondaryTitle?: string;
  icon: ReactNode;
} {
  const { entityRef, defaultKind, defaultNamespace, hideIcon } = props;

  const { primaryTitle, secondaryTitle, Icon } = useEntityPresentation(
    entityRef,
    { defaultKind, defaultNamespace },
  );

  const icon = Icon && !hideIcon ? <Icon fontSize="inherit" /> : null;

  return {
    primaryTitle,
    secondaryTitle,
    icon,
  };
}

/**
 * Props for EntityDisplayNameCell
 * @internal
 */
export interface EntityDisplayNameCellProps {
  id?: string;
  hidden?: boolean;
  entityRef: Entity | CompoundEntityRef | string;
  defaultKind?: string;
  defaultNamespace?: string;
  hideIcon?: boolean;
  disableTooltip?: boolean;
}

/**
 * Cell component that displays an entity name with icon and optional tooltip
 * @internal
 */
export function EntityDisplayNameCell(props: EntityDisplayNameCellProps) {
  const {
    id,
    hidden,
    entityRef,
    defaultKind,
    defaultNamespace,
    hideIcon,
    disableTooltip,
  } = props;

  const { primaryTitle, secondaryTitle, Icon } = useEntityPresentation(
    entityRef,
    { defaultKind, defaultNamespace },
  );

  const iconElement = Icon && !hideIcon ? <Icon fontSize="inherit" /> : null;

  let cell = (
    <CellText
      id={id}
      title={primaryTitle}
      leadingIcon={iconElement}
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
