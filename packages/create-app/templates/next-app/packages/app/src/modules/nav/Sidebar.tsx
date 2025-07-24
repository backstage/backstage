import {
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarScrollWrapper,
} from '@backstage/core-components';
import { compatWrapper } from '@backstage/core-compat-api';
import { Sidebar } from '@backstage/core-components';
import { NavContentBlueprint } from '@backstage/frontend-plugin-api';
import { SidebarLogo } from './SidebarLogo';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';

export const SidebarContent = NavContentBlueprint.make({
  params: {
    component: ({ items }) =>
      compatWrapper(
        <Sidebar>
          <SidebarLogo />
          <SidebarGroup label="Menu" icon={<MenuIcon />}>
            {/* Global nav, not org-specific */}
            <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
            <SidebarItem
              icon={CreateComponentIcon}
              to="create"
              text="Create..."
            />
            {/* End global nav */}
            <SidebarDivider />
            <SidebarScrollWrapper>
              {/* Items in this group will be scrollable if they run out of space */}
              {items.map((item, index) => (
                <SidebarItem {...item} key={index} />
              ))}
            </SidebarScrollWrapper>
          </SidebarGroup>
        </Sidebar>,
      ),
  },
});
