import React, { FC, Fragment, useState } from 'react';
import {
  Button,
  Link,
  List,
  ListItem,
  ListItemIcon,
  Popover,
  Typography,
  makeStyles,
  ListItemText,
} from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
// import { EmailIcon, SlackIcon, SupportIcon } from 'shared/icons';
// import { Button, Link } from 'shared/components';
// import { StackOverflow, StackOverflowTag } from 'shared/components/layout';

type Props = {
  slackChannel: string | string[];
  email: string | string[];
  plugin: any;
};

const useStyles = makeStyles(theme => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  popoverList: {
    minWidth: 260,
    maxWidth: 320,
  },
}));

const SupportButton: FC<Props> = ({
  slackChannel = '#backstage',
  email = [],
  children,
  // plugin,
}) => {
  // TODO: get plugin manifest with hook

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const onClickHandler = event => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  const popoverCloseHandler = () => {
    setPopoverOpen(false);
  };

  // const tags = plugin ? plugin.stackoverflowTags : undefined;
  const slackChannels = Array.isArray(slackChannel)
    ? slackChannel
    : [slackChannel];
  const contactEmails = Array.isArray(email) ? email : [email];

  return (
    <Fragment>
      <Button color="primary" onClick={onClickHandler}>
        <GroupIcon className={classes.leftIcon} />
        Support
      </Button>
      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={popoverCloseHandler}
      >
        <List className={classes.popoverList}>
          {React.Children.map(children, (child, i) => (
            <ListItem alignItems="flex-start" key={i}>
              {child}
            </ListItem>
          ))}
          {/* {tags && tags.length > 0 && (
            <ListItem alignItems="flex-start">
              <StackOverflow>
                {tags.map((tag, i) => (
                  <StackOverflowTag key={i} tag={tag} />
                ))}
              </StackOverflow>
            </ListItem>
          )} */}
          {slackChannels && (
            <ListItem>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText
                primary="Support"
                secondary={
                  <div>
                    {slackChannels.map((channel, i) => (
                      <Link key={i}>{channel}</Link>
                    ))}
                  </div>
                }
              />
            </ListItem>
          )}
          {contactEmails.length > 0 && (
            <ListItem>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Contact" />
              {contactEmails.map((email, index) => (
                <Typography key={index}>
                  <Link>{email}</Link>
                </Typography>
              ))}
            </ListItem>
          )}
        </List>
      </Popover>
    </Fragment>
  );
};

export default SupportButton;
