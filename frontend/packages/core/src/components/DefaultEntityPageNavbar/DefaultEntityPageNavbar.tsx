import React, { FC } from 'react';
import { EntityPageNavbarProps } from '../../api/entityView/types';
import { useEntityUri, EntityLink } from '../..';
import { List, ListItem } from '@material-ui/core';

const DefaultEntityPageNavbar: FC<EntityPageNavbarProps> = ({ navItems }) => {
  const entityUri = useEntityUri();

  return (
    <List>
      {navItems.map(({ title, target }) => (
        <ListItem key={target}>
          <EntityLink uri={entityUri} subPath={target}>
            {title}
          </EntityLink>
        </ListItem>
      ))}
    </List>
  );
};

export default DefaultEntityPageNavbar;
