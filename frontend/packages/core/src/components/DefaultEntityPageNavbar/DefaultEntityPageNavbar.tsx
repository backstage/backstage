import React, { FC } from 'react';
import { EntityPageNavbarProps } from '../../api/entityView/types';
import { useEntityUri } from '../..';
import { List, makeStyles, Theme } from '@material-ui/core';
import NavbarItem from './NavbarItem';

const useStyles = makeStyles<Theme>({
  nav: {
    gridArea: 'pageNav',
    width: 220,
    transition: 'width 0.07s, height 0s',
    transitionTimingFunction: 'ease-in',
    backgroundColor: '#eeeeee',
    boxShadow: '0px 0 4px 0px rgba(0,0,0,0.35)',
  },
  list: {
    padding: 0,
  },
});

const DefaultEntityPageNavbar: FC<EntityPageNavbarProps> = ({ navItems }) => {
  const classes = useStyles();
  const entityUri = useEntityUri();

  return (
    <nav className={classes.nav}>
      <List className={classes.list}>
        {navItems.map((navItem, index) => (
          <NavbarItem key={index} navItem={navItem} entityUri={entityUri} />
        ))}
      </List>
    </nav>
  );
};

export default DefaultEntityPageNavbar;
