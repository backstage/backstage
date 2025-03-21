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
import React, { ComponentClass, Component, ErrorInfo } from 'react';
import { LinkButton } from '../../components/LinkButton';
import { ErrorPanel } from '../../components/ErrorPanel';
import { coreComponentsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

type SlackChannel = {
  name: string;
  href?: string;
};

/** @public */
export type ErrorBoundaryProps = React.PropsWithChildren<{
  slackChannel?: string | SlackChannel;
  onError?: (error: Error, errorInfo: string) => null;
}>;

type State = {
  error?: Error;
  errorInfo?: ErrorInfo;
};

const SlackLink = (props: { slackChannel?: string | SlackChannel }) => {
  const { slackChannel } = props;
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  if (!slackChannel) {
    return null;
  } else if (typeof slackChannel === 'string') {
    return (
      <Typography>{t('errorBoundary.title', { slackChannel })}</Typography>
    );
  } else if (!slackChannel.href) {
    return (
      <Typography>
        {t('errorBoundary.title', {
          slackChannel: slackChannel.name,
        })}
      </Typography>
    );
  }

  return (
    <LinkButton to={slackChannel.href} variant="contained">
      {slackChannel.name}
    </LinkButton>
  );
};

/** @public */
export const ErrorBoundary: ComponentClass<
  ErrorBoundaryProps,
  State
> = class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: undefined,
      errorInfo: undefined,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(`ErrorBoundary, error: ${error}`, { error, errorInfo });
    this.setState({ error, errorInfo });
  }

  render() {
    const { slackChannel, children } = this.props;
    const { error } = this.state;

    if (!error) {
      return children;
    }

    return (
      <ErrorPanel title="Something Went Wrong" error={error}>
        <SlackLink slackChannel={slackChannel} />
      </ErrorPanel>
    );
  }
};
