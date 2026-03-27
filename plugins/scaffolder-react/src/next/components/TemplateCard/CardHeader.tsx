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

import { ItemCardHeader } from '@backstage/core-components';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { FavoriteEntity } from '@backstage/plugin-catalog-react';
import { TemplateDetailButton } from './TemplateDetailButton.tsx';
import { pageTheme as defaultPageThemes } from '@backstage/theme';

/**
 * Props for the CardHeader component
 */
export interface CardHeaderProps {
  template: TemplateEntityV1beta3;
}

/**
 * The Card Header with the background for the TemplateCard.
 *
 * Renders a page-theme-specific gradient background and font color based on
 * the template entity's type (service, website, library, etc.). Dynamic styling
 * is applied via inline CSS properties and a CSS custom property for child
 * color inheritance, replacing the previous MUI CSS-in-JS approach.
 *
 * @remarks
 * Page theme data (gradient background and font color) is resolved from the
 * static `pageTheme` record exported by `@backstage/theme`. This is
 * functionally equivalent to the previous `useTheme().getPageTheme()` pattern
 * while eliminating the legacy MUI CSS-in-JS dependency. Deployments
 * with custom page themes defined via `createUnifiedTheme({ pageTheme })` should
 * extend this record or provide an equivalent lookup mechanism.
 */
export const CardHeader = (props: CardHeaderProps) => {
  const {
    template: {
      metadata: { title, name },
      spec: { type },
    },
  } = props;

  // Resolve page theme for the template entity type.
  // Falls back to the 'other' page theme for unrecognized types.
  const themeForType = defaultPageThemes[type] ?? defaultPageThemes.other;
  const cardFontColor = themeForType.fontColor;
  const cardBackgroundImage = themeForType.backgroundImage;

  const SubtitleComponent = (
    <div className="flex justify-between">
      <div>{type}</div>
      <div>
        <TemplateDetailButton
          className="[color:var(--card-header-color)]"
          template={props.template}
        />
        <FavoriteEntity
          entity={props.template}
          style={{ padding: 0, marginLeft: 6 }}
        />
      </div>
    </div>
  );

  return (
    <div
      style={
        {
          backgroundImage: cardBackgroundImage,
          color: cardFontColor,
          '--card-header-color': cardFontColor,
        } as React.CSSProperties
      }
      className="bg-cover bg-[position:0] rounded-t-xl overflow-hidden"
    >
      <ItemCardHeader
        title={title ?? name}
        subtitle={SubtitleComponent}
        className="bg-transparent text-inherit"
      />
    </div>
  );
};
