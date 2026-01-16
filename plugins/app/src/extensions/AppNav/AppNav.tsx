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
  routeResolutionApiRef,
  useApi,
  NavItem,
  NavContentComponent,
  NavContentItem,
} from '@backstage/frontend-plugin-api';

import { useMemo } from 'react';
import { DefaultNavContent } from './DefaultNavContent';

// This helps defer rendering until the app is being rendered, which is needed
// because the RouteResolutionApi can't be called until the app has been fully initialized.
function NavContentRenderer(props: {
  Content: NavContentComponent;
  items: Array<NavItem>;
}) {
  const routeResolutionApi = useApi(routeResolutionApiRef);

  const items = useMemo(() => {
    const validItems = props.items.filter(item => {
      if ('CustomComponent' in item && item.CustomComponent) {
        return true;
      }
      const link = routeResolutionApi.resolve(item.routeRef);
      if (!link) {
        // eslint-disable-next-line no-console
        console.warn(
          `NavItemBlueprint: unable to resolve route ref ${item.routeRef}`,
        );
        return false;
      }
      return true;
    });

    return validItems.map(item => {
      if ('CustomComponent' in item && item.CustomComponent) {
        return {
          ...item,
          to: undefined,
          text: undefined,
        } satisfies NavContentItem;
      }
      const link = routeResolutionApi.resolve(item.routeRef)!;
      return {
        ...item,
        to: link(),
        text: item.title,
      } satisfies NavContentItem;
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
