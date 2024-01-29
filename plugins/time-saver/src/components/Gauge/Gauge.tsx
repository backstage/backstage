/*
 * Copyright 2024 The Backstage Authors
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
import Avatar from '@mui/material/Avatar';
import { getRandomColor } from '../utils';

interface GaugeProps {
  number: number;
  heading?: string;
}

const Gauge: React.FC<GaugeProps> = ({ number, heading }) => {
  return (
    <div
      style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar
        sx={{
          width: 120,
          height: 120,
          fontSize: 36,
          backgroundColor: getRandomColor(),
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          color: '#fff',
          marginBottom: '8px',
          border: '3px solid #005052',
        }}
      >
        {number}
      </Avatar>
      <div
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        {heading}
      </div>
    </div>
  );
};

export default Gauge;
