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
  XCircle,
  Repeat,
  RotateCcw,
  List,
  PlusCircle,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@backstage/core-components';
import { usePermission } from '@backstage/plugin-permission-react';
import {
  taskReadPermission,
  taskCreatePermission,
} from '@backstage/plugin-scaffolder-common/alpha';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';

type ContextMenuProps = {
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

export const ContextMenu = (props: ContextMenuProps) => {
  const {
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

  // Start Over endpoint requires user to have both read (to grab parameters) and create (to create new task) permissions
  const canStartOver = canReadTask && canCreateTask;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 text-foreground"
          aria-label="more"
          data-testid="menu-button"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Toggle Logs */}
        <DropdownMenuItem onClick={() => onToggleLogs?.(!logsVisible)}>
          <List className="h-4 w-4 mr-2" />
          <span>
            {logsVisible
              ? t('ongoingTask.contextMenu.hideLogs')
              : t('ongoingTask.contextMenu.showLogs')}
          </span>
        </DropdownMenuItem>

        {/* Toggle Button Bar */}
        <DropdownMenuItem
          onClick={() => onToggleButtonBar?.(!buttonBarVisible)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span>
            {buttonBarVisible
              ? t('ongoingTask.contextMenu.hideButtonBar')
              : t('ongoingTask.contextMenu.showButtonBar')}
          </span>
        </DropdownMenuItem>

        {/* Start Over */}
        <DropdownMenuItem
          onClick={onStartOver}
          disabled={cancelEnabled || !canStartOver}
          data-testid="start-over-task"
        >
          <Repeat className="h-4 w-4 mr-2" />
          <span>{t('ongoingTask.contextMenu.startOver')}</span>
        </DropdownMenuItem>

        {/* Retry (conditional) */}
        {isRetryableTask && (
          <DropdownMenuItem
            onClick={onRetry}
            disabled={cancelEnabled || !canRetry}
            data-testid="retry-task"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            <span>{t('ongoingTask.contextMenu.retry')}</span>
          </DropdownMenuItem>
        )}

        {/* Cancel */}
        <DropdownMenuItem
          onClick={props.onCancel}
          disabled={props.isCancelButtonDisabled}
          data-testid="cancel-task"
        >
          <XCircle className="h-4 w-4 mr-2" />
          <span>{t('ongoingTask.contextMenu.cancel')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
