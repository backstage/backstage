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
import {
  ShadcnButton as Button,
  ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  Separator,
} from '@backstage/core-components';
import { X, RefreshCw, Save } from 'lucide-react';
import { useDirectoryEditor } from './DirectoryEditorContext';
import { FileBrowser } from '../../../components/FileBrowser';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

/** The local file browser for the template editor */
export function TemplateEditorBrowser(props: { onClose?: () => void }) {
  const directoryEditor = useDirectoryEditor();
  const changedFiles = directoryEditor?.files.filter(file => file.dirty);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const handleClose = () => {
    if (!props.onClose) {
      return;
    }
    if (changedFiles?.length) {
      // eslint-disable-next-line no-alert
      const accepted = window.confirm(
        t('templateEditorPage.templateEditorBrowser.closeConfirmMessage'),
      );
      if (!accepted) {
        return;
      }
    }
    props.onClose();
  };

  if (!directoryEditor) {
    return null;
  }

  return (
    <>
      <div className="flex items-center [&_svg]:m-2">
        <ShadcnTooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={directoryEditor.files.every(file => !file.dirty)}
              onClick={() => directoryEditor.save()}
            >
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {t('templateEditorPage.templateEditorBrowser.saveIconTooltip')}
          </TooltipContent>
        </ShadcnTooltip>
        <ShadcnTooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => directoryEditor.reload()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {t('templateEditorPage.templateEditorBrowser.reloadIconTooltip')}
          </TooltipContent>
        </ShadcnTooltip>
        <ShadcnTooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {t('templateEditorPage.templateEditorBrowser.closeIconTooltip')}
          </TooltipContent>
        </ShadcnTooltip>
      </div>
      <Separator />
      <FileBrowser
        selected={directoryEditor.selectedFile?.path ?? ''}
        onSelect={directoryEditor.setSelectedFile}
        filePaths={directoryEditor.files.map(file => file.path) ?? []}
      />
    </>
  );
}
