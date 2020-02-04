import React, { Component } from 'react';
import { Highlight } from 'shared/apis/highlighting/highlight';

export default class JsonSyntaxHighlighter extends Component {
  render() {
    return <Highlight language="json">{JSON.stringify(this.props.obj, null, 4)}</Highlight>;
  }
}
