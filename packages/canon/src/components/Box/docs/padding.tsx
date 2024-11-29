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
import { Inline } from '../../Inline';
import { Box } from '../Box';

const FakeBox = ({ children }: { children: string }) => (
  <Box
    paddingX="md"
    paddingY="sm"
    borderRadius="small"
    style={{ background: '#1f47ff', color: 'white' }}
  >
    {children}
  </Box>
);

export const Padding = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      borderRadius="small"
      marginBottom="md"
      gap="xl"
      paddingY="xl"
      style={{ border: '1px solid #e7e7e7' }}
    >
      <Inline align="center" alignY="center" gap="xl">
        <Box
          alignItems="center"
          borderRadius="small"
          padding="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>padding</FakeBox>
        </Box>
        <Box
          alignItems="center"
          borderRadius="small"
          paddingX="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>paddingX</FakeBox>
        </Box>
        <Box
          alignItems="center"
          borderRadius="small"
          paddingY="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>paddingY</FakeBox>
        </Box>
      </Inline>
      <Inline align="center" alignY="center" gap="xl">
        <Box
          alignItems="center"
          borderRadius="small"
          paddingTop="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>paddingTop</FakeBox>
        </Box>
        <Box
          alignItems="center"
          borderRadius="small"
          paddingBottom="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>paddingBottom</FakeBox>
        </Box>
        <Box
          alignItems="center"
          borderRadius="small"
          paddingLeft="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>paddingLeft</FakeBox>
        </Box>
        <Box
          alignItems="center"
          borderRadius="small"
          paddingRight="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>paddingRight</FakeBox>
        </Box>
      </Inline>
    </Box>
  );
};
