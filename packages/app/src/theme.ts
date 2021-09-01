/*
 * Copyright 2021 The Backstage Authors
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
import { createTheme, lightTheme, genPageTheme, shapes } from '@backstage/theme';

/*const myTheme = createTheme({
  palette: {
    ...lightTheme.palette,
    navigation: {
      background: '#293e40',
      indicator: '#0071bb',
      color: '#FFFFFF',
      selectedColor: '#FFFFFF',
    },
  },
  fontFamily:
    'Source Sans Pro,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif',
  defaultPageTheme: 'home',
});*/

const myTheme = createTheme({
    palette: {
      ...lightTheme.palette,
      navigation: {
        background: '#293e40',
        indicator: '#0071bb',
        color: '#FFFFFF',
        selectedColor: '#FFFFFF',
      },
    },
    fontFamily: 'Source Sans Pro,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif',
    defaultPageTheme: 'home',
    /* below drives the header colors */
    pageTheme: {
      home: genPageTheme(['#112e51','#112e51'], shapes.wave),
      documentation: genPageTheme(['#123456','#123456'], shapes.wave2),
      tool: genPageTheme(['#123456','#123456'], shapes.round),
      service: genPageTheme(['#123456','#123456'], shapes.wave),
      website: genPageTheme(['#123456','#123456'], shapes.wave),
      library: genPageTheme(['#123456','#123456'], shapes.wave),
      other: genPageTheme(['#123456','#123456'], shapes.wave),
      app: genPageTheme(['#123456','#123456'], shapes.wave),
      apis: genPageTheme(['#123456','#123456'], shapes.wave),
    },
  });

export default myTheme;
