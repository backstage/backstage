/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {
  Fragment,
  useState,
  MouseEventHandler,
  PropsWithChildren,
} from 'react';
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
import HelpIcon from '@material-ui/icons/Help';

// import { EmailIcon, SlackIcon, SupportIcon } from 'shared/icons';
// import { Button, Link } from 'shared/components';
// import { StackOverflow, StackOverflowTag } from 'shared/components/layout';

type Props = {
  slackChannel?: string | string[];
  email?: string | string[];
  plugin?: any;
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

export const SupportButton = ({
  slackChannel = '#backstage',
  email = [],
  children,
}: // plugin,
PropsWithChildren<Props>) => {
  // TODO: get plugin manifest with hook

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const classes = useStyles();

  const onClickHandler: MouseEventHandler = event => {
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
      <Button
        data-testid="support-button"
        color="primary"
        onClick={onClickHandler}
      >
        <HelpIcon className={classes.leftIcon} />
        Support
      </Button>
      <Popover
        data-testid="support-button-popover"
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
                disableTypography
                primary={<Typography>Support</Typography>}
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
              <ListItemText
                disableTypography
                primary={<Typography>Contact</Typography>}
                secondary={
                  <div>
                    {contactEmails.map((em, index) => (
                      <Typography key={index}>
                        <Link>{em}</Link>
                      </Typography>
                    ))}
                  </div>
                }
              />
            </ListItem>
          )}
        </List>
      </Popover>
    </Fragment>
  );
};
