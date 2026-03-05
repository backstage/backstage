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

import { Pencil, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  ShadcnButton as Button,
  Link,
} from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

export type TemplateWizardPageContextMenuProps = {
  editUrl?: string;
};

export function TemplateWizardPageContextMenu(
  props: TemplateWizardPageContextMenuProps,
) {
  const { editUrl } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);

  if (!editUrl) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="more"
          data-testid="menu-button"
          className="text-foreground"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={editUrl}>
            <Pencil className="mr-2 h-4 w-4" />
            {t('templateWizardPage.pageContextMenu.editConfigurationTitle')}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
