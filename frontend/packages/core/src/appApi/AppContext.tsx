import React, { createContext, useContext, FC } from 'react';
import { App } from './types';

const Context = createContext<App | undefined>(undefined);

type Props = {
  app: App;
};

export const AppContextProvider: FC<Props> = ({ app, children }) => (
  <Context.Provider value={app} children={children} />
);

export const useApp = (): App => {
  const app = useContext(Context);
  if (!app) {
    throw new Error('No app context available');
  }
  return app;
};
