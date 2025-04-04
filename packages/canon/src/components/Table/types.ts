/*
 * Copyright 2025 The Backstage Authors
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
export interface TablePaginationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The current page index.
   */
  pageIndex: number;
  /**
   * The current page size.
   */
  pageSize: number;
  /**
   * The total number of rows.
   */
  totalRows: number;
  /**
   * The function to call when the previous button is clicked.
   */
  onClickPrevious: () => void;
  /**
   * The function to call when the next button is clicked.
   */
  onClickNext: () => void;
  /**
   * Whether the previous button is disabled.
   */
  canPrevious: boolean;
  /**
   * Whether the next button is disabled.
   */
  canNext: boolean;
  /**
   * The function to call when the page size is changed.
   */
  setPageSize: (pageSize: number) => void;
}
