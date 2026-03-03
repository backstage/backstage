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

import { ResponseError } from '@backstage/errors';
import { cn } from '../../lib/utils';
import { Separator } from '../ui/separator';
import { CodeSnippet } from '../CodeSnippet';
import { CopyTextButton } from '../CopyTextButton';
import { ErrorPanel, ErrorPanelProps } from '../ErrorPanel';

export type ResponseErrorPanelClassKey = 'text' | 'divider';

/**
 * Renders a warning panel as the effect of a failed server request.
 *
 * @remarks
 * Has special treatment for ResponseError errors, to display rich
 * server-provided information about what happened.
 */
export function ResponseErrorPanel(props: ErrorPanelProps) {
  const { title, error, defaultExpanded } = props;

  if (error.name !== 'ResponseError') {
    return (
      <ErrorPanel
        title={title ?? error.message}
        defaultExpanded={defaultExpanded}
        error={error}
      />
    );
  }

  const { body, cause } = error as ResponseError;
  const { request, response } = body;

  const errorString = `${response.statusCode}: ${cause.name}`;
  const requestString = request && `${request.method} ${request.url}`;
  const messageString = cause.message.replace(/\\n/g, '\n');
  const stackString = cause.stack?.replace(/\\n/g, '\n');
  const jsonString = JSON.stringify(body, undefined, 2);

  return (
    <ErrorPanel
      title={title ?? error.message}
      defaultExpanded={defaultExpanded}
      error={{ name: errorString, message: messageString, stack: stackString }}
    >
      {requestString && (
        <div className="flex items-start px-4 py-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Request</p>
            {request && (
              <p
                className={cn(
                  'text-sm text-muted-foreground font-mono whitespace-pre overflow-x-auto mr-4',
                )}
              >
                {requestString}
              </p>
            )}
          </div>
          <CopyTextButton text={requestString} />
        </div>
      )}
      <>
        <Separator className="my-4" />
        <div className="flex items-start px-4 py-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              Full Error as JSON
            </p>
          </div>
        </div>
        <CodeSnippet language="json" text={jsonString} showCopyCodeButton />
      </>
    </ErrorPanel>
  );
}
