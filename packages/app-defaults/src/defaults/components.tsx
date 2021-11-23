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

import React, { ReactNode } from 'react';
import Button from '@material-ui/core/Button';
import { ErrorPanel, Progress, ErrorPage } from '@backstage/core-components';
import {
  MemoryRouter,
  useInRouterContext,
  BrowserRouter,
} from 'react-router-dom';
import {
  AppComponents,
  BootErrorPageProps,
  ErrorBoundaryFallbackProps,
} from '@backstage/core-plugin-api';

export function OptionallyWrapInRouter({ children }: { children: ReactNode }) {
  if (useInRouterContext()) {
    return <>{children}</>;
  }
  return <MemoryRouter>{children}</MemoryRouter>;
}

const DefaultNotFoundPage = () => (
  <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />
);

const DefaultBootErrorPage = ({ step, error }: BootErrorPageProps) => {
  let message = '';
  if (step === 'load-config') {
    message = `The configuration failed to load, someone should have a look at this error: ${error.message}`;
  } else if (step === 'load-chunk') {
    message = `Lazy loaded chunk failed to load, try to reload the page: ${error.message}`;
  }
  // TODO: figure out a nicer way to handle routing on the error page, when it can be done.
  return (
    <OptionallyWrapInRouter>
      <ErrorPage status="501" statusMessage={message} />
    </OptionallyWrapInRouter>
  );
};

const DefaultErrorBoundaryFallback = ({
  error,
  resetError,
  plugin,
}: ErrorBoundaryFallbackProps) => {
  return (
    <ErrorPanel
      title={`Error in ${plugin?.getId()}`}
      defaultExpanded
      error={error}
    >
      <Button variant="outlined" onClick={resetError}>
        Retry
      </Button>
    </ErrorPanel>
  );
};

/**
 * Creates a set of default components to pass along to {@link @backstage/core-app-api#createApp}.
 *
 * @public
 */
export const components: AppComponents = {
  Progress,
  Router: BrowserRouter,
  NotFoundErrorPage: DefaultNotFoundPage,
  BootErrorPage: DefaultBootErrorPage,
  ErrorBoundaryFallback: DefaultErrorBoundaryFallback,
};
