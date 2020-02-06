import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';
import BuildListPage from '../BuildListPage';
import BuildDetailsPage from '../BuildDetailsPage';
import { useRouteMatch } from 'react-router-dom';

const BuildPage: FC<{}> = () => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route
        path={`${match.path}/:buildId`}
        render={({ match }) => (
          <BuildDetailsPage buildId={match.params.buildId} />
        )}
      />
      <Route path={match.path} component={BuildListPage} />
    </Switch>
  );
};

export default BuildPage;
