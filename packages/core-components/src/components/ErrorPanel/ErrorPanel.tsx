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

import { PropsWithChildren } from 'react';
import { cn } from '../../lib/utils';
import { CopyTextButton } from '../CopyTextButton';
import { WarningPanel } from '../WarningPanel';

/** @public */
export type ErrorPanelClassKey = 'text' | 'divider';

/** Tailwind utility classes replacing the MUI makeStyles 'text' class */
const textClasses = 'font-mono whitespace-pre overflow-x-auto mr-4';

type ErrorListProps = {
  error: string;
  message: string;
  request?: string;
  stack?: string;
  json?: string;
};

const ErrorList = ({
  error,
  message,
  stack,
  children,
}: PropsWithChildren<ErrorListProps>) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Error</p>
          <p className={cn('text-sm text-muted-foreground', textClasses)}>
            {error}
          </p>
        </div>
        <CopyTextButton text={error} />
      </div>

      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Message</p>
          <p className={cn('text-sm text-muted-foreground', textClasses)}>
            {message}
          </p>
        </div>
        <CopyTextButton text={message} />
      </div>

      {stack && (
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Stack Trace</p>
            <p className={cn('text-sm text-muted-foreground', textClasses)}>
              {stack}
            </p>
          </div>
          <CopyTextButton text={stack} />
        </div>
      )}

      {children}
    </div>
  );
};

/** @public */
export type ErrorPanelProps = {
  error: Error;
  defaultExpanded?: boolean;
  titleFormat?: string;
  title?: string;
};

/**
 * Renders a warning panel as the effect of an error.
 *
 * @public
 */
export function ErrorPanel(props: PropsWithChildren<ErrorPanelProps>) {
  const { title, error, defaultExpanded, titleFormat, children } = props;
  return (
    <WarningPanel
      severity="error"
      title={title ?? error.message}
      defaultExpanded={defaultExpanded}
      titleFormat={titleFormat}
    >
      <ErrorList
        error={error.name}
        message={error.message}
        stack={error.stack}
        children={children}
      />
    </WarningPanel>
  );
}
