import React, { FC } from 'react';
import { EntityPageProps } from '../../api/entityView/types';
import { useEntity } from '../../api';
import { Switch, Route, Redirect } from 'react-router-dom';
import DefaultEntityPageHeader from '../DefaultEntityPageHeader';
import DefaultEntityPageNavbar from '../DefaultEntityPageNavbar';

const DefaultEntityPage: FC<EntityPageProps> = ({ navItems, views }) => {
  const { kind, id } = useEntity();
  const basePath = `/entity/${kind}/${id}`;

  return (
    <div>
      <DefaultEntityPageHeader />
      <DefaultEntityPageNavbar navItems={navItems} />
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
  );
};

export default DefaultEntityPage;
