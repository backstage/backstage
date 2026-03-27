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

import {
  LogViewer,
  ShadcnButton as Button,
  Sheet,
  SheetContent,
} from '@backstage/core-components';
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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-semibold">Build Details</h2>
        <Button
          variant="ghost"
          size="icon"
          title="Close the drawer"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <LogViewer text={logText} classes={{ root: 'bg-background' }} />
      </div>
    </div>
  );
};

export const TechDocsBuildLogs = ({ buildLog }: { buildLog: string[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Show Build Logs
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:w-3/4 sm:max-w-none md:w-1/2 p-5"
        >
          <TechDocsBuildLogsDrawerContent
            buildLog={buildLog}
            onClose={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};
