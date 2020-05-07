import { Route } from 'react-router';
import React from 'react';
import { BuildsPage } from 'pages/BuildsPage';
import { DetailedViewPage } from 'pages/DetailedViewPage';
import { SettingsPage } from 'pages/SettingsPage';

type AppState = {
  token: string;
  owner: string;
  repo: string;
};

type AppAction =
  | { type: 'setToken'; payload: string }
  | { type: 'setOwner'; payload: string }
  | { type: 'setRepo'; payload: string };

const initialState: AppState = { token: '', owner: '', repo: '' };

function reducer(state: AppState, action: AppAction) {
  switch (action.type) {
    case 'setToken':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

const Context = React.createContext(42);

export const App = () => {
  return (
    <Context.Provider value={42}>
      <Route path="/" component={BuildsPage} />
      <Route path="/build/:buildId" component={DetailedViewPage} />
      <Route path="/settings" component={SettingsPage} />
    </Context.Provider>
  );
};
