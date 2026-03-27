/*
 * Copyright 2020 The Backstage Authors
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

import { ReactNode } from 'react';

/** @public */
export type SubvalueCellClassKey = 'value' | 'subvalue';

type SubvalueCellProps = {
  value: ReactNode;
  subvalue: ReactNode;
};

/**
 * Renders a primary value with a secondary subvalue beneath it,
 * used within table cells for displaying additional context.
 */
export function SubvalueCell(props: SubvalueCellProps) {
  const { value, subvalue } = props;

  return (
    <>
      <div className="mb-1.5">{value}</div>
      <div className="text-muted-foreground font-normal">{subvalue}</div>
    </>
  );
}
