/*
 * Copyright 2020 The Backstage Authors
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

import { useApp } from '@backstage/core-plugin-api';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { MouseEventHandler, useState } from 'react';
import { SupportItem, SupportItemLink, useSupportConfig } from '../../hooks';
import { HelpIcon } from '../../icons';
import { Link } from '../Link';
import { Theme } from '@mui/material/styles';

type SupportButtonProps = {
  title?: string;
  items?: SupportItem[];
  children?: React.ReactNode;
};

export type SupportButtonClassKey = 'popoverList';

const useStyles = makeStyles({ name: 'BackstageSupportButton' })({
  popoverList: {
    minWidth: 260,
    maxWidth: 400,
  },
});

const SupportIcon = ({ icon }: { icon: string | undefined }) => {
  const app = useApp();
  const Icon = icon ? app.getSystemIcon(icon) ?? HelpIcon : HelpIcon;
  return <Icon />;
};

const SupportLink = ({ link }: { link: SupportItemLink }) => (
  <Link to={link.url}>{link.title ?? link.url}</Link>
);

const SupportListItem = ({ item }: { item: SupportItem }) => {
  return (
    <ListItem>
      <ListItemIcon>
        <SupportIcon icon={item.icon} />
      </ListItemIcon>
      <ListItemText
        primary={item.title}
        secondary={item.links?.reduce<React.ReactNode[]>(
          (prev, link, idx) => [
            ...prev,
            idx > 0 && <br key={idx} />,
            <SupportLink link={link} key={link.url} />,
          ],
          [],
        )}
      />
    </ListItem>
  );
};

export function SupportButton(props: SupportButtonProps) {
  const { title, items, children } = props;
  const { items: configItems } = useSupportConfig();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { classes } = useStyles();
  const isSmallScreen = useMediaQuery<Theme>(theme =>
    theme.breakpoints.down('md'),
  );

  const onClickHandler: MouseEventHandler = event => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  const popoverCloseHandler = () => {
    setPopoverOpen(false);
  };

  return (
    <>
      <Box display="flex" ml={1}>
        {isSmallScreen ? (
          <IconButton
            color="primary"
            size="small"
            onClick={onClickHandler}
            data-testid="support-button"
            aria-label="Support"
          >
            <HelpIcon />
          </IconButton>
        ) : (
          <Button
            data-testid="support-button"
            aria-label="Support"
            color="primary"
            onClick={onClickHandler}
            startIcon={<HelpIcon />}
          >
            Support
          </Button>
        )}
      </Box>
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
          {title && (
            <ListItem alignItems="flex-start">
              <Typography variant="subtitle1">{title}</Typography>
            </ListItem>
          )}
          {React.Children.map(children, (child, i) => (
            <ListItem alignItems="flex-start" key={`child-${i}`}>
              {child}
            </ListItem>
          ))}
          {(items ?? configItems).map((item, i) => (
            <SupportListItem item={item} key={`item-${i}`} />
          ))}
        </List>
        <DialogActions>
          <Button
            color="primary"
            onClick={popoverCloseHandler}
            aria-label="Close"
          >
            Close
          </Button>
        </DialogActions>
      </Popover>
    </>
  );
}
