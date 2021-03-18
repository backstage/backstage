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
import styled from '@emotion/styled';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 2rem;
  min-height: calc(100vh - 18rem);

  @media screen and (max-width: 1280px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

export const StatusColor = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
`;
