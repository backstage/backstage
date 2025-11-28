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

import { useCallback } from 'react';
import { useParams } from 'react-router';

export const useDownloadLogs = (logs: { [k: string]: string[] }) => {
  const { taskId } = useParams<{ taskId: string }>();
  return useCallback(() => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        Object.values(logs)
          .map(l => l.join('\n'))
          .filter(Boolean)
          .join('\n'),
      ],
      { type: 'text/plain' },
    );
    element.href = URL.createObjectURL(file);
    element.download = `${taskId}.log`;
    element.click();
    URL.revokeObjectURL(element.href);
    element.remove();
  }, [logs, taskId]);
};
