/*
 * Copyright 2024 The Backstage Authors
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
  useState,
  ComponentType,
  PropsWithChildren,
  type CSSProperties,
} from 'react';
import { FavoriteToggle } from './FavoriteToggle';
import {
  UnifiedThemeProvider,
  createBaseThemeOptions,
  createUnifiedTheme,
  palettes,
} from '@backstage/theme';
import { wrapInTestApp } from '@backstage/test-utils';

export default {
  title: 'Core/FavoriteToggle',
  component: FavoriteToggle,
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) => wrapInTestApp(<Story />),
  ],
  tags: ['!manifest'],
};

export const Default = () => {
  const [isFavorite, setFavorite] = useState(false);
  return (
    <FavoriteToggle
      id="favorite-toggle"
      title="Add entity to favorites"
      isFavorite={isFavorite}
      onToggle={setFavorite}
    />
  );
};

/**
 * Dark theme created without the legacy MUI `BackstageFavoriteToggleIcon`
 * component override. The migrated FavoriteToggle uses CSS custom properties
 * for star colors, so theming is demonstrated via `--favorite-star-color` and
 * `--favorite-star-border-color` on a wrapper element.
 */
const darkTheme = createUnifiedTheme(
  createBaseThemeOptions({ palette: palettes.dark }),
);

/**
 * Demonstrates the FavoriteToggle rendered inside a dark theme context with
 * CSS custom property overrides for the star icon colors (aqua fill, white
 * border). This replaces the former MUI `styleOverrides` approach.
 */
export const WithThemeOverride = () => {
  const [isFavorite, setFavorite] = useState(false);
  return (
    <UnifiedThemeProvider theme={darkTheme}>
      <div
        style={
          {
            '--favorite-star-color': 'aqua',
            '--favorite-star-border-color': 'white',
          } as CSSProperties
        }
      >
        <FavoriteToggle
          id="favorite-toggle"
          title="Add entity to favorites"
          isFavorite={isFavorite}
          onToggle={setFavorite}
        />
      </div>
    </UnifiedThemeProvider>
  );
};
