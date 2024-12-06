/*
 * Copyright 2023 The Backstage Authors
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
  createExtension,
  coreExtensionData,
  createExtensionInput,
  useRouteRef,
  NavItemBlueprint,
  NavLogoBlueprint,
} from '@backstage/frontend-plugin-api';
import { makeStyles } from '@material-ui/core/styles';
import {
  Sidebar,
  useSidebarOpenState,
  Link,
  sidebarConfig,
  SidebarDivider,
  SidebarItem,
} from '@backstage/core-components';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import LogoIcon from '../../../../packages/app/src/components/Root/LogoIcon';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import LogoFull from '../../../../packages/app/src/components/Root/LogoFull';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo = (
  props: (typeof NavLogoBlueprint.dataRefs.logoElements)['T'],
) => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen
          ? props?.logoFull ?? <LogoFull />
          : props?.logoIcon ?? <LogoIcon />}
      </Link>
    </div>
  );
};

const SidebarNavItem = (
  props: (typeof NavItemBlueprint.dataRefs.target)['T'],
) => {
  const { icon: Icon, title, routeRef } = props;
  const link = useRouteRef(routeRef);
  if (!link) {
    return null;
  }
  // TODO: Support opening modal, for example, the search one
  return <SidebarItem to={link()} icon={Icon} text={title} />;
};

export const AppNav = createExtension({
  name: 'nav',
  attachTo: { id: 'app/layout', input: 'nav' },
  inputs: {
    items: createExtensionInput([NavItemBlueprint.dataRefs.target]),
    logos: createExtensionInput([NavLogoBlueprint.dataRefs.logoElements], {
      singleton: true,
      optional: true,
    }),
  },
  output: [coreExtensionData.reactElement],
  factory: ({ inputs }) => [
    coreExtensionData.reactElement(
      <Sidebar>
        <SidebarLogo
          {...inputs.logos?.get(NavLogoBlueprint.dataRefs.logoElements)}
        />
        <SidebarDivider />
        {inputs.items.map((item, index) => (
          <SidebarNavItem
            {...item.get(NavItemBlueprint.dataRefs.target)}
            key={index}
          />
        ))}
      </Sidebar>,
    ),
  ],
});
