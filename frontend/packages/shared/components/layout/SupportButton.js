import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { List, ListItem, ListItemIcon, Popover, Typography, withStyles } from '@material-ui/core';
import { withPluginContext } from 'core/app/withPluginContext';
import { EmailIcon, SlackIcon, SupportIcon } from 'shared/icons';
import { Button, Link } from 'shared/components';
import { StackOverflow, StackOverflowTag } from 'shared/components/layout';

class SupportButton extends Component {
  static defaultProps = {
    slackChannel: '#backstage',
  };

  static propTypes = {
    slackChannel: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  };

  state = {
    popoverOpen: false,
    anchorEl: null,
  };

  button_clickHandler = event => {
    this.setState({ anchorEl: event.currentTarget, popoverOpen: true });
  };

  popover_closeHandler = () => {
    this.setState({ popoverOpen: false });
  };

  render() {
    const { slackChannel, email, children, classes, plugin } = this.props;
    const tags = plugin ? plugin.stackoverflowTags : undefined; // plugin is undefined on base routes
    const { popoverOpen, anchorEl } = this.state;
    const slackChannels = slackChannel ? (Array.isArray(slackChannel) ? slackChannel : [slackChannel]) : null;
    const contactEmails = email ? (Array.isArray(email) ? email : [email]) : null;

    return (
      <Fragment>
        <Button color="primary" onClick={this.button_clickHandler}>
          <SupportIcon className={classes.leftIcon} />
          Support
        </Button>
        <Popover
          open={popoverOpen}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          onClose={this.popover_closeHandler}
          gacontext="Support"
        >
          <List className={classes.popoverList}>
            {React.Children.map(children, (child, index) => (
              <ListItem alignItems="flex-start" key={index}>
                {child}
              </ListItem>
            ))}
            {tags && tags.length > 0 && (
              <ListItem alignItems="flex-start">
                <StackOverflow>
                  {tags.map((tag, idx) => (
                    <StackOverflowTag key={idx} tag={tag} />
                  ))}
                </StackOverflow>
              </ListItem>
            )}
            {slackChannels && (
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <SlackIcon />
                </ListItemIcon>
                <div>
                  <Typography variant="subtitle1">Support</Typography>
                  {slackChannels.map((channel, index) => (
                    <Typography key={index}>
                      <Link slackChannel={channel}>{channel}</Link>
                    </Typography>
                  ))}
                </div>
              </ListItem>
            )}
            {contactEmails && (
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <div>
                  <Typography variant="subtitle1">Contact</Typography>
                  {contactEmails.map((email, index) => (
                    <Typography key={index}>
                      <Link email={email}>{email}</Link>
                    </Typography>
                  ))}
                </div>
              </ListItem>
            )}
          </List>
        </Popover>
      </Fragment>
    );
  }
}

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  popoverList: {
    minWidth: 260,
    maxWidth: 320,
  },
});

export default compose(withStyles(styles), withPluginContext)(SupportButton);
