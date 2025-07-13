

import { createContext } from 'react';

export interface SidebarContextType {
  isCollapsed: boolean;
  expandedGroups: Record<string, boolean>;
  onGroupToggle: (groupId: string, expanded: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  expandedGroups: {},
  onGroupToggle: () => {},
}); 
