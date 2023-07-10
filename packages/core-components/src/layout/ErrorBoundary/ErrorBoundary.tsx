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

import Typography from '@material-ui/core/Typography';
import React, {
  ComponentClass,
  Component,
  ErrorInfo,
  PropsWithChildren,
} from 'react';
import { LinkButton } from '../../components/LinkButton';
import { ErrorPanel } from '../../components/ErrorPanel';

type SlackChannel = {
  name: string;
  href?: string;
};

/** @public */
export type FallbackProps = {
  error: Error;
  resetErrorBoundary: (...args: any[]) => void;
};

/** @public */
export type ErrorBoundaryProps = {
  FallbackComponent?: React.ComponentType<FallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: (details: { args: any[] }) => void;
  slackChannel?: string | SlackChannel;
};

type ErrorBoundaryState = {
  error: null | Error;
};

const SlackLink = (props: { slackChannel?: string | SlackChannel }) => {
  const { slackChannel } = props;

  if (!slackChannel) {
    return null;
  } else if (typeof slackChannel === 'string') {
    return <Typography>Please contact {slackChannel} for help.</Typography>;
  } else if (!slackChannel.href) {
    return (
      <Typography>Please contact {slackChannel.name} for help.</Typography>
    );
  }

  return (
    <LinkButton to={slackChannel.href} variant="contained">
      {slackChannel.name}
    </LinkButton>
  );
};

const initialState: ErrorBoundaryState = {
  error: null,
};

/** @public */
export class ErrorBoundary extends Component<
  PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
    this.state = initialState;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(`ErrorBoundary, error: ${error}, info: ${errorInfo}`);

    this.props.onError?.(error, errorInfo);
  }

  resetErrorBoundary(...args: any[]) {
    const { error } = this.state;

    if (error) {
      this.props.onReset?.({ args });
      this.setState(initialState);
    }
  }

  render() {
    const { FallbackComponent } = this.props;
    const { error } = this.state;

    if (error) {
      if (FallbackComponent) {
        const errorProps: FallbackProps = {
          error,
          resetErrorBoundary: this.resetErrorBoundary,
        };

        return <FallbackComponent {...errorProps} />;
      }

      return (
        <ErrorPanel title="Something Went Wrong" error={error}>
          <SlackLink slackChannel={this.props.slackChannel} />
        </ErrorPanel>
      );
    }

    return this.props.children;
  }
}
