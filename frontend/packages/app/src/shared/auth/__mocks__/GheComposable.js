import React, { Component } from 'react';

export const withGheAuth = () => BaseComponent => {
  class GheAuthorizedView extends Component {
    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  return GheAuthorizedView;
};
