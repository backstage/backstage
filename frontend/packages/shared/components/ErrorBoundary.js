import React, { Component } from 'react';
import Error from 'shared/components/Error';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      errorInfo: null,
      onError: props.onError,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`ErrorBoundary, error: ${error}, info: ${errorInfo}`);
    this.setState({ error, errorInfo });

    // Exposed for testing
    if (ErrorBoundary.onError) {
      ErrorBoundary.onError(error, errorInfo);
    }
  }

  render() {
    const { slackChannel } = this.props;
    const { error, errorInfo } = this.state;

    if (!errorInfo) {
      return this.props.children;
    }

    return <Error error={error} errorInfo={errorInfo} slackChannel={slackChannel} />;
  }
}
