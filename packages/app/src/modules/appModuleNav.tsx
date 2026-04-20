/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Link,
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarScrollWrapper,
  SidebarSpace,
  useSidebarOpenState,
} from '@backstage/core-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faBars,
  faBook,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { NavContentBlueprint } from '@backstage/plugin-app-react';
import { SidebarSearchModal } from '@backstage/plugin-search';
import { NotificationsSidebarItem } from '@backstage/plugin-notifications';
import {
  Settings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';

const SidebarLogo = () => {
  const { isOpen } = useSidebarOpenState();

  return (
    <div
      className="flex flex-row flex-nowrap items-center -mb-3.5"
      style={{
        width: sidebarConfig.drawerWidthClosed,
        height: 3 * sidebarConfig.logoHeight,
      }}
    >
      <Link
        to="/"
        className="ml-6 no-underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset rounded"
        style={
          {
            width: sidebarConfig.drawerWidthClosed,
            '--tw-ring-color': '#fff',
          } as React.CSSProperties
        }
        aria-label="Home"
      >
        {isOpen ? (
          <svg
            style={{
              width: 'auto',
              height: 30,
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 151 57"
            fill="none"
          >
            <path
              d="M56.7604 13.175H68.4708C70.3297 13.175 71.9395 13.4744 73.2973 14.0703C74.6551 14.6691 75.6898 15.5141 76.4043 16.6051C77.1158 17.699 77.4745 18.9709 77.4745 20.4235C77.4745 21.8762 77.1691 23.0621 76.5584 24.1412C75.9477 25.2204 75.0939 26.0594 74.0029 26.6553C72.9089 27.2541 71.6638 27.5595 70.2674 27.5713L70.3089 26.7768C71.9246 26.8035 73.3477 27.1415 74.5751 27.7848C75.8024 28.4281 76.757 29.3146 77.4359 30.4411C78.1149 31.5677 78.4528 32.8455 78.4528 34.2685C78.4528 35.8991 78.0882 37.3221 77.3648 38.5436C76.6385 39.765 75.5979 40.7078 74.24 41.3748C72.8822 42.0389 71.2724 42.3739 69.4136 42.3739H56.7693V13.175H56.7604ZM60.8339 37.9981H68.0825C69.6834 37.9981 70.9048 37.6304 71.7468 36.8982C72.5887 36.1659 73.0097 35.0986 73.0097 33.7023C73.0097 32.386 72.6065 31.375 71.7972 30.6694C70.9878 29.9638 69.8316 29.611 68.3255 29.611H61.3201V25.2737H67.7356C69.1052 25.2737 70.1755 24.9209 70.9433 24.2154C71.7112 23.5098 72.0936 22.5047 72.0936 21.2003C72.0936 20.047 71.6993 19.1517 70.9137 18.5113C70.1251 17.8739 69.0815 17.5538 67.7771 17.5538H60.7716L62.076 16.7177V39.0564L60.8339 37.9981Z"
              fill="#FFFFFF"
            />
            <path
              d="M80.3621 13.175H85.5354V42.3769H80.3621V13.175Z"
              fill="#FFFFFF"
            />
            <path
              d="M88.2659 12.9911H93.8246V17.9599H88.2659V12.9911ZM88.4497 20.9957H93.623V42.3769H88.4497V20.9957Z"
              fill="#FFFFFF"
            />
            <path
              d="M102.054 42.1426C101.091 41.7276 100.344 41.0665 99.8132 40.1563C99.2825 39.2462 99.0187 38.0514 99.0187 36.5721V24.9862H95.3544V20.9957H95.802C96.7122 20.9957 97.4533 20.8564 98.0314 20.5777C98.6096 20.299 99.0424 19.8484 99.3359 19.2229C99.6264 18.5973 99.8014 17.7702 99.8547 16.7385L99.9555 14.6395H104.171V21.4197L103.519 20.9928H108.835V24.9832H104.171V36.0206C104.171 36.9456 104.403 37.6008 104.865 37.9951C105.327 38.3894 105.986 38.5851 106.839 38.5851C107.424 38.5851 107.966 38.5228 108.47 38.4012V42.3709C108.034 42.4925 107.575 42.5874 107.086 42.6555C106.596 42.7237 106.08 42.7563 105.538 42.7563C104.18 42.7563 103.021 42.5488 102.054 42.1367V42.1426Z"
              fill="#FFFFFF"
            />
            <path
              d="M110.954 38.3242L123.661 23.071V25.0455H110.934V20.9928H128.283V25.1047L115.312 40.4587V38.3005H128.65V42.3739H110.954V38.3212V38.3242Z"
              fill="#FFFFFF"
            />
            <path
              d="M132.774 50.3785C132.264 50.3103 131.793 50.2095 131.36 50.0731V45.635C131.713 45.7714 132.081 45.8692 132.46 45.9315C132.84 45.9937 133.219 46.0234 133.601 46.0234C134.322 46.0234 134.941 45.887 135.463 45.6172C135.985 45.3445 136.45 44.9087 136.86 44.3039C137.266 43.6991 137.666 42.869 138.06 41.8106L138.487 44.295L129.875 20.9987H135.454L141.582 39.5901H139.504L145.104 20.9987H150.5L142.804 43.2959C142.235 44.9531 141.556 46.305 140.767 47.3575C139.978 48.4099 139.062 49.1926 138.019 49.7085C136.972 50.2243 135.766 50.4822 134.393 50.4822C133.824 50.4822 133.284 50.4467 132.774 50.3814V50.3785Z"
              fill="#FFFFFF"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.7786 13.1196C13.0094 11.8889 15.0047 11.8889 16.2354 13.1196L29.1347 26.0189C29.7257 26.6099 30.0577 27.4115 30.0577 28.2473C30.0577 29.0831 29.7257 29.8847 29.1347 30.4757L16.2354 43.3749C15.0047 44.6056 13.0094 44.6056 11.7786 43.3749C10.5479 42.1442 10.5479 40.1488 11.7786 38.9181L22.4495 28.2473L11.7786 17.5765C10.5479 16.3457 10.5479 14.3504 11.7786 13.1196Z"
              fill="#FFFFFF"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.5 11.574C0.5 5.18199 5.68199 0 12.074 0H26.0257C38.2344 0 44.3511 14.7641 35.7162 23.399L34.0945 25.0207C32.8638 26.2514 30.8684 26.2514 29.6377 25.0207C28.407 23.79 28.407 21.7946 29.6377 20.5639L31.2594 18.9422C35.9239 14.2777 32.6189 6.30287 26.0257 6.30287H12.074C9.16297 6.30287 6.80287 8.66297 6.80287 11.574V44.9176C6.80287 47.8286 9.16297 50.1887 12.074 50.1887H26.0257C32.621 50.1887 35.9246 42.2146 31.2594 37.5494L29.6377 35.9277C28.407 34.697 28.407 32.7016 29.6377 31.4709C30.8684 30.2402 32.8638 30.2402 34.0945 31.4709L35.7162 33.0926C44.3505 41.7269 38.2383 56.4916 26.0257 56.4916H12.074C5.68199 56.4916 0.5 51.3096 0.5 44.9176V11.574Z"
              fill="#FFFFFF"
            />
          </svg>
        ) : (
          <svg
            style={{
              width: 'auto',
              height: 28,
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 51 73"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.1778 16.7835C15.7524 15.2089 18.3054 15.2089 19.88 16.7835L36.3837 33.2873C37.1399 34.0434 37.5647 35.069 37.5647 36.1384C37.5647 37.2077 37.1399 38.2333 36.3837 38.9894L19.88 55.4932C18.3054 57.0678 15.7524 57.0678 14.1778 55.4932C12.6032 53.9186 12.6032 51.3656 14.1778 49.791L27.8304 36.1384L14.1778 22.4857C12.6032 20.9111 12.6032 18.3581 14.1778 16.7835Z"
              fill="#FFFFFF"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.166016 14.8082C0.166016 6.63003 6.79605 0 14.9743 0H32.8246C48.4448 0 56.2708 18.8897 45.2229 29.9376L43.1481 32.0124C41.5734 33.587 39.0205 33.587 37.4459 32.0124C35.8712 30.4378 35.8712 27.8848 37.4459 26.3102L39.5207 24.2354C45.4886 18.2675 41.2602 8.06412 32.8246 8.06412H14.9743C11.2497 8.06412 8.23013 11.0837 8.23013 14.8082V57.4692C8.23013 61.1937 11.2497 64.2133 14.9743 64.2133H32.8246C41.2627 64.2133 45.4895 54.0108 39.5207 48.042L37.4459 45.9672C35.8712 44.3926 35.8712 41.8396 37.4459 40.265C39.0205 38.6904 41.5734 38.6904 43.1481 40.265L45.2229 42.3398C56.2699 53.3869 48.4498 72.2774 32.8246 72.2774H14.9743C6.79605 72.2774 0.166016 65.6474 0.166016 57.4692V14.8082Z"
              fill="#FFFFFF"
            />
          </svg>
        )}
      </Link>
    </div>
  );
};

export const appModuleNav = createFrontendModule({
  pluginId: 'app',
  extensions: [
    NavContentBlueprint.make({
      params: {
        component: ({ navItems }) => {
          const nav = navItems.withComponent(item => (
            <SidebarItem
              icon={() => item.icon}
              to={item.href}
              text={item.title}
            />
          ));
          nav.take('page:home'); // Skip home — rendered as SidebarLogo
          return (
            <Sidebar>
              <SidebarLogo />
              <SidebarGroup
                label="Search"
                icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                to="/search"
              >
                <SidebarSearchModal />
              </SidebarGroup>
              <SidebarDivider />
              <SidebarGroup
                label="Menu"
                icon={<FontAwesomeIcon icon={faBars} />}
              >
                {nav.take('page:catalog')}
                {nav.take('page:scaffolder')}
                {nav.take('page:api-docs')}
                <SidebarItem
                  icon={() => <FontAwesomeIcon icon={faBook} />}
                  to="/docs"
                  text="Docs"
                />
                <SidebarDivider />
                <SidebarScrollWrapper>
                  {nav.rest({ sortBy: 'title' })}
                </SidebarScrollWrapper>
              </SidebarGroup>
              <SidebarDivider />
              <SidebarSpace />
              <SidebarDivider />
              <SidebarGroup
                label="Settings"
                icon={<UserSettingsSignInAvatar />}
                to="/settings"
              >
                <NotificationsSidebarItem />
                <Settings />
              </SidebarGroup>
            </Sidebar>
          );
        },
      },
    }),
  ],
});
