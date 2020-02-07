import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { EntityPageProps } from '../../api/entityView/types';
import { useEntity } from '../../api';
import { Switch, Route, Redirect } from 'react-router-dom';
import DefaultEntityPageHeader from '../DefaultEntityPageHeader';
import DefaultEntityPageNavbar from '../DefaultEntityPageNavbar';

const useStyles = makeStyles<Theme>({
  root: {
    display: 'grid',
    gridTemplateAreas: `
      'header header'
      'navbar content'
    `,
    gridTemplateRows: 'auto 1fr',
    gridTemplateColumns: 'auto 1fr',
    minHeight: '100%',
  },
  header: {
    gridArea: 'header',
  },
  navbar: {
    gridArea: 'navbar',
  },
  content: {
    gridArea: 'content',
  },
});

const DefaultEntityPage: FC<EntityPageProps> = ({ navItems, views }) => {
  const classes = useStyles();
  const { kind, id } = useEntity();
  const basePath = `/entity/${kind}/${id}`;

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <DefaultEntityPageHeader />
      </div>
      <div className={classes.navbar}>
        <DefaultEntityPageNavbar navItems={navItems} />
      </div>
      <div className={classes.content}>
        <Switch>
          {views.map(({ path, component }) => (
            <Route
              key={path}
              exact
              path={`${basePath}${path}`}
              component={component}
            />
          ))}
          <Redirect from={basePath} to={`${basePath}${views[0].path}`} />
        </Switch>
      </div>
    </div>
  );
};

export default DefaultEntityPage;
