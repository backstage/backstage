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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ShadcnButton,
  ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@backstage/core-components';
import { Bug, Copy, MoreVertical } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { IconComponent } from '@backstage/core-plugin-api';
import { useEntityPermission } from '@backstage/plugin-catalog-react/alpha';
import { catalogEntityDeletePermission } from '@backstage/plugin-catalog-common/alpha';
import { UnregisterEntity, UnregisterEntityOptions } from './UnregisterEntity';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';
import useCopyToClipboard from 'react-use/esm/useCopyToClipboard';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { EntityContextMenuProvider } from '../../context';

/** @public */
export type EntityContextMenuClassKey = 'button';

// NOTE(freben): Intentionally not exported at this point, since it's part of
// the unstable extra context menu items concept below
interface ExtraContextMenuItem {
  title: string;
  Icon: IconComponent;
  onClick: () => void;
}

interface EntityContextMenuProps {
  UNSTABLE_extraContextMenuItems?: ExtraContextMenuItem[];
  UNSTABLE_contextMenuOptions?: UnregisterEntityOptions;
  contextMenuItems?: React.JSX.Element[];
  onUnregisterEntity: () => void;
  onInspectEntity: () => void;
}

export function EntityContextMenu(props: EntityContextMenuProps) {
  const {
    UNSTABLE_extraContextMenuItems,
    UNSTABLE_contextMenuOptions,
    contextMenuItems,
    onUnregisterEntity,
    onInspectEntity,
  } = props;
  const { t } = useTranslationRef(catalogTranslationRef);
  const [open, setOpen] = useState(false);
  const unregisterPermission = useEntityPermission(
    catalogEntityDeletePermission,
  );
  const isAllowed = unregisterPermission.allowed;

  const onClose = () => {
    setOpen(false);
  };

  const alertApi = useApi(alertApiRef);
  const [copyState, copyToClipboard] = useCopyToClipboard();
  useEffect(() => {
    if (!copyState.error && copyState.value) {
      alertApi.post({
        message: t('entityContextMenu.copiedMessage'),
        severity: 'info',
        display: 'transient',
      });
    }
  }, [copyState, alertApi, t]);

  const extraItems = UNSTABLE_extraContextMenuItems?.length
    ? [
        ...UNSTABLE_extraContextMenuItems.map(item => (
          <DropdownMenuItem
            key={item.title}
            onClick={() => {
              onClose();
              item.onClick();
            }}
          >
            <item.Icon />
            <span>{item.title}</span>
          </DropdownMenuItem>
        )),
        <DropdownMenuSeparator key="the divider is here!" />,
      ]
    : null;

  const defaultMenuItems = [
    <UnregisterEntity
      unregisterEntityOptions={UNSTABLE_contextMenuOptions}
      isUnregisterAllowed={isAllowed}
      onUnregisterEntity={onUnregisterEntity}
      onClose={onClose}
      key="unregister-entity"
    />,
    <DropdownMenuItem
      onClick={() => {
        onClose();
        onInspectEntity();
      }}
      key="inspect-entity"
    >
      <Bug className="h-4 w-4" />
      <span>{t('entityContextMenu.inspectMenuTitle')}</span>
    </DropdownMenuItem>,
    <DropdownMenuItem
      onClick={() => {
        onClose();
        copyToClipboard(window.location.toString());
      }}
      key="copy-url"
    >
      <Copy className="h-4 w-4" />
      <span>{t('entityContextMenu.copyURLMenuTitle')}</span>
    </DropdownMenuItem>,
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <ShadcnTooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <ShadcnButton
                variant="ghost"
                size="icon"
                aria-label={t('entityContextMenu.moreButtonAriaLabel')}
                data-testid="menu-button"
                className="text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </ShadcnButton>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            {t('entityContextMenu.moreButtonTitle')}
          </TooltipContent>
        </ShadcnTooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {extraItems}
        {contextMenuItems === undefined ? (
          defaultMenuItems
        ) : (
          <EntityContextMenuProvider onMenuClose={onClose}>
            {contextMenuItems.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={index}>{item}</Fragment>
            ))}
          </EntityContextMenuProvider>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
