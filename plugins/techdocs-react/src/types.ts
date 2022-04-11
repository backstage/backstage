/*
 * Copyright 2022 The Backstage Authors
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

import { ComponentType } from 'react';

/**
 * Locations for which TechDocs addons may be declared and rendered.
 * @alpha
 */
export enum TechDocsAddonLocations {
  /**
   * These addons fill up the header from the right, on the same line as the
   * title.
   */
  HEADER = 'header',

  /**
   * These addons appear below the header and above all content; tooling addons
   * can be inserted for convenience.
   */
  SUBHEADER = 'subheader',

  /**
   * These addons appear left of the content and above the navigation.
   */
  PRIMARY_SIDEBAR = 'primary sidebar',

  /**
   * These addons appear right of the content and above the table of contents.
   */
  SECONDARY_SIDEBAR = 'secondary sidebar',

  /**
   * A virtual location which allows mutation of all content within the shadow
   * root by transforming DOM nodes. These addons should return null on render.
   */
  CONTENT = 'content',

  /**
   * todo(backstage/community): This is a proposed virtual location which would
   * help implement a common addon pattern in which many instances of a given
   * element in markdown would be dynamically replaced at render-time based on
   * attributes provided on that element, for example:
   *
   * ```md
   * ## Component Metadata
   * [CatalogEntityCard](default:component/some-component-name)
   *
   * ## System Metadata
   * [CatalogEntityCard](default:system/some-system-name)
   * ```
   *
   * Could correspond to a TechDocs addon named `CatalogEntityCard` with
   * location `TechDocsAddonLocations.COMPONENT`, whose `component` would be
   * the react component that would be rendered in place of all instances of
   * the markdown illustrated above.
   *
   * The `@backstage/plugin-techdocs-react` package would need to be updated to, in
   * cases where such addons had been registered, find all instances of the
   * rendered markdown (e.g. `<a href="{entityRef}">CatalogEntityCard</a>`) and
   * replace them with react portals to the addon component.
   */
  // COMPONENT = 'component',
}

/**
 * Options for creating a TechDocs addon.
 * @alpha
 */
export type TechDocsAddonOptions<TAddonProps = {}> = {
  name: string;
  location: TechDocsAddonLocations;
  component: ComponentType<TAddonProps>;
};
