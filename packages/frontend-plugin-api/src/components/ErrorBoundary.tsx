/*
 * Copyright 2023 The Backstage Authors
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

import React, { Component, PropsWithChildren } from 'react';
// TODO: Dependency on MUI should be removed from core packages
import { Button } from '@material-ui/core';
import { ErrorPanel } from '@backstage/core-components';
import { BackstagePlugin } from '../wiring';

type DefaultErrorBoundaryFallbackProps = PropsWithChildren<{
  plugin?: BackstagePlugin;
  error: Error;
  resetError: () => void;
}>;

const DefaultErrorBoundaryFallback = ({
  plugin,
  error,
  resetError,
}: DefaultErrorBoundaryFallbackProps) => {
  const title = `Error in ${plugin?.id}`;

  return (
    <ErrorPanel title={title} error={error} defaultExpanded>
      <Button variant="outlined" onClick={resetError}>
        Retry
      </Button>
    </ErrorPanel>
  );
};

type ErrorBoundaryProps = PropsWithChildren<{ plugin?: BackstagePlugin }>;
type ErrorBoundaryState = { error?: Error };

/** @internal */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  state: ErrorBoundaryState = { error: undefined };

  handleErrorReset = () => {
    this.setState({ error: undefined });
  };

  render() {
    const { error } = this.state;
    const { plugin, children } = this.props;

    if (error) {
      // TODO: use a configurable error boundary fallback
      return (
        <DefaultErrorBoundaryFallback
          plugin={plugin}
          error={error}
          resetError={this.handleErrorReset}
        />
      );
    }

    return children;
  }
}
