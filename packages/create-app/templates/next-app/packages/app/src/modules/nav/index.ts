import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { SidebarContent } from './Sidebar';

export const navModule = createFrontendModule({
  pluginId: 'app',
  extensions: [SidebarContent],
});
