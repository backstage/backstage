/*
 * Copyright 2022 The Backstage Authors
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

import { MouseEventHandler } from 'react';
import {
  Card,
  CardContent,
  ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  cn,
} from '@backstage/core-components';
import { WebFileSystemAccess } from '../../../lib/filesystem';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import {
  FolderPlus,
  ListOrdered,
  List,
  Info,
  Upload,
  type LucideIcon,
} from 'lucide-react';

/**
 * Props for the TemplateEditorIntro component.
 *
 * @remarks
 * `style` allows parent layout to pass inline styles (e.g. flex sizing).
 * `onSelect` fires when the user chooses one of the four editor actions.
 */
interface EditorIntroProps {
  style?: JSX.IntrinsicElements['div']['style'];
  onSelect?: (
    option: 'create-template' | 'local' | 'form' | 'field-explorer',
  ) => void;
}

/**
 * Internal action card used in the TemplateEditorIntro grid.
 *
 * Renders a clickable card with an icon, title, and description.
 * When `requireLoad` is true and the browser does not support the
 * File System Access API, the card shows a tooltip warning and
 * renders in a muted style.
 */
function ActionCard(props: {
  title: string;
  description: string;
  Icon: LucideIcon;
  action?: MouseEventHandler;
  requireLoad?: boolean;
}) {
  const supportsLoad = props.requireLoad
    ? WebFileSystemAccess.isSupported()
    : true;
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const { Icon, title, description, action } = props;

  return (
    <Card className="relative grid grid-cols-[auto_1fr] grid-rows-1 items-center mx-2 mt-4 p-4">
      {!supportsLoad && (
        <TooltipProvider>
          <ShadcnTooltip>
            <TooltipTrigger asChild>
              <span className="absolute top-2 right-2 cursor-help">
                <Info className="h-5 w-5 text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {t(
                'templateEditorPage.templateEditorIntro.loadLocal.unsupportedTooltip',
              )}
            </TooltipContent>
          </ShadcnTooltip>
        </TooltipProvider>
      )}
      <button
        type="button"
        onClick={action}
        className="col-span-2 grid grid-cols-subgrid cursor-pointer bg-transparent border-0 p-0 text-left w-full hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-md"
      >
        <div className="justify-self-center pt-2">
          <Icon
            size={48}
            className={cn(
              supportsLoad ? 'text-foreground' : 'text-muted-foreground',
            )}
          />
        </div>
        <CardContent className="p-2">
          <h2
            className={cn(
              'text-xl font-semibold mb-1',
              supportsLoad ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </button>
    </Card>
  );
}

/** Introduction screen for the template editor with four action cards. */
export function TemplateEditorIntro(props: EditorIntroProps) {
  const { t } = useTranslationRef(scaffolderTranslationRef);

  return (
    <div style={props.style}>
      <h2 className="text-2xl font-bold text-center mt-4">
        {t('templateEditorPage.templateEditorIntro.title')}
      </h2>
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-[1000px] grid gap-4 grid-flow-row md:grid-rows-2 md:grid-cols-2">
          <ActionCard
            title={t('templateEditorPage.templateEditorIntro.loadLocal.title')}
            description={t(
              'templateEditorPage.templateEditorIntro.loadLocal.description',
            )}
            requireLoad
            Icon={Upload}
            action={() => props.onSelect?.('local')}
          />
          <ActionCard
            title={t(
              'templateEditorPage.templateEditorIntro.createLocal.title',
            )}
            description={t(
              'templateEditorPage.templateEditorIntro.createLocal.description',
            )}
            requireLoad
            action={() => props.onSelect?.('create-template')}
            Icon={FolderPlus}
          />

          <ActionCard
            title={t('templateEditorPage.templateEditorIntro.formEditor.title')}
            description={t(
              'templateEditorPage.templateEditorIntro.formEditor.description',
            )}
            Icon={ListOrdered}
            action={() => props.onSelect?.('form')}
          />

          <ActionCard
            title={t(
              'templateEditorPage.templateEditorIntro.fieldExplorer.title',
            )}
            description={t(
              'templateEditorPage.templateEditorIntro.fieldExplorer.description',
            )}
            Icon={List}
            action={() => props.onSelect?.('field-explorer')}
          />
        </div>
      </div>
    </div>
  );
}
