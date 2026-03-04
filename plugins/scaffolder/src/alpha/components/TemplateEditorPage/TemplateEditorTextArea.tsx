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

import { StreamLanguage } from '@codemirror/language';
import { yaml as yamlSupport } from '@codemirror/legacy-modes/mode/yaml';
import { showPanel } from '@codemirror/view';
import {
  ShadcnButton as Button,
  Card,
  ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  cn,
} from '@backstage/core-components';
import { RefreshCw, Save } from 'lucide-react';
import { useKeyboardEvent } from '@react-hookz/web';
import CodeMirror from '@uiw/react-codemirror';
import { useMemo } from 'react';
import { useDirectoryEditor } from './DirectoryEditorContext';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

/** A wrapper around CodeMirror with an error panel and extra actions available */
export function TemplateEditorTextArea(props: {
  content?: string;
  onUpdate?: (content: string) => void;
  errorText?: string;
  onSave?: () => void;
  onReload?: () => void;
}) {
  const { errorText } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const panelExtension = useMemo(() => {
    if (!errorText) {
      return showPanel.of(null);
    }

    const dom = document.createElement('div');
    dom.className = cn('text-destructive leading-8 mx-2');
    dom.textContent = errorText;
    return showPanel.of(() => ({ dom, bottom: true }));
  }, [errorText]);

  useKeyboardEvent(
    e => e.key === 's' && (e.ctrlKey || e.metaKey),
    e => {
      e.preventDefault();
      if (props.onSave) {
        props.onSave();
      }
    },
  );

  return (
    <div className="relative w-full h-full">
      <CodeMirror
        className="h-full md:absolute md:inset-0"
        theme="dark"
        height="100%"
        extensions={[StreamLanguage.define(yamlSupport), panelExtension]}
        value={props.content}
        onChange={props.onUpdate}
      />
      {(props.onSave || props.onReload) && (
        <div className="absolute top-2 right-6">
          <Card className="flex">
            {props.onSave && (
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2"
                    onClick={() => props.onSave?.()}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t(
                    'templateEditorPage.templateEditorTextArea.saveIconTooltip',
                  )}
                </TooltipContent>
              </ShadcnTooltip>
            )}
            {props.onReload && (
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2"
                    onClick={() => props.onReload?.()}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t(
                    'templateEditorPage.templateEditorTextArea.refreshIconTooltip',
                  )}
                </TooltipContent>
              </ShadcnTooltip>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

/** A version of the TemplateEditorTextArea that is connected to the DirectoryEditor context */
export function TemplateEditorDirectoryEditorTextArea(props: {
  errorText?: string;
}) {
  const directoryEditor = useDirectoryEditor();
  const { t } = useTranslationRef(scaffolderTranslationRef);

  if (!directoryEditor) {
    return (
      <p className="p-3 text-muted-foreground text-center">
        {t('templateEditorPage.templateEditorTextArea.emptyStateParagraph')}
      </p>
    );
  }

  const actions = directoryEditor?.selectedFile?.dirty
    ? {
        onSave: () => directoryEditor.save(),
        onReload: () => directoryEditor.reload(),
      }
    : {
        onReload: () => directoryEditor.reload(),
      };

  return (
    <TemplateEditorTextArea
      errorText={props.errorText}
      content={directoryEditor.selectedFile?.content}
      onUpdate={content =>
        directoryEditor?.selectedFile?.updateContent(content)
      }
      {...actions}
    />
  );
}

TemplateEditorTextArea.DirectoryEditor = TemplateEditorDirectoryEditorTextArea;
