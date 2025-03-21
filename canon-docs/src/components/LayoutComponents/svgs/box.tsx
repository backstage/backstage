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

export const BoxSvg = () => {
  return (
    <svg
      width="100"
      height="60"
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="60" rx="4" fill="black" fillOpacity="0.06" />
      <path
        d="M94.5 0.5H96C97.933 0.5 99.5 2.067 99.5 4V5.5"
        stroke="#4765FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M99.5 54.5L99.5 56C99.5 57.933 97.933 59.5 96 59.5L94.5 59.5"
        stroke="#4765FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 59.5L4 59.5C2.067 59.5 0.5 57.933 0.5 56L0.5 54.5"
        stroke="#4765FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.5 5.5L0.5 4C0.5 2.067 2.067 0.5 4 0.5L5.5 0.500001"
        stroke="#4765FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
