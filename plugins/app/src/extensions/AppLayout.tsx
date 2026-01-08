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
} from '@backstage/frontend-plugin-api';
import { SidebarPage } from '@backstage/core-components';
import { PluginRouteProvider, usePluginRoute } from './PluginRouteContext';

type ReactElementOutput = (typeof coreExtensionData.reactElement)['T'];

type AppLayoutComponentProps = {
  nav: ReactElementOutput;
  content: ReactElementOutput;
};

export function AppLayoutComponent({ nav, content }: AppLayoutComponentProps) {
  const { pluginId } = usePluginRoute();

  return (
    <SidebarPage>
      {nav}
      <div data-plugin={pluginId}>{content}</div>
    </SidebarPage>
  );
}

export const AppLayout = createExtension({
  name: 'layout',
  attachTo: { id: 'app/root', input: 'children' },
  inputs: {
    nav: createExtensionInput([coreExtensionData.reactElement], {
      singleton: true,
    }),
    content: createExtensionInput([coreExtensionData.reactElement], {
      singleton: true,
    }),
  },
  output: [coreExtensionData.reactElement],
  factory: ({ inputs, node }) => {
    const navElement = inputs.nav.get(coreExtensionData.reactElement);
    const contentElement = inputs.content.get(coreExtensionData.reactElement);

    return [
      coreExtensionData.reactElement(
        <PluginRouteProvider initialPluginId={node.spec.plugin.id}>
          <AppLayoutComponent nav={navElement} content={contentElement} />
        </PluginRouteProvider>,
      ),
    ];
  },
});
