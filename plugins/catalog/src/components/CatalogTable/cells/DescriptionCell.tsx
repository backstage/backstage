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

import { Cell, Tooltip, TooltipTrigger } from '@backstage/ui';

/**
 * Props for DescriptionCell
 * @internal
 */
export interface DescriptionCellProps {
  id?: string;
  hidden?: boolean;
  text?: string;
}

/**
 * Cell component that displays description text with overflow tooltip
 * @internal
 */
export function DescriptionCell(props: DescriptionCellProps) {
  const { id, hidden, text } = props;

  if (!text) {
    return <Cell id={id} title="" hidden={hidden} />;
  }

  const cell = (
    <Cell
      id={id}
      title={text}
      color="primary"
      hidden={hidden}
      className="bui-TableCell"
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    />
  );

  return (
    <TooltipTrigger delay={600}>
      {cell}
      <Tooltip>{text}</Tooltip>
    </TooltipTrigger>
  );
}
