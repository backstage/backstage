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

import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  wave: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    'z-index': -1,
  },
});

const Waves = ({ theme }) => {
  const classes = useStyles();
  const [color1, color2] = theme.gradient.colors;

  return (
    <svg
      viewBox="0 0 1440 94"
      preserveAspectRatio="xMinYMin slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classes.wave}
    >
      <rect width="1440" height="94" fill="url(#paint0_linear)" />
      <g opacity="0.8">
        <mask
          id="mask0"
          mask-type="alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1440"
          height="94"
        >
          <rect width="1440" height="94" fill={color1} />
        </mask>
        <g mask="url(#mask0)">
          <path
            d="M710.947 14.3685C605.39 154.457 195.464 165.759 92 154.301V210.649L2330 287V222.126C1516.52 222.126 1394.17 80.1091 1161.6 -40.9544C926.122 -163.528 768.278 -61.7182 710.947 14.3685Z"
            fill="url(#paint1_linear)"
          />
          <path
            d="M1163.25 124.34C1058.49 -16.113 651.678 -27.4441 549 -15.9565V-72.4504L2770 -149V-83.9579C1962.69 -83.9579 1841.28 58.4283 1610.47 179.806C1376.79 302.698 1220.14 200.624 1163.25 124.34Z"
            fill="url(#paint2_linear)"
          />
          <path
            d="M-104.701 -5.00477C-224.644 62.3106 -690.435 67.7413 -808 62.2356V89.3117L1735 126V94.827C810.651 94.827 671.63 26.5849 407.363 -31.5885C139.798 -90.4876 -39.557 -41.5659 -104.701 -5.00477Z"
            fill="url(#paint3_linear)"
          />
          <path
            d="M-247.511 -32.6315C-338.493 107.457 -691.821 118.759 -781 107.301V163.649L1148 240V175.126C446.833 175.126 341.378 33.1091 140.917 -87.9544C-62.0447 -210.528 -198.095 -108.718 -247.511 -32.6315Z"
            fill="url(#paint4_linear)"
          />
        </g>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="7.21415e-07"
          y1="61"
          x2="1649"
          y2="59.5001"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color1} />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="1318.25"
          y1="-285.884"
          x2="1311.42"
          y2="241.925"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color2} stopOpacity="0.72" />
          <stop offset="1" stopColor={color2} stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear"
          x1="1765.93"
          y1="425.372"
          x2="1759.02"
          y2="-103.806"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color2} stopOpacity="0.72" />
          <stop offset="1" stopColor={color2} stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear"
          x1="585.365"
          y1="-149.282"
          x2="583.977"
          y2="104.375"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color2} stopOpacity="0.72" />
          <stop offset="1" stopColor={color2} stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear"
          x1="275.941"
          y1="-332.884"
          x2="268.016"
          y2="194.894"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color2} stopOpacity="0.72" />
          <stop offset="1" stopColor={color2} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Waves;
