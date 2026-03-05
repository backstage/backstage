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

import { ShadcnButton as Button, cn } from '@backstage/core-components';
import { XCircle, Check, Trash2, Download } from 'lucide-react';
import { useDryRun } from '../DryRunContext';
import { downloadBlob } from '../../../../lib/download';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../../translation';

/** Renders a scrollable list of dry run results with status icons and action buttons */
export function DryRunResultsList() {
  const dryRun = useDryRun();
  const { t } = useTranslationRef(scaffolderTranslationRef);

  return (
    <div className="overflow-y-auto bg-background" role="listbox">
      {dryRun.results.map(result => {
        const failed = result.log.some(l => l.body.status === 'failed');
        const isSelected = dryRun.selectedResult?.id === result.id;
        let isLoading = false;

        async function downloadResult() {
          isLoading = true;
          await downloadDirectoryContents(
            result.directoryContents,
            `dry-run-result-${result.id}.zip`,
          );
          isLoading = false;
        }

        return (
          <div
            key={result.id}
            role="option"
            tabIndex={0}
            aria-selected={isSelected}
            className={cn(
              'flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent transition-colors',
              isSelected && 'bg-accent',
            )}
            onClick={() => dryRun.selectResult(result.id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dryRun.selectResult(result.id);
              }
            }}
          >
            {/* Status icon */}
            <div
              className={cn(
                'min-w-0 mr-1 shrink-0',
                failed
                  ? 'text-destructive'
                  : 'text-green-600 dark:text-green-400',
              )}
            >
              {failed ? (
                <XCircle className="h-5 w-5" />
              ) : (
                <Check className="h-5 w-5" />
              )}
            </div>

            {/* Result label */}
            <div className="text-sm flex-1 truncate">
              {t('templateEditorPage.dryRunResultsList.title', {
                resultId: `${result.id}`,
              })}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                aria-label="download"
                title={t(
                  'templateEditorPage.dryRunResultsList.downloadButtonTitle',
                )}
                disabled={isLoading}
                onClick={e => {
                  e.stopPropagation();
                  downloadResult();
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="delete"
                title={t(
                  'templateEditorPage.dryRunResultsList.deleteButtonTitle',
                )}
                onClick={e => {
                  e.stopPropagation();
                  dryRun.deleteResult(result.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

async function downloadDirectoryContents(
  directoryContents: {
    path: string;
    base64Content: string;
    executable?: boolean;
  }[],
  name: string,
) {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  for (const d of directoryContents) {
    // Decode text content from base64 to ascii
    const converted = atob(d.base64Content);

    // add folder/file to zip
    await zip.file(d.path, converted);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, name);
}
