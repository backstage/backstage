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

import { Component, ErrorInfo, ReactNode } from 'react';
import { AppNode, ErrorApi } from '../apis';
import { ForwardedError } from '@backstage/errors';

/** @internal */
export class ErrorApiBoundary extends Component<
  {
    children: ReactNode;
    node: AppNode;
    errorApi?: ErrorApi;
  },
  { error?: Error }
> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  state = { error: undefined };

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    const { node, errorApi } = this.props;
    errorApi?.post(
      new ForwardedError(`Error in extension '${node.spec.id}'`, error),
    );
  }

  render() {
    if (this.state.error) {
      return null;
    }

    return this.props.children;
  }
}
