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

import { AppNode, AppTree } from '@backstage/frontend-plugin-api';
import { Box, Checkbox } from '@backstage/ui';
import { ReactNode, useState } from 'react';

function mkDiv(
  children: ReactNode,
  options?: { indent?: boolean; key?: string | number; color?: string },
) {
  return (
    <div
      key={options?.key}
      style={{
        color: options?.color,
        marginLeft: options?.indent ? 'var(--bui-space-4)' : undefined,
      }}
    >
      {children}
    </div>
  );
}

function nodeToText(
  node: AppNode,
  options?: { showOutputs?: boolean; showDisabled?: boolean },
): ReactNode {
  const dataRefIds =
    node.instance && [...node.instance.getDataRefs()].map(r => r.id);
  const out =
    options?.showOutputs && dataRefIds && dataRefIds.length > 0
      ? ` out="${[...dataRefIds].sort().join(', ')}"`
      : '';
  const color = node.instance ? undefined : 'gray';

  if (node.edges.attachments.size === 0) {
    return mkDiv(`<${node.spec.id}${out}/>`, { color });
  }

  return mkDiv([
    mkDiv(`<${node.spec.id}${out}>`, { key: 'start', color }),
    ...[...node.edges.attachments.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, v]) => {
        const children = v
          .filter(e => options?.showDisabled || e.instance)
          .sort((a, b) => a.spec.id.localeCompare(b.spec.id));
        if (children.length === 0) {
          return mkDiv(`${key} []`, { key, indent: true });
        }
        return mkDiv(
          [
            mkDiv(`${key} [`, { key: 'start' }),
            ...children.map(e =>
              mkDiv(nodeToText(e, options), { indent: true, key: e.spec.id }),
            ),
            mkDiv(']', { key: 'end' }),
          ],
          { key, indent: true },
        );
      }),
    mkDiv(`</${node.spec.id}>`, { key: 'end', color }),
  ]);
}

export function TextVisualizer({ tree }: { tree: AppTree }) {
  const [showOutputs, setShowOutputs] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <>
      <Box style={{ overflow: 'auto', flex: '1 0 0' }}>
        <Box m="4" style={{ width: 'max-content' }}>
          {nodeToText(tree.root, { showOutputs, showDisabled })}
        </Box>
      </Box>
      <Box
        py="2"
        px="4"
        style={{
          background: 'var(--bui-bg-neutral-1)',
          borderTop: '1px solid var(--bui-border)',
        }}
      >
        <Checkbox isSelected={showOutputs} onChange={setShowOutputs}>
          Show Outputs
        </Checkbox>
        <Checkbox isSelected={showDisabled} onChange={setShowDisabled}>
          Show Disabled
        </Checkbox>
      </Box>
    </>
  );
}
