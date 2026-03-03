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

import { LogViewer } from '@backstage/core-components';
import { X } from 'lucide-react';
import { useState } from 'react';

export const TechDocsBuildLogsDrawerContent = ({
  buildLog,
  onClose,
}: {
  buildLog: string[];
  onClose: () => void;
}) => {
  const logText =
    buildLog.length === 0 ? 'Waiting for logs...' : buildLog.join('\n');
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold">Build Details</h5>
        <button
          title="Close the drawer"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground h-9 w-9"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 min-h-0 mt-2">
        <LogViewer text={logText} classes={{ root: 'bg-background' }} />
      </div>
    </div>
  );
};

export const TechDocsBuildLogs = ({ buildLog }: { buildLog: string[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="text-inherit underline underline-offset-2 hover:opacity-80"
        onClick={() => setOpen(true)}
      >
        Show Build Logs
      </button>
      {open && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setOpen(false)}
          />
          {/* Drawer panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-3/4 md:w-1/2 bg-card p-5 shadow-lg">
            <TechDocsBuildLogsDrawerContent
              buildLog={buildLog}
              onClose={() => setOpen(false)}
            />
          </div>
        </>
      )}
    </>
  );
};
