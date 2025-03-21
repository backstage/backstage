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
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import { Visit } from '../../api/VisitsApi';
import { VisitListItem } from './VisitListItem';
import { ItemDetailType } from './ItemDetail';
import { VisitListEmpty } from './VisitListEmpty';
import { VisitListFew } from './VisitListFew';
import { VisitListSkeleton } from './VisitListSkeleton';

export const VisitList = ({
  detailType,
  visits = [],
  numVisitsOpen = 3,
  numVisitsTotal = 8,
  collapsed = true,
  loading = false,
  title = '',
}: {
  detailType: ItemDetailType;
  visits?: Visit[];
  numVisitsOpen?: number;
  numVisitsTotal?: number;
  collapsed?: boolean;
  loading?: boolean;
  title?: string;
}) => {
  let listBody: React.ReactElement = <></>;
  if (loading) {
    listBody = (
      <VisitListSkeleton
        numVisitsOpen={numVisitsOpen}
        numVisitsTotal={numVisitsTotal}
        collapsed={collapsed}
      />
    );
  } else if (visits.length === 0) {
    listBody = <VisitListEmpty />;
  } else if (visits.length < numVisitsOpen) {
    listBody = (
      <>
        {visits.map((visit, index) => (
          <VisitListItem visit={visit} key={index} detailType={detailType} />
        ))}
        <VisitListFew />
      </>
    );
  } else {
    listBody = (
      <>
        {visits.slice(0, numVisitsOpen).map((visit, index) => (
          <VisitListItem visit={visit} key={index} detailType={detailType} />
        ))}
        {visits.length > numVisitsOpen && (
          <Collapse in={!collapsed}>
            {visits.slice(numVisitsOpen, numVisitsTotal).map((visit, index) => (
              <VisitListItem
                visit={visit}
                key={index}
                detailType={detailType}
              />
            ))}
          </Collapse>
        )}
      </>
    );
  }

  return (
    <>
      {title && <h5>{title}</h5>}
      <List dense disablePadding>
        {listBody}
      </List>
    </>
  );
};
