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

import { configApiRef, useApi, useApp } from '@backstage/core-plugin-api';
import Box, { BoxProps } from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import { Theme, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { MouseEventHandler, useState } from 'react';
import { SupportItem, SupportItemLink, useSupportConfig } from '../../hooks';
import { HelpIcon } from '../../icons';
import { Link } from '../Link';
import { coreComponentsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

type SupportButtonProps = {
  title?: string;
  items?: SupportItem[];
  children?: React.ReactNode;
  boxProps?: BoxProps;
};

export type SupportButtonClassKey = 'popoverList';

const useStyles = makeStyles(
  {
    popoverList: {
      minWidth: 260,
      maxWidth: 400,
    },
    menuItem: {
      whiteSpace: 'normal',
    },
  },
  { name: 'BackstageSupportButton' },
);

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
    <MenuItem button={false}>
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
    </MenuItem>
  );
};

export function SupportButton(props: SupportButtonProps) {
  const { t } = useTranslationRef(coreComponentsTranslationRef);
  const { title, items, children, boxProps } = props;
  const { items: configItems } = useSupportConfig();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const classes = useStyles();
  const supportConfig = useApi(configApiRef).getOptionalConfig('app.support');
  const isSmallScreen = useMediaQuery<Theme>(theme =>
    theme.breakpoints.down('sm'),
  );

  const onClickHandler: MouseEventHandler = event => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  const popoverCloseHandler = () => {
    setPopoverOpen(false);
  };

  if (!supportConfig) {
    return null;
  }

  return (
    <>
      <Box display="flex" ml={1} {...boxProps}>
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
            {t('supportButton.title')}
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
        <MenuList
          className={classes.popoverList}
          autoFocusItem={Boolean(anchorEl)}
        >
          {title && (
            <MenuItem
              button={false}
              alignItems="flex-start"
              className={classes.menuItem}
            >
              <Typography variant="subtitle1">{title}</Typography>
            </MenuItem>
          )}
          {React.Children.map(children, (child, i) => (
            <MenuItem
              button={false}
              alignItems="flex-start"
              key={`child-${i}`}
              className={classes.menuItem}
            >
              {child}
            </MenuItem>
          ))}
          {(items ?? configItems).map((item, i) => (
            <SupportListItem item={item} key={`item-${i}`} />
          ))}
        </MenuList>
        <DialogActions>
          <Button
            color="primary"
            onClick={popoverCloseHandler}
            aria-label="Close"
          >
            {t('supportButton.close')}
          </Button>
        </DialogActions>
      </Popover>
    </>
  );
}
