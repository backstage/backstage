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

/**
 * A theme type that captures all properties accessed by TechDocs style rules.
 * Replaces the MUI Theme dependency with a focused, self-contained type.
 */
export type TechDocsTheme = {
  palette: {
    type: 'light' | 'dark';
    divider: string;
    text: {
      primary: string;
      secondary: string;
    };
    background: {
      default: string;
      paper: string;
    };
    primary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    secondary: {
      light: string;
      dark: string;
    };
    success: {
      main: string;
      light: string;
      dark: string;
    };
    error: {
      light: string;
      dark: string;
    };
    warning: {
      main: string;
      light: string;
      dark: string;
    };
    action: {
      hover: string;
      disabledBackground: string;
    };
    link?: string;
    code?: {
      background?: string;
    };
  };
  shadows: string[];
  typography: {
    fontFamily: string;
    h1: {
      fontSize: string | number;
      fontWeight?: number;
      lineHeight?: number;
      fontFamily?: string;
    };
    h2: {
      fontSize: string | number;
      fontWeight?: number;
      lineHeight?: number;
      fontFamily?: string;
    };
    h3: {
      fontSize: string | number;
      fontWeight?: number;
      lineHeight?: number;
      fontFamily?: string;
    };
    h4: {
      fontSize: string | number;
      fontWeight?: number;
      lineHeight?: number;
      fontFamily?: string;
    };
    h5: {
      fontSize: string | number;
      fontWeight?: number;
      lineHeight?: number;
      fontFamily?: string;
    };
    h6: {
      fontSize: string | number;
      fontWeight?: number;
      lineHeight?: number;
      fontFamily?: string;
    };
    htmlFontSize?: number;
  };
  shape: {
    borderRadius: number;
  };
  spacing: (factor: number) => string;
};

/**
 * A Backstage sidebar object that contains properties such as its pin state.
 */
type BackstageSidebar = {
  /** Tracks whether the user pinned the sidebar or not. */
  isPinned: boolean;
};

/**
 * A dependencies object injected into rules by the style processor.
 */
export type RuleOptions = {
  /**
   * A TechDocs theme object that contains the application's design tokens.
   */
  theme: TechDocsTheme;
  /**
   * A Backstage sidebar, see {@link BackstageSidebar} for more details.
   */
  sidebar: BackstageSidebar;
};
