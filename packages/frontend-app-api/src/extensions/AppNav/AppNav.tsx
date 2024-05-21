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

import { z } from 'zod';
import React, { Fragment as SidebarSlice } from 'react';
import PowerIcon from '@material-ui/icons/Power';
import {
  createExtension,
  coreExtensionData,
  createExtensionInput,
  createNavItemExtension,
  createNavLogoExtension,
  createSchemaFromZod,
  useRouteRefResolver,
  RouteRef,
  ExternalRouteRef,
  AppNode,
  ExtensionDataValues,
  ConfigurableExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import {
  Sidebar,
  SidebarDivider,
  SidebarGroup,
  SidebarSpace as SidebarSpacer,
} from '@backstage/core-components';
import { IconComponent } from '@backstage/core-plugin-api';
import { SidebarIcon } from './SidebarIcon';
import { SidebarLogo } from './SidebarLogo';
import { SidebarItem } from './SidebarItem';
import { SidebarDrawer } from './SidebarDrawer';
import { SidebarDropdown } from './SidebarDropdown';
import { SidebarPinner } from './SidebarPinner';
import { SidebarCollapse } from './SidebarCollapse';
import { FeatureFlagged } from '@backstage/core-app-api';

/**
 * TODOS:
 * add scrollable group config
 * add dropdown item subtitle prop
 * create a app nav extension factory
 * write tests and documentation
 */

type GroupConfig =
  | string
  | {
      title: string;
      icon: string;
      spacer?: true;
      featureFlag?: { with: string } | { without: string };
      items: GroupConfig[];
    }
  | {
      type: 'drawer';
      title: string;
      icon: string;
      spacer?: true;
      featureFlag?: { with: string } | { without: string };
      items: GroupConfig[];
    }
  | {
      type: 'dropdown';
      select?: true;
      title: string;
      icon: string;
      spacer?: true;
      featureFlag?: { with: string } | { without: string };
      items: GroupConfig[];
    }
  | {
      type: 'collapse';
      open?: true;
      title: string;
      icon: string;
      spacer?: true;
      featureFlag?: { with: string } | { without: string };
      items: GroupConfig[];
    };

type GroupObject = {
  title: string;
  icon: string | IconComponent;
  spacer?: boolean;
  type?: 'drawer' | 'dropdown' | 'collapse';
  to?: string | RouteRef<undefined> | ExternalRouteRef<undefined>;
  featureFlag?: { with: string } | { without: string };
  items: (
    | {
        input: {
          node: AppNode;
          output: ExtensionDataValues<{
            target: ConfigurableExtensionDataRef<
              typeof createNavItemExtension.targetDataRef
            >['T'];
          }>;
        };
      }
    | GroupObject
  )[];
};

const components = {
  drawer: SidebarDrawer,
  dropdown: SidebarDropdown,
  collapse: SidebarCollapse,
};

export const AppNav = createExtension({
  namespace: 'app',
  name: 'nav',
  attachTo: { id: 'app/layout', input: 'nav' },
  configSchema: createSchemaFromZod(() => {
    const groupSchema: z.ZodType<GroupConfig> = z.union([
      z.string(),
      z.union([
        z
          .object({
            title: z.string(),
            icon: z.string(),
            spacer: z.literal(true).optional(),
            featureFlag: z
              .union([
                z.object({ with: z.string() }),
                z.object({ without: z.string() }),
              ])
              .optional(),
          })
          .extend({
            items: z.lazy(() => groupSchema.array()),
          }),
        z
          .object({
            type: z.literal('drawer'),
            title: z.string(),
            icon: z.string(),
            spacer: z.literal(true).optional(),
            featureFlag: z
              .union([
                z.object({ with: z.string() }),
                z.object({ without: z.string() }),
              ])
              .optional(),
          })
          .extend({
            items: z.lazy(() => groupSchema.array()),
          }),
        z
          .object({
            type: z.literal('dropdown'),
            select: z.literal(true).optional(),
            title: z.string(),
            icon: z.string(),
            spacer: z.literal(true).optional(),
            featureFlag: z
              .union([
                z.object({ with: z.string() }),
                z.object({ without: z.string() }),
              ])
              .optional(),
          })
          .extend({
            items: z.lazy(() => groupSchema.array()),
          }),
        z
          .object({
            type: z.literal('collapse'),
            open: z.literal(true).optional(),
            title: z.string(),
            icon: z.string(),
            spacer: z.literal(true).optional(),
            featureFlag: z
              .union([
                z.object({ with: z.string() }),
                z.object({ without: z.string() }),
              ])
              .optional(),
          })
          .extend({
            items: z.lazy(() => groupSchema.array()),
          }),
      ]),
    ]);

    return z.object({
      pinner: z.boolean().default(false),
      discoveredItemsGroup: z
        .union([
          z.literal(false),
          z.object({
            disabled: z.literal(true).optional(),
            title: z.string().optional(),
            icon: z.string().optional(),
            spacer: z.literal(true).optional(),
            position: z.number().optional(),
            featureFlag: z
              .union([
                z.object({ with: z.string() }),
                z.object({ without: z.string() }),
              ])
              .optional(),
            type: z.enum(['drawer', 'dropdown', 'collapse']).optional(),
          }),
        ])
        .default({}),
      groups: z.array(groupSchema).default([]),
    });
  }),
  inputs: {
    items: createExtensionInput({
      target: createNavItemExtension.targetDataRef,
    }),
    logos: createExtensionInput(
      {
        elements: createNavLogoExtension.logoElementsDataRef,
      },
      {
        singleton: true,
        optional: true,
      },
    ),
  },
  output: {
    element: coreExtensionData.reactElement,
  },
  factory({ inputs, config }) {
    if (!config.groups.length) {
      return {
        element: (
          <Sidebar>
            <SidebarLogo {...inputs.logos?.output.elements} />
            {inputs.items.map(item => (
              <SidebarItem {...item.output.target} key={item.node.spec.id} />
            ))}
          </Sidebar>
        ),
      };
    }

    // Contains autogenerated items that were not grouped manually
    const groupItems = inputs.items.reduce((reducedInputs, input) => {
      const items = Array.from(
        input.node.edges.attachments.get('items') ?? [],
      ).filter(node => !node.spec.disabled);
      if (items?.length) {
        return reducedInputs.set(input.node.spec.id, {
          ...input.output.target,
          type:
            'type' in input.output.target
              ? input.output.target.type ?? 'drawer'
              : undefined,
          items: items.reduce((reducedItems, node) => {
            const target = node.instance?.getData(
              createNavItemExtension.targetDataRef,
            );
            return target
              ? [
                  ...reducedItems,
                  {
                    subgroug: true,
                    input: {
                      node,
                      output: { target },
                    },
                  },
                ]
              : reducedItems;
          }, new Array<GroupObject['items'][0]>()),
        });
      }
      return reducedInputs.set(input.node.spec.id, { input });
    }, new Map<string, GroupObject['items'][0]>());

    const groups = config.groups.reduce(function parseGroup(
      reducedGroups,
      groupConfig,
    ): GroupObject[] {
      if (typeof groupConfig === 'string') {
        const groupItem = groupItems.get(groupConfig);
        // IDEA: Maybe create a item manually if it's not found
        if (!groupItem) return reducedGroups;
        groupItems.delete(groupConfig);
        return [
          ...reducedGroups,
          'input' in groupItem
            ? {
                ...groupItem.input.output.target,
                items: [groupItem],
              }
            : groupItem,
        ];
      }
      return [
        ...reducedGroups,
        {
          ...groupConfig,
          items: groupConfig.items.reduce(
            (reducedGroupItems, groupItemConfig) => {
              if (typeof groupItemConfig === 'string') {
                const groupItem = groupItems.get(groupItemConfig);
                // IDEA: Maybe create a item manually if it's not found
                if (!groupItem) return reducedGroupItems;
                groupItems.delete(groupItemConfig);
                return [...reducedGroupItems, groupItem];
              }
              return parseGroup(reducedGroups, groupItemConfig);
            },
            new Array<GroupObject['items'][0]>(),
          ),
        },
      ];
    },
    new Array<GroupObject>());

    if (
      groupItems.size &&
      config.discoveredItemsGroup &&
      !config.discoveredItemsGroup.disabled
    ) {
      const { position, ...discoveredItemsGroup } = config.discoveredItemsGroup;
      groups.splice(position ?? groups.length, 0, {
        title: 'Extensions',
        icon: PowerIcon,
        type: 'drawer',
        ...discoveredItemsGroup,
        items: Array.from(groupItems.values()),
      });
    }

    const Component = () => {
      const resolveRouteRef = useRouteRefResolver();

      return (
        <Sidebar submenuOptions={{ drawerWidthOpen: 224 }}>
          <SidebarLogo {...inputs.logos?.output.elements} />
          {groups.map(function renderGroup(group, groupIndex) {
            const {
              type,
              title,
              icon,
              to,
              items,
              spacer,
              featureFlag,
              ...props
            } = group;
            const Icon = () => <SidebarIcon id={icon} />;
            const path =
              to && typeof to !== 'string' ? resolveRouteRef(to)?.() : to;

            const isSubGroup = groupIndex > groups.length;

            const itemsChildren = items.map((item, itemIndex) =>
              'input' in item ? (
                <SidebarItem
                  {...item.input.output.target}
                  key={item.input.node.spec.id}
                  type={type}
                />
              ) : (
                // NOTE: Subgroups has index higher than the main groups amount
                renderGroup(item, itemIndex + groups.length)
              ),
            );

            const GroupComponent = type ? components[type] : null;

            const groupChildren = (
              <>
                {GroupComponent ? (
                  <GroupComponent {...props} icon={Icon} title={title}>
                    {itemsChildren}
                  </GroupComponent>
                ) : (
                  itemsChildren
                )}
              </>
            );

            const sidebarGroup = (
              <>
                {isSubGroup ? (
                  groupChildren
                ) : (
                  <>
                    {groupIndex > 0 ? <SidebarDivider /> : null}
                    <SidebarGroup icon={<Icon />} title={title} to={path}>
                      {groupChildren}
                    </SidebarGroup>
                  </>
                )}
                {spacer ? <SidebarSpacer /> : null}
              </>
            );

            // TODO: Understand why we have to refresh the page to see the feature flag changes
            return featureFlag ? (
              <FeatureFlagged key={groupIndex} {...featureFlag}>
                {sidebarGroup}
              </FeatureFlagged>
            ) : (
              <SidebarSlice key={groupIndex}>{sidebarGroup}</SidebarSlice>
            );
          })}
          {config.pinner ? <SidebarPinner /> : null}
        </Sidebar>
      );
    };

    return {
      element: <Component />,
    };
  },
});
