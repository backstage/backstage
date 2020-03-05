import React, { FC } from 'react';
import { EntityLink } from '../..';
import {
  ListItem,
  makeStyles,
  Theme,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { EntityPageNavItem } from '../../api/entityView/types';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    display: 'block',
    overflow: 'hidden',
    borderBottom: `1px solid #d9d9d9`,
  },
  label: {
    color: '#333',
    fontWeight: 'bolder',
    whiteSpace: 'nowrap',
    lineHeight: 1.0,
  },
  iconImg: {
    width: 24,
    height: 24,
  },
  icon: {
    margin: theme.spacing(0.5, 2, 0.5, 0),
    minWidth: 0,
    fontSize: 24,
  },
  expand: {
    color: 'white',
  },
}));

type Props = {
  navItem: EntityPageNavItem;
  entityUri: string;
};

const NavbarItem: FC<Props> = ({ navItem, entityUri }) => {
  const classes = useStyles();
  const IconComponent = navItem.icon;

  return (
    <EntityLink
      className={classes.root}
      uri={entityUri}
      subPath={navItem.target}
    >
      <ListItem button className={`${classes.listItemGutters}`}>
        <ListItemIcon className={classes.icon}>
          <IconComponent fontSize="inherit" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="subtitle1" className={classes.label}>
              {navItem.title}
            </Typography>
          }
          disableTypography
        />
      </ListItem>
    </EntityLink>
  );
};

export default NavbarItem;
