import React, { Component } from 'react';
import showdown from 'showdown';
import './markdown.css';

import { highlightBlock } from 'shared/apis/highlighting/highlight';
// For CSS styling for Highlight, see 'shared/apis/highlighting/style.js';

export default class Markdown extends Component {
  constructor(props) {
    super(props);

    this.converter = new showdown.Converter();
    this.converter.setFlavor('github');
  }

  componentDidMount() {
    if (!this.refs.markdown) return;

    const codeBlocks = this.refs.markdown.querySelectorAll('pre code');

    codeBlocks.forEach(highlightBlock);
  }

  render() {
    const str = this.props.children;
    if (!str) {
      return null;
    }

    const html = this.converter.makeHtml(str);

    const classnames = ['markdown'];

    // If the background is darker or an image markdown.css will use lighter colors for links
    if (this.props.darkBackground) {
      classnames.push('darkBackground');
    }

    if (this.props.customClass) {
      classnames.push(this.props.customClass);
    }

    return (
      <div
        ref="markdown"
        style={this.props.style}
        className={classnames.join(' ')}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
}
