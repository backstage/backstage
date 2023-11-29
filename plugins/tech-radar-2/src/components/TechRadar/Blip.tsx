/*
 * Copyright 2023 The Backstage Authors
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

import { useTheme } from '@material-ui/core';

import { ENTRY_RADIUS } from '../../types';

interface BlipProps {
  inactive: boolean;
  color: string;
}

export const Blip = ({ inactive, color }: BlipProps) => {
  const theme = useTheme();
  const fill = inactive ? theme.palette.action.disabledBackground : color;

  return <circle r={ENTRY_RADIUS} style={{ fill: fill }} />;
};

interface GoldenTechBlipProps {
  inactive: boolean;
}

export const GoldenTechBlip = ({ inactive }: GoldenTechBlipProps) => {
  const theme = useTheme();
  const fill = inactive ? theme.palette.action.disabledBackground : '#f59b23';

  return (
    <path
      d="m -0.77 -8.095 C -0.372 -8.546 0.331 -8.546 0.729 -8.095 L 1.546 -7.17 C 1.8 -6.881 2.198 -6.764 2.569 -6.869 L 3.755 -7.206 C 4.334 -7.37 4.926 -6.99 5.017 -6.395 L 5.203 -5.176 C 5.262 -4.795 5.533 -4.482 5.901 -4.37 L 7.082 -4.012 C 7.658 -3.837 7.95 -3.197 7.705 -2.648 L 7.203 -1.521 C 7.046 -1.17 7.105 -0.759 7.354 -0.466 L 8.154 0.473 C 8.544 0.932 8.443 1.628 7.94 1.958 L 6.909 2.634 C 6.587 2.845 6.414 3.222 6.466 3.604 L 6.63 4.826 C 6.71 5.423 6.25 5.954 5.648 5.96 L 4.415 5.971 C 4.03 5.974 3.681 6.198 3.518 6.547 L 2.995 7.665 C 2.74 8.21 2.065 8.408 1.556 8.087 L 0.513 7.43 C 0.187 7.224 -0.228 7.224 -0.553 7.43 L -1.597 8.087 C -2.106 8.408 -2.781 8.21 -3.036 7.665 L -3.559 6.547 C -3.722 6.198 -4.07 5.974 -4.455 5.971 L -5.689 5.96 C -6.291 5.954 -6.751 5.423 -6.671 4.826 L -6.506 3.604 C -6.455 3.222 -6.627 2.845 -6.949 2.634 L -7.981 1.958 C -8.484 1.628 -8.584 0.932 -8.194 0.473 L -7.395 -0.466 C -7.145 -0.759 -7.086 -1.17 -7.243 -1.521 L -7.746 -2.648 C -7.991 -3.197 -7.698 -3.837 -7.123 -4.012 L -5.942 -4.37 C -5.574 -4.482 -5.302 -4.795 -5.244 -5.176 L -5.057 -6.395 C -4.967 -6.99 -4.375 -7.37 -3.796 -7.206 L -2.609 -6.869 C -2.239 -6.764 -1.841 -6.881 -1.586 -7.17 L -0.77 -8.095 Z"
      style={{ fill: fill }}
    />
  );
};

const IconWrapper: React.FC = ({ children }) => (
  <svg width="24" height="24" viewBox="-12 -12 24 24">
    {children}
  </svg>
);

export const BlipIcon = ({ color }: { color: string }) => (
  <IconWrapper>
    <Blip color={color} inactive={false} />
  </IconWrapper>
);

export const GoldenTechBlipIcon = () => (
  <IconWrapper>
    <GoldenTechBlip inactive={false} />
  </IconWrapper>
);
