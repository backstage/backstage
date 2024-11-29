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
  cellStyles,
  headerCellStyles,
  tableStyles,
  wrapperStyles,
  rowStyles,
} from './table.css';

export const Root = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={wrapperStyles}>
      <table className={tableStyles}>{children}</table>
    </div>
  );
};

export const Header = ({ children }: { children: React.ReactNode }) => {
  return <thead>{children}</thead>;
};

export const Body = ({ children }: { children: React.ReactNode }) => {
  return <tbody>{children}</tbody>;
};

export const HeaderRow = ({ children }: { children: React.ReactNode }) => {
  return <tr>{children}</tr>;
};

export const HeaderCell = ({ children }: { children: React.ReactNode }) => {
  return <th className={`${cellStyles} ${headerCellStyles}`}>{children}</th>;
};

export const Row = ({ children }: { children: React.ReactNode }) => {
  return <tr className={rowStyles}>{children}</tr>;
};

export const Cell = ({ children }: { children: React.ReactNode }) => {
  return <td className={cellStyles}>{children}</td>;
};
