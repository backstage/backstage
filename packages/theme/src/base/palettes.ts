/*
 * Copyright 2020 The Backstage Authors
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
 * Built-in Backstage color palettes.
 *
 * @public
 */
export const palettes = {
  light: {
    type: 'light' as const,
    mode: 'light' as const,
    background: {
      default: '#F8F8F8',
      paper: '#FFFFFF',
    },
    status: {
      ok: '#1DB954',
      warning: '#FF9800',
      error: '#E22134',
      running: '#1F5493',
      pending: '#FFED51',
      aborted: '#757575',
    },
    bursts: {
      fontColor: '#FEFEFE',
      slackChannelText: '#ddd',
      backgroundColor: {
        default: '#7C3699',
      },
      gradient: {
        linear: 'linear-gradient(-137deg, #4BB8A5 0%, #187656 100%)',
      },
    },
    primary: {
      main: '#1F5493',
    },
    banner: {
      info: '#2E77D0',
      error: '#E22134',
      text: '#FFFFFF',
      link: '#000000',
      closeButtonColor: '#FFFFFF',
      warning: '#FF9800',
    },
    border: '#E6E6E6',
    textContrast: '#000000',
    textVerySubtle: '#DDD',
    textSubtle: '#6E6E6E',
    highlight: '#FFFBCC',
    errorBackground: '#FFEBEE',
    warningBackground: '#F59B23',
    infoBackground: '#ebf5ff',
    errorText: '#CA001B',
    infoText: '#004e8a',
    warningText: '#000000',
    linkHover: '#2196F3',
    link: '#0A6EBE',
    gold: '#FFD600',
    navigation: {
      background: '#171717',
      indicator: '#9BF0E1',
      color: '#b5b5b5',
      selectedColor: '#FFF',
      navItem: {
        hoverBackground: '#404040',
      },
      submenu: {
        background: '#404040',
      },
    },
    pinSidebarButton: {
      icon: '#181818',
      background: '#BDBDBD',
    },
    tabbar: {
      indicator: '#9BF0E1',
    },
  },
  dark: {
    type: 'dark' as const,
    mode: 'dark' as const,
    background: {
      default: '#333333',
      paper: '#424242',
    },
    status: {
      ok: '#71CF88',
      warning: '#FFB84D',
      error: '#F84C55',
      running: '#3488E3',
      pending: '#FEF071',
      aborted: '#9E9E9E',
    },
    bursts: {
      fontColor: '#FEFEFE',
      slackChannelText: '#ddd',
      backgroundColor: {
        default: '#7C3699',
      },
      gradient: {
        linear: 'linear-gradient(-137deg, #4BB8A5 0%, #187656 100%)',
      },
    },
    primary: {
      main: '#9CC9FF',
      dark: '#82BAFD',
    },
    secondary: {
      main: '#FF88B2',
    },
    banner: {
      info: '#2E77D0',
      error: '#E22134',
      text: '#FFFFFF',
      link: '#000000',
      closeButtonColor: '#FFFFFF',
      warning: '#FF9800',
    },
    border: '#E6E6E6',
    textContrast: '#FFFFFF',
    textVerySubtle: '#727272',
    textSubtle: '#CCCCCC',
    highlight: '#FFFBCC',
    errorBackground: '#FFEBEE',
    warningBackground: '#F59B23',
    infoBackground: '#ebf5ff',
    errorText: '#CA001B',
    infoText: '#004e8a',
    warningText: '#000000',
    linkHover: '#82BAFD',
    link: '#9CC9FF',
    gold: '#FFD600',
    navigation: {
      background: '#424242',
      indicator: '#9BF0E1',
      color: '#b5b5b5',
      selectedColor: '#FFF',
      navItem: {
        hoverBackground: '#404040',
      },
      submenu: {
        background: '#404040',
      },
    },
    pinSidebarButton: {
      icon: '#404040',
      background: '#BDBDBD',
    },
    tabbar: {
      indicator: '#9BF0E1',
    },
  },
  highContrastDark: {
    type: 'dark' as const,
    mode: 'dark' as const,
    background: {
      default: '#000000',
      paper: '#0A0A0A',
    },
    status: {
      ok: '#00FF00',
      warning: '#FFFF00',
      error: '#FF4444',
      running: '#00FFFF',
      pending: '#FFFF00',
      aborted: '#888888',
    },
    bursts: {
      fontColor: '#FFFFFF',
      slackChannelText: '#FFFFFF',
      backgroundColor: {
        default: '#000000',
      },
      gradient: {
        linear: 'linear-gradient(90deg, #000000, #1A1A1A)',
      },
    },
    primary: {
      main: '#00FFFF',
      dark: '#00CCCC',
    },
    secondary: {
      main: '#FFFF00',
    },
    banner: {
      info: '#00FFFF',
      error: '#FF4444',
      text: '#000000',
      link: '#FFFF00',
      closeButtonColor: '#000000',
      warning: '#FFFF00',
    },
    border: '#FFFFFF',
    textContrast: '#FFFFFF',
    textVerySubtle: '#888888',
    textSubtle: '#CCCCCC',
    highlight: '#FFFF00',
    errorBackground: '#330000',
    warningBackground: '#333300',
    infoBackground: '#003333',
    errorText: '#FF4444',
    infoText: '#00FFFF',
    warningText: '#FFFF00',
    linkHover: '#FFFF00',
    link: '#00FFFF',
    gold: '#FFFF00',
    navigation: {
      background: '#000000',
      indicator: '#FFFF00',
      color: '#FFFFFF',
      selectedColor: '#00FFFF',
      navItem: {
        hoverBackground: '#1A1A1A',
      },
      submenu: {
        background: '#0A0A0A',
      },
    },
    pinSidebarButton: {
      icon: '#000000',
      background: '#FFFFFF',
    },
    tabbar: {
      indicator: '#00FFFF',
    },
  },
};
