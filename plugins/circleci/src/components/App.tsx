import React from 'react';
import { Switch, Route } from 'react-router';
import { BuildsPage } from '../pages/BuildsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { DetailedViewPage } from '../pages/DetailedViewPage';
import { Store } from './Store';

export const App = () => (
  <Store>
    <Switch>
      <Route path="/circleci" exact component={BuildsPage} />
      <Route path="/circleci/settings" exact component={SettingsPage} />
      <Route
        path="/circleci/build/:buildId"
        exact
        component={DetailedViewPage}
      />
    </Switch>
  </Store>
);
