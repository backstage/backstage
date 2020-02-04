import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import PenguinIcon from 'cdn/sadpenguin.png';
import Link from 'shared/components/Link';

class DataNotFound extends React.Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    error: PropTypes.string,
    info: PropTypes.node,
  };

  render() {
    const error = this.props.error || 'The data could not be retrieved.';
    const info = this.props.info || (
      <span>
        Reach out to us <Link slackChannel="backstage" /> to get it sorted out.
      </span>
    );

    return (
      <div align="center">
        <div align="center" style={{ maxWidth: 500, marginTop: 120 }}>
          <img src={PenguinIcon} alt="empty" style={{ width: 160, opacity: 0.3 }} />
          <Typography variant="h6">Not found</Typography>
          <p>Error: {error}</p>
          <p>{info}</p>
        </div>
      </div>
    );
  }
}

export default DataNotFound;
