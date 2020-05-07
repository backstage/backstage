import { Route } from 'react-router';
import React from 'react';
// import { BuildsPage } from 'pages/BuildsPage';
// import { DetailedViewPage } from 'pages/DetailedViewPage';
import { SettingsPage } from 'pages/SettingsPage';
import { Provider } from 'react-redux';
import store from 'state/store';

export const App = () => {
  return (
    <Provider store={store}>
      {/* <Route path="/" component={BuildsPage} />
      <Route path="/build/:buildId" component={DetailedViewPage} /> */}
      <Route path="*" component={SettingsPage} />
    </Provider>
  );
};
