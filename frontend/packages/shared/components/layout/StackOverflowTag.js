import React, { Component } from 'react';
import { Chip } from '@material-ui/core';
import PropTypes from 'prop-types';

import Link from 'shared/components/Link';

export default class StackOverflowTag extends Component {
  static propTypes = {
    tag: PropTypes.string.isRequired,
  };

  render() {
    const { tag } = this.props;
    const url = `https://spotify.stackenterprise.co/questions/tagged/${tag}`;

    return (
      <Link to={url}>
        <Chip label={tag} clickable />
      </Link>
    );
  }
}
