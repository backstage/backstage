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

import { TagGroup, Tag, Cell } from '@backstage/ui';
import { Cell as ReactAriaCell } from 'react-aria-components';

/**
 * Props for TagsCell
 * @internal
 */
export interface TagsCellProps {
  id?: string;
  hidden?: boolean;
  tags?: string[];
}

/**
 * Cell component that displays tags
 * @internal
 */
export function TagsCell(props: TagsCellProps) {
  const { id, hidden, tags } = props;

  if (!tags || tags.length === 0) {
    return <Cell id={id} title="" hidden={hidden} />;
  }

  if (hidden) {
    return null;
  }

  return (
    <ReactAriaCell id={id} className="bui-TableCell">
      <div className="bui-TableCellContentWrapper">
        <div className="bui-TableCellContent">
          <div style={{ padding: '0px 16px 0px 20px' }}>
            <TagGroup>
              {tags.map(tag => (
                <Tag key={tag} size="small">
                  {tag}
                </Tag>
              ))}
            </TagGroup>
          </div>
        </div>
      </div>
    </ReactAriaCell>
  );
}
