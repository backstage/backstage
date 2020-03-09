import { createContext } from 'react';

export const sidebarConfig = {
  drawerWidthClosed: 64,
  drawerWidthOpen: 220,
  defaultOpenDelayMs: 400,
  defaultCloseDelayMs: 200,
};

export const SidebarContext = createContext<boolean>(false);
