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

export const ComponentStatus = ({
  name,
  status = 'notStarted',
  style,
  link,
}: {
  name: string;
  status: 'notStarted' | 'inProgress' | 'alpha' | 'beta' | 'stable';
  style?: React.CSSProperties;
  link?: string;
}) => {
  return (
    <div className="component-status" style={style}>
      {link ? (
        <a href={link} className="title">
          {name}
        </a>
      ) : (
        <span className="title">{name}</span>
      )}
      <span className={`pill ${status}`}>
        {status === 'notStarted' && 'Not Started'}
        {status === 'inProgress' && 'In Progress'}
        {status === 'alpha' && 'Alpha'}
        {status === 'beta' && 'Beta'}
        {status === 'stable' && 'Stable'}
      </span>
    </div>
  );
};
