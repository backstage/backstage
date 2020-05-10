/*
 * Copyright 2020 Spotify AB
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

import { createTheme } from './baseTheme';
import { blue, yellow } from '@material-ui/core/colors';

export const lightTheme = createTheme({
  type: 'light',
  background: {
    default: '#F8F8F8',
  },
  status: {
    ok: '#1db855',
    warning: '#f49b20',
    error: '#CA001B',
    running: '#BEBEBE',
    pending: '#5BC0DE',
    background: '#F8F8F8',
  },
  bursts: {
    fontColor: '#FEFEFE',
    slackChannelText: '#ddd',
    backgroundColor: {
      default: '#7C3699',
    },
  },
  primary: {
    main: blue[500],
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
  warningText: '#FEFEFE',
  linkHover: '#2196F3',
  link: '#0A6EBE',
  gold: yellow.A700,
  sidebar: '#171717',
});

export const darkTheme = createTheme({
  type: 'dark',
  background: {
    default: '#333333',
  },
  status: {
    ok: '#1db855',
    warning: '#f49b20',
    error: '#CA001B',
    running: '#BEBEBE',
    pending: '#5BC0DE',
    background: '#282828',
  },
  bursts: {
    fontColor: '#FEFEFE',
    slackChannelText: '#ddd',
    backgroundColor: {
      default: '#7C3699',
    },
  },
  primary: {
    main: blue[500],
  },
  border: '#E6E6E6',
  textContrast: '#FFFFFF',
  textVerySubtle: '#DDD',
  textSubtle: '#EEEEEE',
  highlight: '#FFFBCC',
  errorBackground: '#FFEBEE',
  warningBackground: '#F59B23',
  infoBackground: '#ebf5ff',
  errorText: '#CA001B',
  infoText: '#004e8a',
  warningText: '#FEFEFE',
  linkHover: '#2196F3',
  link: '#0A6EBE',
  gold: yellow.A700,
  sidebar: '#424242',
});
