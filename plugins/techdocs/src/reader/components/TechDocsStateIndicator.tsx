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

import { Loader2 } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  ShadcnButton as Button,
} from '@backstage/core-components';

import { TechDocsBuildLogs } from './TechDocsBuildLogs';
import { TechDocsNotFound } from './TechDocsNotFound';
import { useTechDocsReader } from './TechDocsReaderProvider';

export const TechDocsStateIndicator = () => {
  let StateAlert: JSX.Element | null = null;

  const {
    state,
    contentReload,
    contentErrorMessage,
    syncErrorMessage,
    buildLog,
  } = useTechDocsReader();

  if (state === 'INITIAL_BUILD') {
    StateAlert = (
      <Alert variant="info" className="mb-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <AlertDescription className="flex-1 break-words [overflow-wrap:anywhere]">
            Documentation is accessed for the first time and is being prepared.
            The subsequent loads are much faster.
          </AlertDescription>
          <div className="ml-auto shrink-0">
            <TechDocsBuildLogs buildLog={buildLog} />
          </div>
        </div>
      </Alert>
    );
  }

  if (state === 'CONTENT_STALE_REFRESHING') {
    StateAlert = (
      <Alert variant="info" className="mb-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <AlertDescription className="flex-1 break-words [overflow-wrap:anywhere]">
            A newer version of this documentation is being prepared and will be
            available shortly.
          </AlertDescription>
          <div className="ml-auto shrink-0">
            <TechDocsBuildLogs buildLog={buildLog} />
          </div>
        </div>
      </Alert>
    );
  }

  if (state === 'CONTENT_STALE_READY') {
    StateAlert = (
      <Alert variant="success" className="mb-4">
        <div className="flex items-start gap-3">
          <AlertDescription className="flex-1 break-words [overflow-wrap:anywhere]">
            A newer version of this documentation is now available, please
            refresh to view.
          </AlertDescription>
          <div className="ml-auto shrink-0">
            <Button variant="ghost" onClick={() => contentReload()}>
              Refresh
            </Button>
          </div>
        </div>
      </Alert>
    );
  }

  if (state === 'CONTENT_STALE_ERROR') {
    StateAlert = (
      <Alert variant="destructive" className="mb-4">
        <div className="flex items-start gap-3">
          <AlertDescription className="flex-1 break-words [overflow-wrap:anywhere]">
            Building a newer version of this documentation failed.{' '}
            {syncErrorMessage}
          </AlertDescription>
          <div className="ml-auto shrink-0">
            <TechDocsBuildLogs buildLog={buildLog} />
          </div>
        </div>
      </Alert>
    );
  }

  if (state === 'CONTENT_NOT_FOUND') {
    StateAlert = (
      <>
        {syncErrorMessage && (
          <Alert variant="destructive" className="mb-4">
            <div className="flex items-start gap-3">
              <AlertDescription className="flex-1 break-words [overflow-wrap:anywhere]">
                Building a newer version of this documentation failed.{' '}
                {syncErrorMessage}
              </AlertDescription>
              <div className="ml-auto shrink-0">
                <TechDocsBuildLogs buildLog={buildLog} />
              </div>
            </div>
          </Alert>
        )}
        <TechDocsNotFound errorMessage={contentErrorMessage} />
      </>
    );
  }

  return StateAlert;
};
