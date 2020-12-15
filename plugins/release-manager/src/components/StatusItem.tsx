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
import React, { FC } from 'react';
import { styled } from '@material-ui/core';

const Container = styled('div')({
  display: 'flex',
  marginRight: 10,
  '&:last-child': {
    marginRight: 0,
  },
});

const Chip = styled('div')({
  background: '#CCCCCC',
  borderRadius: 10,
  padding: 1,
  paddingLeft: 10,
  paddingRight: 10,
});

type Props = { children: React.ReactNode; chip?: boolean };

export const StatusItem: FC<Props> = ({ children, chip }: Props) => {
  return chip ? (
    <Container>
      <Chip>{children}</Chip>
    </Container>
  ) : (
    <Container>{children}</Container>
  );
};
