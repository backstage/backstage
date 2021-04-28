/*
 * Copyright 2021 Spotify AB
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
import { Card, Box, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { AWS } from './Aws';
import React from 'react';
import LayersIcon from '@material-ui/icons/Layers';

// function SvgComponent2(props: any) {
//   return (
//     <div style={{ width: 24, height: 24 }}>
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width={600}
//         height={400}
//         {...props}
//       >
//         <path fill="#00253c" d="M0 0h600v400H0z" />
//         <path
//           fill="#fff"
//           d="M235 300h130l-50-80 85 45V135l-85 50 50-85H235l50 85-85-50v130l85-45z"
//         />
//       </svg>
//     </div>
//   );
// }

function SvgComponent1(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      viewBox="0 0 19.68 15.24"
      {...props}
    >
      <path
        d="M9.105 14.43l4.642-.82.043-.01-2.387-2.84a403.945 403.945 0 01-2.387-2.853c0-.014 2.465-6.802 2.479-6.826.004-.008 1.682 2.888 4.066 7.02l4.09 7.09.031.054-7.587-.001-7.587-.001 4.597-.812zM0 13.566c0-.004 1.125-1.957 2.5-4.34L5 4.893l2.913-2.445A981.363 981.363 0 0110.836 0a.512.512 0 01-.047.118L7.625 6.903l-3.107 6.663-2.259.003c-1.242.002-2.259 0-2.259-.004z"
        fill="#0089d6"
      />
    </svg>
  );
}

function SvgComponent() {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2385.7 1919.9"
        width={22}
      >
        <path
          d="M1513.8 528.7h72.8L1794 321.3l10.2-88c-385.9-340.6-975-303.9-1315.6 82C393.9 422.5 325.2 550 287.8 688c23.1-9.5 48.7-11 72.8-4.4l414.7-68.4s21.1-34.9 32-32.7c184.5-202.6 495-226.2 708-53.8h-1.5z"
          fill="#ea4335"
        />
        <path
          d="M2089.4 688c-47.7-175.5-145.5-333.3-281.6-454l-291 291c122.9 100.4 192.9 251.7 189.9 410.4v51.7c143.1 0 259 116 259 259 0 143.1-116 259-259 259h-518.1l-51.7 52.4v310.7l51.7 51.7h518.1c297 2.3 560.5-190.2 648.7-473.8 88-283.7-20-591.7-266-758.1z"
          fill="#4285f4"
        />
        <path
          d="M669.8 1917h518.1v-414.7H669.8c-36.9 0-73.4-7.9-107-23.3l-72.8 22.5-208.8 207.4-18.2 72.8c117.1 88.4 260 135.9 406.8 135.3z"
          fill="#34a853"
        />
        <path
          d="M669.8 571.6c-287.8 1.7-542.7 186-634.5 458.7-91.8 272.7-.3 573.7 227.8 749.1l300.5-300.5c-130.4-58.9-188.3-212.3-129.4-342.7 58.9-130.4 212.3-188.3 342.7-129.4 57.4 26 103.4 72 129.4 129.4l300.5-300.5c-127.9-167.1-326.6-264.8-537-264.1z"
          fill="#fbbc05"
        />
      </svg>
    </div>
  );
}

export const ProvidersTab = () => {
  return (
    <Card>
      <Box p={1} display="flex" alignItems="center">
        <LayersIcon
          style={{ marginRight: 5, color: grey[800] }}
          fontSize="small"
        />
        <Typography color="textPrimary">Providers</Typography>
        <Box flex={1} />

        <SvgComponent1 />
        <Box ml={1} mt={0.6}>
          <SvgComponent />
        </Box>
        <Box ml={1}>
          <AWS />
        </Box>
      </Box>
    </Card>
  );
};
