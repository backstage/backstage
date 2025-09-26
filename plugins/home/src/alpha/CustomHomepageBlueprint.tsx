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

import { compatWrapper } from '@backstage/core-compat-api';
import { Content } from '@backstage/core-components';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import type { ReactElement, ReactNode } from 'react';
import { CustomHomepageGrid } from '../components';
import type { CustomHomepageGridProps } from '../components';
import { titleExtensionDataRef } from '@backstage/plugin-home-react/alpha';

/**
 * Arguments provided to the custom homepage renderer.
 *
 * @alpha
 */
export interface CustomHomepageTemplateProps {
  /**
   * React elements built from the installed homepage widgets.
   */
  widgets: ReactNode[];
  /**
   * A <CustomHomepageGrid/> element that renders the widgets using the provided props.
   */
  grid: ReactElement;
}

/**
 * Parameters for creating a custom homepage extension.
 *
 * @alpha
 */
export interface CustomHomepageBlueprintParams {
  /**
   * Optional title used by the home page when rendered through the new frontend system.
   */
  title?: string;
  /**
   * Props forwarded to <CustomHomepageGrid/>. The `children` prop is managed by the blueprint.
   */
  grid?: Omit<CustomHomepageGridProps, 'children'>;
  /**
   * Allows supplying a custom renderer for the homepage. Receives the generated widgets as well
   * as a <CustomHomepageGrid/> element configured with the provided props.
   */
  render?: (props: CustomHomepageTemplateProps) => ReactElement;
}

const DEFAULT_ATTACH_POINT = Object.freeze({
  id: 'page:home',
  input: 'props',
});

/**
 * Blueprint that composes a customizable home page based on installed widgets.
 *
 * @alpha
 */
export const CustomHomepageBlueprint = createExtensionBlueprint({
  kind: 'home:custom-homepage',
  attachTo: DEFAULT_ATTACH_POINT,
  output: [coreExtensionData.reactElement, titleExtensionDataRef.optional()],
  inputs: {
    widgets: createExtensionInput([coreExtensionData.reactElement]),
  },
  *factory(params: CustomHomepageBlueprintParams = {}, { inputs, node }) {
    const widgetOutputs = inputs.widgets ?? [];
    const widgetElements = widgetOutputs.map(widget =>
      widget.get(coreExtensionData.reactElement),
    );

    const gridElement = (
      <CustomHomepageGrid {...(params.grid ?? {})}>
        {widgetElements}
      </CustomHomepageGrid>
    );

    const renderedElement = params.render?.({
      widgets: widgetElements,
      grid: gridElement,
    }) ?? <Content>{gridElement}</Content>;

    yield coreExtensionData.reactElement(
      <ExtensionBoundary node={node}>
        {compatWrapper(renderedElement)}
      </ExtensionBoundary>,
    );

    if (params.title) {
      yield titleExtensionDataRef(params.title);
    }
  },
});

export type { CustomHomepageGridProps };
