/*
 * Copyright 2020 The Backstage Authors
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

import { Button, CardContent, CardHeader } from '@material-ui/core';
import React, { ComponentClass, Component, ErrorInfo, useState } from 'react';
import { slackChannel as defaultSlackChannel } from '../constants';

type Props = {
  slackChannel?: typeof defaultSlackChannel;
  onError?: (error: Error, errorInfo: string) => null;
};

type State = {
  error?: Error;
  errorInfo?: ErrorInfo;
};

type EProps = {
  error?: Error;
  slackChannel?: typeof defaultSlackChannel;
  children?: React.ReactNode;
};

const Error = ({ slackChannel, error }: EProps) => {
  const [isShowingTrace, setIsShowingTrace] = useState(false);
  return (
    <div role="alert">
      <CardHeader title="Something Went Wrong" />
      <CardContent>
        <p>
          <strong>Error:</strong> {error?.message ?? 'No Further Info'}
        </p>
        <div>
          <Button
            onClick={() => setIsShowingTrace(!isShowingTrace)}
            variant="contained"
            color="primary"
          >
            {isShowingTrace ? 'Hide' : 'Show'} Details
          </Button>
        </div>
        {isShowingTrace && (
          <pre style={{ overflow: 'auto' }}>
            <code>
              {error?.stack?.split('\n').map(line => (
                <>
                  {line}
                  <br />
                </>
              )) ?? ''}
            </code>
          </pre>
        )}
        {slackChannel && (
          <p>
            Please contact{' '}
            <a
              href={slackChannel.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <u>{slackChannel.name}</u>
            </a>{' '}
            for help.
          </p>
        )}
      </CardContent>
    </div>
  );
};

export const ErrorBoundary: ComponentClass<
  Props,
  State
> = class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: undefined,
      errorInfo: undefined,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(`ErrorBoundary, error: ${error}, info: ${errorInfo}`);
    this.setState({ error, errorInfo });
  }

  render() {
    const { slackChannel } = this.props;
    const { error, errorInfo } = this.state;

    if (!errorInfo) {
      return this.props.children;
    }

    return <Error error={error} slackChannel={slackChannel} />;
  }
};
