import {
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarScrollWrapper,
  SidebarSpace,
} from '@backstage/core-components';
import { compatWrapper } from '@backstage/core-compat-api';
import { Sidebar } from '@backstage/core-components';
import {
  featureFlagsApiRef,
  NavContentBlueprint,
  useApi,
} from '@backstage/frontend-plugin-api';
import { SidebarLogo } from './SidebarLogo';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  UserSettingsSignInAvatar,
  Settings as SidebarSettings,
} from '@backstage/plugin-user-settings';

export const SidebarContent = NavContentBlueprint.make({
  params: {
    component: ({ items }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const featureFlagsApi = useApi(featureFlagsApiRef);
      return compatWrapper(
        <Sidebar>
          <SidebarLogo />
          <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
            <SidebarSearchModal />
          </SidebarGroup>
          <SidebarDivider />
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
              {items
                .filter(
                  item =>
                    !item.featureFlag ||
                    featureFlagsApi.isActive(item.featureFlag),
                )
                .map(item => (
                  <SidebarItem {...item} key={item.id} />
                ))}
            </SidebarScrollWrapper>
          </SidebarGroup>
          <SidebarSpace />
          <SidebarDivider />
          <SidebarGroup
            label="Settings"
            icon={<UserSettingsSignInAvatar />}
            to="/settings"
          >
            <SidebarSettings />
          </SidebarGroup>
        </Sidebar>,
      );
    },
  },
});
