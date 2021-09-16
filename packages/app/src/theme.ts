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
import { createThemeOverrides } from '@backstage/theme';

const overrideStyle = {
  MuiCardHeader: {
      root: {
        // Reduce padding between header and content
        paddingBottom: 0,
        background: 'red',
        fontSize: '30px',
      },
  }
}

const VAtheme = createTheme({

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
  });
  const overrides = createThemeOverrides(VAtheme);
  const newTheme = { ...VAtheme, overrides }; 
  

export default newTheme;
