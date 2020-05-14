import React from 'react';
import { Switch, Route } from 'react-router';
import { BuildsPage } from '../pages/BuildsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { DetailedViewPage } from '../pages/BuildWithStepsPage';
import { AppStateProvider } from '../state';

export const App = () => (
  <AppStateProvider>
    <Switch>
      <Route path="/circleci" exact component={BuildsPage} />
      <Route path="/circleci/settings" exact component={SettingsPage} />
      <Route
        path="/circleci/build/:buildId"
        exact
        component={DetailedViewPage}
      />
    </Switch>
  </AppStateProvider>
);
