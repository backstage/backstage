/*
 * Copyright 2024 The Backstage Authors
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

import { ReactNode, useState } from 'react';

import {
  cn,
  ShadcnButton as Button,
  ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Sheet,
  SheetContent,
  ShadcnDialog,
  ShadcnDialogContent,
  DialogHeader,
  ShadcnDialogTitle,
  DialogDescription,
  DialogFooter,
} from '@backstage/core-components';
import { Puzzle, FileText, FunctionSquare } from 'lucide-react';

import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';

import { ActionPageContent } from '../../../components/ActionsPage/ActionsPage';
import { scaffolderTranslationRef } from '../../../translation';
import { CustomFieldPlayground } from './CustomFieldPlayground';
import { TemplatingExtensionsPageContent } from '../../../components/TemplatingExtensionsPage/TemplatingExtensionsPage';

export function TemplateEditorToolbar(props: {
  children?: ReactNode;
  fieldExtensions?: FieldExtensionOptions<any, any>[];
}) {
  const { children, fieldExtensions } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const [showFieldsDrawer, setShowFieldsDrawer] = useState(false);
  const [showActionsDrawer, setShowActionsDrawer] = useState(false);
  const [showExtensionsDrawer, setShowExtensionsDrawer] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  return (
    <header className={cn('relative z-[1]')}>
      <div className={cn('grid grid-cols-[auto_1fr] gap-2 px-2 bg-card')}>
        <div className={cn('grid items-center grid-flow-col gap-2')}>
          {children}
        </div>
        <div className={cn('justify-self-end flex gap-1')}>
          <TooltipProvider>
            <ShadcnTooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t(
                    'templateEditorToolbar.customFieldExplorerTooltip',
                  )}
                  onClick={() => setShowFieldsDrawer(true)}
                >
                  <Puzzle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t('templateEditorToolbar.customFieldExplorerTooltip')}
              </TooltipContent>
            </ShadcnTooltip>
            <ShadcnTooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t(
                    'templateEditorToolbar.installedActionsDocumentationTooltip',
                  )}
                  onClick={() => setShowActionsDrawer(true)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t(
                  'templateEditorToolbar.installedActionsDocumentationTooltip',
                )}
              </TooltipContent>
            </ShadcnTooltip>
            <ShadcnTooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t(
                    'templateEditorToolbar.templatingExtensionsDocumentationTooltip',
                  )}
                  onClick={() => setShowExtensionsDrawer(true)}
                >
                  <FunctionSquare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t(
                  'templateEditorToolbar.templatingExtensionsDocumentationTooltip',
                )}
              </TooltipContent>
            </ShadcnTooltip>
          </TooltipProvider>
          <Button variant="ghost" onClick={() => setShowPublishModal(true)}>
            {t('templateEditorToolbar.addToCatalogButton')}
          </Button>
        </div>
        <Sheet open={showFieldsDrawer} onOpenChange={setShowFieldsDrawer}>
          <SheetContent
            side="right"
            className="w-[90%] p-4 bg-background sm:w-[70%] md:w-[50%]"
          >
            <CustomFieldPlayground fieldExtensions={fieldExtensions} />
          </SheetContent>
        </Sheet>
        <Sheet open={showActionsDrawer} onOpenChange={setShowActionsDrawer}>
          <SheetContent
            side="right"
            className="w-[90%] p-4 bg-background sm:w-[70%] md:w-[50%]"
          >
            <ActionPageContent />
          </SheetContent>
        </Sheet>
        <Sheet
          open={showExtensionsDrawer}
          onOpenChange={setShowExtensionsDrawer}
        >
          <SheetContent
            side="right"
            className="w-[90%] p-4 bg-background sm:w-[70%] md:w-[50%]"
          >
            <TemplatingExtensionsPageContent />
          </SheetContent>
        </Sheet>
        <ShadcnDialog
          open={showPublishModal}
          onOpenChange={setShowPublishModal}
        >
          <ShadcnDialogContent>
            <DialogHeader>
              <ShadcnDialogTitle>
                {t('templateEditorToolbar.addToCatalogDialogTitle')}
              </ShadcnDialogTitle>
              <DialogDescription>
                {t(
                  'templateEditorToolbar.addToCatalogDialogContent.stepsIntroduction',
                )}
                <ul className="list-disc pl-4 mt-2">
                  {t(
                    'templateEditorToolbar.addToCatalogDialogContent.stepsListItems',
                  )
                    .split('\n')
                    .map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                </ul>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button asChild>
                <a
                  href={t(
                    'templateEditorToolbar.addToCatalogDialogActions.documentationUrl',
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(
                    'templateEditorToolbar.addToCatalogDialogActions.documentationButton',
                  )}
                </a>
              </Button>
            </DialogFooter>
          </ShadcnDialogContent>
        </ShadcnDialog>
      </div>
    </header>
  );
}
