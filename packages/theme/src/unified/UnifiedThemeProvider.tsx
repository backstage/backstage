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

import { ReactNode, useEffect, useMemo } from 'react';
import {
  ThemeProvider,
  StylesProvider,
  createGenerateClassName,
  Theme as Mui4Theme,
} from '@material-ui/core/styles';
import {
  StyledEngineProvider,
  ThemeProvider as Mui5Provider,
  Theme as Mui5Theme,
} from '@mui/material/styles';
import { UnifiedTheme } from './types';
import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/className';

/**
 * Props for {@link UnifiedThemeProvider}.
 *
 * @public
 */
export interface UnifiedThemeProviderProps {
  children: ReactNode;
  theme: UnifiedTheme;
  /** Optional override for the value written to the `data-theme-name` attribute. */
  themeName?: string;
}

/**
 * This API is introduced in @mui/material (v5.0.5) as a replacement of deprecated createGenerateClassName & only affects v5 Material UI components from `@mui/*`.
 *
 * This call needs to be in the same module as the `UnifiedThemeProvider` to ensure that it doesn't get removed by tree shaking
 */
ClassNameGenerator.configure(componentName => {
  return `v5-${componentName}`;
});

// Background at https://mui.com/x/migration/migration-data-grid-v4/#using-mui-core-v4-with-v5
// Rather than disabling globals and custom seed, we instead only set a production prefix that
// won't collide with Material UI 5 styles. We've already got the separate class name generator
// for v5 set up in just above, so only the production JSS needs deduplication.
const generateV4ClassName = createGenerateClassName({
  productionPrefix: 'jss4-',
});

import { useApplyThemeAttributes } from './useApplyThemeAttributes';
import { generateShadcnTokens } from './themes';
import { palettes } from '../base';
import type { BackstagePaletteAdditions } from '../base/types';

/**
 * Shape of the palette object expected by the shadcn/ui token generator.
 *
 * This interface captures the subset of MUI palette properties plus the
 * Backstage-specific additions that `generatePaletteTokens` and
 * `generateShadcnTokens` require. Using this type instead of `any` ensures
 * that community-provided themes with non-standard palette shapes are handled
 * safely through the `isValidBackstagePalette` type guard.
 */
interface BackstagePaletteShape extends BackstagePaletteAdditions {
  type?: string;
  mode?: string;
  background: {
    default: string;
    paper: string;
  };
  primary: {
    main: string;
    dark?: string;
  };
  secondary?: {
    main?: string;
  };
}

/**
 * Type guard that validates a palette object has all properties required
 * by the shadcn/ui token generation system. Returns `false` for community
 * themes or non-standard palettes that are missing required fields,
 * preventing runtime errors from `normalizeHex(undefined)`.
 */
function isValidBackstagePalette(
  palette: unknown,
): palette is BackstagePaletteShape {
  if (!palette || typeof palette !== 'object') {
    return false;
  }
  const p = palette as Record<string, unknown>;
  // Verify required top-level string properties
  if (typeof p.border !== 'string') return false;
  if (typeof p.textContrast !== 'string') return false;
  if (typeof p.textSubtle !== 'string') return false;
  if (typeof p.gold !== 'string') return false;

  // Verify required nested objects
  const bg = p.background as Record<string, unknown> | undefined;
  if (!bg || typeof bg.default !== 'string' || typeof bg.paper !== 'string') {
    return false;
  }
  const primary = p.primary as Record<string, unknown> | undefined;
  if (!primary || typeof primary.main !== 'string') return false;

  const status = p.status as Record<string, unknown> | undefined;
  if (
    !status ||
    typeof status.ok !== 'string' ||
    typeof status.warning !== 'string' ||
    typeof status.error !== 'string' ||
    typeof status.running !== 'string' ||
    typeof status.pending !== 'string' ||
    typeof status.aborted !== 'string'
  ) {
    return false;
  }

  const nav = p.navigation as Record<string, unknown> | undefined;
  if (
    !nav ||
    typeof nav.background !== 'string' ||
    typeof nav.color !== 'string'
  ) {
    return false;
  }

  const bursts = p.bursts as Record<string, unknown> | undefined;
  if (!bursts || typeof bursts.fontColor !== 'string') return false;

  return true;
}

/**
 * Provides themes for all Material UI versions supported by the provided unified theme.
 *
 * @public
 */
export function UnifiedThemeProvider(
  props: UnifiedThemeProviderProps,
): JSX.Element {
  const { children, theme, themeName } = props;

  const v4Theme = theme.getTheme('v4') as Mui4Theme;
  const v5Theme = theme.getTheme('v5') as Mui5Theme;

  const themeMode = v4Theme ? v4Theme.palette.type : v5Theme?.palette.mode;

  useApplyThemeAttributes(themeMode, themeName ?? 'backstage');

  // Memoize token generation to avoid unnecessary DOM mutations when the
  // parent re-renders with referentially different but semantically identical
  // theme objects. The token set only needs to change when the theme mode
  // (light/dark) or theme name changes.
  const shadcnTokens = useMemo(() => {
    const palette = v4Theme?.palette ?? v5Theme?.palette;
    if (!palette || !isValidBackstagePalette(palette)) {
      return null;
    }
    // After validation by isValidBackstagePalette, the palette is confirmed
    // to have all properties required by generatePaletteTokens. Cast through
    // unknown since the MUI Palette type doesn't structurally overlap with
    // the Backstage palette literal type, but our type guard has verified
    // all required fields exist.
    return generateShadcnTokens(
      palette as unknown as typeof palettes.light | typeof palettes.dark,
    );
  }, [themeMode, themeName]); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject shadcn/ui CSS custom properties onto :root based on the active theme palette
  useEffect(() => {
    if (!shadcnTokens) {
      return undefined;
    }

    const root = document.documentElement;
    const tokenKeys = Object.keys(shadcnTokens);
    for (const key of tokenKeys) {
      root.style.setProperty(key, shadcnTokens[key]);
    }

    // Cleanup: remove injected CSS custom properties on unmount
    return () => {
      for (const key of tokenKeys) {
        root.style.removeProperty(key);
      }
    };
  }, [shadcnTokens]);

  let result = children as JSX.Element;

  if (v4Theme) {
    result = (
      <StylesProvider generateClassName={generateV4ClassName}>
        <ThemeProvider theme={v4Theme}>{result}</ThemeProvider>
      </StylesProvider>
    );
  }

  if (v5Theme) {
    result = (
      <StyledEngineProvider injectFirst>
        <Mui5Provider theme={v5Theme}>{result}</Mui5Provider>
      </StyledEngineProvider>
    );
  }

  return result;
}
