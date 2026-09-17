/*
 * Copyright 2026 The Backstage Authors
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

import { Header, MenuTrigger, ButtonIcon, Menu, MenuItem } from '@backstage/ui';
import {
  RiMore2Line,
  RiFileListLine,
  RiAddCircleLine,
  RiRepeatLine,
  RiReplay10Line,
  RiCloseCircleLine,
} from '@remixicon/react';
import { usePermission } from '@backstage/plugin-permission-react';
import {
  taskReadPermission,
  taskCreatePermission,
} from '@backstage/plugin-scaffolder-common/alpha';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';

type OngoingTaskContextMenuProps = {
  title: string;
  cancelEnabled?: boolean;
  canRetry: boolean;
  isRetryableTask: boolean;
  logsVisible?: boolean;
  buttonBarVisible?: boolean;
  onRetry?: () => void;
  onStartOver?: () => void;
  onToggleLogs?: (state: boolean) => void;
  onToggleButtonBar?: (state: boolean) => void;
  taskId?: string;
  isCancelButtonDisabled: boolean;
  onCancel: () => void;
};

export function OngoingTaskContextMenu(props: OngoingTaskContextMenuProps) {
  const {
    title,
    cancelEnabled,
    canRetry,
    isRetryableTask,
    logsVisible,
    buttonBarVisible,
    onRetry,
    onStartOver,
    onToggleLogs,
    onToggleButtonBar,
    taskId,
  } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const { allowed: canReadTask } = usePermission({
    permission: taskReadPermission,
    resourceRef: taskId,
  });

  const { allowed: canCreateTask } = usePermission({
    permission: taskCreatePermission,
  });

  const canStartOver = canReadTask && canCreateTask;

  return (
    <Header
      title={title}
      customActions={
        <MenuTrigger>
          <ButtonIcon
            variant="tertiary"
            icon={<RiMore2Line />}
            aria-label={t('ongoingTask.contextMenu.moreOptions')}
          />
          <Menu placement="bottom end">
            <MenuItem
              onAction={() => onToggleLogs?.(!logsVisible)}
              iconStart={<RiFileListLine size={16} />}
            >
              {logsVisible
                ? t('ongoingTask.contextMenu.hideLogs')
                : t('ongoingTask.contextMenu.showLogs')}
            </MenuItem>
            <MenuItem
              onAction={() => onToggleButtonBar?.(!buttonBarVisible)}
              iconStart={<RiAddCircleLine size={16} />}
            >
              {buttonBarVisible
                ? t('ongoingTask.contextMenu.hideButtonBar')
                : t('ongoingTask.contextMenu.showButtonBar')}
            </MenuItem>
            <MenuItem
              onAction={onStartOver}
              isDisabled={cancelEnabled || !canStartOver}
              iconStart={<RiRepeatLine size={16} />}
            >
              {t('ongoingTask.contextMenu.startOver')}
            </MenuItem>
            {isRetryableTask && (
              <MenuItem
                onAction={onRetry}
                isDisabled={cancelEnabled || !canRetry}
                iconStart={<RiReplay10Line size={16} />}
              >
                {t('ongoingTask.contextMenu.retry')}
              </MenuItem>
            )}
            <MenuItem
              onAction={props.onCancel}
              isDisabled={props.isCancelButtonDisabled}
              iconStart={<RiCloseCircleLine size={16} />}
              color="danger"
            >
              {t('ongoingTask.contextMenu.cancel')}
            </MenuItem>
          </Menu>
        </MenuTrigger>
      }
    />
  );
}
