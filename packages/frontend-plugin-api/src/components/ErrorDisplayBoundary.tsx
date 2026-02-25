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

import { Component, ReactNode } from 'react';
import { FrontendPlugin } from '../wiring';
import { ErrorDisplay } from './DefaultSwappableComponents';

/** @internal */
export class ErrorDisplayBoundary extends Component<
  {
    children: ReactNode;
    plugin: FrontendPlugin;
  },
  { error?: Error }
> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  state = { error: undefined };

  handleErrorReset = () => {
    this.setState({ error: undefined });
  };

  render() {
    const { error } = this.state;
    const { plugin, children } = this.props;

    if (error) {
      return (
        <ErrorDisplay
          // todo: do we want to just use useAppNode hook in the ErrorDisplay instead?
          plugin={plugin}
          error={error}
          // todo: probably change this to onResetError
          resetError={this.handleErrorReset}
        />
      );
    }

    return children;
  }
}
