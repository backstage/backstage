/*
 * Copyright 2021 The Backstage Authors
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

import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';
import { AnsiLine } from './AnsiProcessor';

export function useLogViewerSelection(lines: AnsiLine[]) {
  const errorApi = useApi(errorApiRef);
  const [sel, setSelection] = useState<{ start: number; end: number }>();
  const start = sel ? Math.min(sel.start, sel.end) : undefined;
  const end = sel ? Math.max(sel.start, sel.end) : undefined;

  const [{ error }, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  return {
    shouldShowButton(line: number) {
      return start === line || end === line;
    },
    isSelected(line: number) {
      if (!sel) {
        return false;
      }
      return start! <= line && line <= end!;
    },
    setSelection(line: number, add: boolean) {
      if (add) {
        setSelection(s =>
          s ? { start: s.start, end: line } : { start: line, end: line },
        );
      } else {
        setSelection(s =>
          s?.start === line && s?.end === line
            ? undefined
            : { start: line, end: line },
        );
      }
    },
    copySelection() {
      if (sel) {
        const copyText = lines
          .slice(Math.min(sel.start, sel.end) - 1, Math.max(sel.start, sel.end))
          .map(l => l.chunks.map(c => c.text).join(''))
          .join('\n');
        copyToClipboard(copyText);
        setSelection(undefined);
      }
    },
  };
}
