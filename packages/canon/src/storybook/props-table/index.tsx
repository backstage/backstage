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
import {
  tableStyles,
  cellStyles,
  headerCellStyles,
  rowStyles,
  wrapperStyles,
  chipStyles,
  headerRowStyles,
  typeStyles,
} from './props-table.css';

type PropsTableData = {
  prop: string;
  type: string | string[];
  default: string;
  description: string;
};

export const PropsTable = ({ data }: { data: PropsTableData[] }) => {
  return (
    <div className={wrapperStyles}>
      <table className={tableStyles}>
        <thead className={headerRowStyles}>
          <tr className={rowStyles}>
            <th className={`${cellStyles} ${headerCellStyles}`}>Prop</th>
            <th className={`${cellStyles} ${headerCellStyles}`}>Type</th>
            <th className={`${cellStyles} ${headerCellStyles}`}>Default</th>
            <th className={`${cellStyles} ${headerCellStyles}`}>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr className={rowStyles}>
              <td className={cellStyles}>
                <span className={chipStyles}>{item.prop}</span>
              </td>
              <td className={cellStyles}>
                <div className={typeStyles}>
                  {Array.isArray(item.type) ? (
                    item.type.map(type => (
                      <span className={chipStyles}>{type}</span>
                    ))
                  ) : (
                    <span className={chipStyles}>{item.type}</span>
                  )}
                </div>
              </td>
              <td className={cellStyles}>
                <span className={chipStyles}>{item.default}</span>
              </td>
              <td className={cellStyles}>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
