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



shapes.plain = `url("data:image/svg+xml,%3csvg version='1.0' xmlns='http://www.w3.org/2000/svg' width='1.000000pt' height='1.000000pt' viewBox='0 0 1.000000 1.00000' preserveAspectRatio='xMidYMid meet'%3e%3cg transform='translate(0.000000%2c1.000000) scale(0.100000%2c-0.100000)' fill='black' stroke='none'%3e%3c/g%3e%3c/svg%3e")`;
shapes.filledHeader = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='1400px' height='408px' style='shape-rendering:geometricPrecision%3b text-rendering:geometricPrecision%3b image-rendering:optimizeQuality%3b fill-rule:evenodd%3b clip-rule:evenodd' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cg%3e%3cpath style='opacity:1' fill='%23112e51' d='M -0.5%2c-0.5 C 466.167%2c-0.5 932.833%2c-0.5 1399.5%2c-0.5C 1399.5%2c132.833 1399.5%2c266.167 1399.5%2c399.5C 932.833%2c399.5 466.167%2c399.5 -0.5%2c399.5C -0.5%2c266.167 -0.5%2c132.833 -0.5%2c-0.5 Z'/%3e%3c/g%3e%3cg%3e%3cpath style='opacity:1' fill='%23f9c921' d='M -0.5%2c399.5 C 466.167%2c399.5 932.833%2c399.5 1399.5%2c399.5C 1399.5%2c402.167 1399.5%2c404.833 1399.5%2c407.5C 932.833%2c407.5 466.167%2c407.5 -0.5%2c407.5C -0.5%2c404.833 -0.5%2c402.167 -0.5%2c399.5 Z'/%3e%3c/g%3e%3c/svg%3e")`;
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
      home: { colors:['#112e51','#112e51'], shape: shapes.filledHeader, backgroundImage:`${shapes.filledHeader}; border-bottom:8px solid #fac922;` },
      documentation: genPageTheme(['#112e51','#112e51'], shapes.plain),
      tool: genPageTheme(['#112e51','#112e51'], shapes.plain),
      service: genPageTheme(['#112e51','#112e51'], shapes.plain),
      website: genPageTheme(['#112e51','#112e51'], shapes.plain),
      library: genPageTheme(['#112e51','#112e51'], shapes.plain),
      other: genPageTheme(['#112e51','#112e51'], shapes.plain),
      app: genPageTheme(['#112e51','#112e51'], shapes.plain),
      apis: genPageTheme(['#112e51','#112e51'], shapes.plain),
      dashboard: genPageTheme(['#112e51','#112e51'], shapes.plain),
    },
  });

export default myTheme;
