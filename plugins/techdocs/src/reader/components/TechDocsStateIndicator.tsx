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
import { cn } from '@backstage/core-components';

import { TechDocsBuildLogs } from './TechDocsBuildLogs';
import { TechDocsNotFound } from './TechDocsNotFound';
import { useTechDocsReader } from './TechDocsReaderProvider';

/** Alert severity to Tailwind class mapping */
const severityStyles: Record<string, string> = {
  info: 'border-info-foreground/40 text-info-foreground bg-info',
  success: 'border-success-foreground/40 text-success-foreground bg-success',
  error: 'border-destructive/40 text-destructive bg-destructive/10',
};

function StateAlertBox({
  severity,
  icon,
  action,
  className,
  children,
}: {
  severity: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-center rounded-md border px-4 py-3 text-sm',
        severityStyles[severity] ?? severityStyles.info,
        className,
      )}
    >
      {icon && <span className="mr-3 shrink-0">{icon}</span>}
      <span className="flex-1 break-words [overflow-wrap:anywhere]">
        {children}
      </span>
      {action && <span className="ml-3 shrink-0">{action}</span>}
    </div>
  );
}

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
      <StateAlertBox
        severity="info"
        className="mb-4"
        icon={<Loader2 className="h-6 w-6 animate-spin" />}
        action={<TechDocsBuildLogs buildLog={buildLog} />}
      >
        Documentation is accessed for the first time and is being prepared. The
        subsequent loads are much faster.
      </StateAlertBox>
    );
  }

  if (state === 'CONTENT_STALE_REFRESHING') {
    StateAlert = (
      <StateAlertBox
        severity="info"
        className="mb-4"
        icon={<Loader2 className="h-6 w-6 animate-spin" />}
        action={<TechDocsBuildLogs buildLog={buildLog} />}
      >
        A newer version of this documentation is being prepared and will be
        available shortly.
      </StateAlertBox>
    );
  }

  if (state === 'CONTENT_STALE_READY') {
    StateAlert = (
      <StateAlertBox
        severity="success"
        className="mb-4"
        action={
          <button
            className="text-inherit underline underline-offset-2 hover:opacity-80"
            onClick={() => contentReload()}
          >
            Refresh
          </button>
        }
      >
        A newer version of this documentation is now available, please refresh
        to view.
      </StateAlertBox>
    );
  }

  if (state === 'CONTENT_STALE_ERROR') {
    StateAlert = (
      <StateAlertBox
        severity="error"
        className="mb-4"
        action={<TechDocsBuildLogs buildLog={buildLog} />}
      >
        Building a newer version of this documentation failed.{' '}
        {syncErrorMessage}
      </StateAlertBox>
    );
  }

  if (state === 'CONTENT_NOT_FOUND') {
    StateAlert = (
      <>
        {syncErrorMessage && (
          <StateAlertBox
            severity="error"
            className="mb-4"
            action={<TechDocsBuildLogs buildLog={buildLog} />}
          >
            Building a newer version of this documentation failed.{' '}
            {syncErrorMessage}
          </StateAlertBox>
        )}
        <TechDocsNotFound errorMessage={contentErrorMessage} />
      </>
    );
  }

  return StateAlert;
};
