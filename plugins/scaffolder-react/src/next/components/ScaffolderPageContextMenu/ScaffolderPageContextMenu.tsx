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

import { useTranslationRef } from '@backstage/frontend-plugin-api';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  ShadcnButton as Button,
} from '@backstage/core-components';
import {
  MoreVertical,
  PlusCircle,
  Pencil,
  FunctionSquare,
  FileText,
  List as ListIcon,
} from 'lucide-react';
import { usePermission } from '@backstage/plugin-permission-react';
import { templateManagementPermission } from '@backstage/plugin-scaffolder-common/alpha';

import { scaffolderReactTranslationRef } from '../../../translation';

/**
 * @alpha
 */
export type ScaffolderPageContextMenuProps = {
  onEditorClicked?: () => void;
  onActionsClicked?: () => void;
  onTasksClicked?: () => void;
  onCreateClicked?: () => void;
  onTemplatingExtensionsClicked?: () => void;
};

/**
 * @alpha
 */
export function ScaffolderPageContextMenu(
  props: ScaffolderPageContextMenuProps,
) {
  const { t } = useTranslationRef(scaffolderReactTranslationRef);
  const {
    onEditorClicked,
    onActionsClicked,
    onTasksClicked,
    onCreateClicked,
    onTemplatingExtensionsClicked,
  } = props;
  const { allowed: canManageTemplates } = usePermission({
    permission: templateManagementPermission,
  });

  if (
    !(
      onEditorClicked ||
      onActionsClicked ||
      onTasksClicked ||
      onCreateClicked ||
      onTemplatingExtensionsClicked
    )
  ) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('scaffolderPageContextMenu.moreLabel')}
          data-testid="menu-button"
          className="text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onCreateClicked && (
          <DropdownMenuItem onClick={onCreateClicked}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('scaffolderPageContextMenu.createLabel')}
          </DropdownMenuItem>
        )}
        {onEditorClicked && canManageTemplates && (
          <DropdownMenuItem onClick={onEditorClicked}>
            <Pencil className="mr-2 h-4 w-4" />
            {t('scaffolderPageContextMenu.editorLabel')}
          </DropdownMenuItem>
        )}
        {onTemplatingExtensionsClicked && (
          <DropdownMenuItem onClick={onTemplatingExtensionsClicked}>
            <FunctionSquare className="mr-2 h-4 w-4" />
            {t('scaffolderPageContextMenu.templatingExtensionsLabel')}
          </DropdownMenuItem>
        )}
        {onActionsClicked && (
          <DropdownMenuItem onClick={onActionsClicked}>
            <FileText className="mr-2 h-4 w-4" />
            {t('scaffolderPageContextMenu.actionsLabel')}
          </DropdownMenuItem>
        )}
        {onTasksClicked && (
          <DropdownMenuItem onClick={onTasksClicked}>
            <ListIcon className="mr-2 h-4 w-4" />
            {t('scaffolderPageContextMenu.tasksLabel')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
