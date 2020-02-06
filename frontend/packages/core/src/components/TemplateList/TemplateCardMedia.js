import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
  media: {
    color: theme.palette.bursts.fontColor,
    backgroundColor: theme.palette.bursts.backgroundColor.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
    minHeight: 120,
    position: 'relative',
    isolation: 'isolate',
  },
  title: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    lineHeight: 1,
  },
  slackChannel: {
    color: theme.palette.bursts.slackChannelText,
  },
});

export class TemplateCardMedia extends Component {
  render() {
    const { classes, name, ownerName } = this.props;

    return (
      <div className={classes.media}>
        <Typography color="inherit">{ownerName}</Typography>
        <Typography color="inherit" className={classes.title} variant="h6">
          {name}
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(TemplateCardMedia);
