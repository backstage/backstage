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
import { RoadmapItem } from './list';

export const Roadmap = ({ list }: { list: RoadmapItem[] }) => {
  const orderList = ['inProgress', 'notStarted', 'completed'];
  return (
    <div className="roadmap">
      {list
        .sort(
          (a, b) => orderList.indexOf(a.status) - orderList.indexOf(b.status),
        )
        .map(Item)}
    </div>
  );
};

const Item = ({
  title,
  status = 'notStarted',
}: {
  title: string;
  status: 'notStarted' | 'inProgress' | 'inReview' | 'completed';
}) => {
  return (
    <div className={['roadmap-item', status].join(' ')}>
      <div className="left">
        <div className="dot" />
        <div className="title">{title}</div>
      </div>
      <span className="pill">
        {status === 'notStarted' && 'Not Started'}
        {status === 'inProgress' && 'In Progress'}
        {status === 'inReview' && 'Ready for Review'}
        {status === 'completed' && 'Completed'}
      </span>
    </div>
  );
};
