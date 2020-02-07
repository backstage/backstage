import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import { InfoCard, CircleProgress } from '@backstage/core';

const styles = {
  root: {
    height: '100%',
    width: 250,
  },
};

class ProgressCard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    subheader: PropTypes.string,
    progress: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    deepLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
      }),
    ]),
    gacontext: PropTypes.string,
  };

  render() {
    const {
      title,
      subheader,
      progress,
      deepLink,
      classes,
      variant,
    } = this.props;
    const link =
      deepLink &&
      (typeof deepLink === 'string'
        ? { title: 'View more', link: deepLink }
        : deepLink);
    return (
      <div className={classes.root}>
        <InfoCard
          title={title}
          subheader={subheader}
          deepLink={link}
          variant={variant}
        >
          <CircleProgress value={progress} />
        </InfoCard>
      </div>
    );
  }
}

export default withStyles(styles)(ProgressCard);
