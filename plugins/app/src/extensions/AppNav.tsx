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
  NavItemBlueprint,
  NavContentBlueprint,
  NavContentComponentProps,
  routeResolutionApiRef,
  IconComponent,
  RouteRef,
  useApi,
  NavContentComponent,
} from '@backstage/frontend-plugin-api';
import { Sidebar, SidebarItem } from '@backstage/core-components';
import { useMemo } from 'react';

function DefaultNavContent(props: NavContentComponentProps) {
  return (
    <Sidebar>
      {props.items.map((item, index) => (
        <SidebarItem
          to={item.to}
          icon={item.icon}
          text={item.text}
          key={index}
        />
      ))}
    </Sidebar>
  );
}

// This helps defer rendering until the app is being rendered, which is needed
// because the RouteResolutionApi can't be called until the app has been fully initialized.
function NavContentRenderer(props: {
  Content: NavContentComponent;
  items: Array<{
    title: string;
    icon: IconComponent;
    routeRef: RouteRef<undefined>;
  }>;
}) {
  const routeResolutionApi = useApi(routeResolutionApiRef);

  const items = useMemo(() => {
    return props.items.flatMap(item => {
      const link = routeResolutionApi.resolve(item.routeRef);
      if (!link) {
        // eslint-disable-next-line no-console
        console.warn(
          `NavItemBlueprint: unable to resolve route ref ${item.routeRef}`,
        );
        return [];
      }
      return [
        {
          to: link(),
          text: item.title,
          icon: item.icon,
          title: item.title,
          routeRef: item.routeRef,
        },
      ];
    });
  }, [props.items, routeResolutionApi]);

  return <props.Content items={items} />;
}

export const AppNav = createExtension({
  name: 'nav',
  attachTo: { id: 'app/layout', input: 'nav' },
  inputs: {
    items: createExtensionInput([NavItemBlueprint.dataRefs.target]),
    content: createExtensionInput([NavContentBlueprint.dataRefs.component], {
      singleton: true,
      optional: true,
    }),
  },
  output: [coreExtensionData.reactElement],
  *factory({ inputs }) {
    if (inputs.content && inputs.content.node.spec.plugin?.id !== 'app') {
      // eslint-disable-next-line no-console
      console.warn(
        `DEPRECATION WARNING: NavContent should only be installed as an extension in the app plugin. ` +
          `You can either use appPlugin.override(), or a module for the app plugin. The following extension will be ignored in the future: ${inputs.content.node.spec.id}`,
      );
    }

    const Content =
      inputs.content?.get(NavContentBlueprint.dataRefs.component) ??
      DefaultNavContent;

    yield coreExtensionData.reactElement(
      <NavContentRenderer
        items={inputs.items.map(item =>
          item.get(NavItemBlueprint.dataRefs.target),
        )}
        Content={Content}
      />,
    );
  },
});
