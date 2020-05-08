import React from 'react';
import { Route, Switch } from 'react-router';
import { Provider, useDispatch } from 'react-redux';
import { BuildsPage } from './pages/BuildsPage';
import { DetailedViewPage } from './pages/DetailedViewPage';
import { SettingsPage } from './pages/SettingsPage';

import store, { Dispatch } from './state/store';

const RehydrateSettings = () => {
  const dispatch: Dispatch = useDispatch();

  React.useEffect(() => {
    dispatch.settings.rehydrate();
  }, []);
  return null;
};
export const App = () => {
  return (
    <Provider store={store}>
      <>
        <RehydrateSettings />
        <Switch>
          <Route path="/circleci" component={BuildsPage} exact />
          <Route path="/circleci/settings" component={SettingsPage} />
          <Route path="/circleci/build/:buildId" component={DetailedViewPage} />
        </Switch>
      </>
    </Provider>
  );
};
