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

import { useState } from 'react';
import {
  useApi,
  appTreeApiRef,
  type AppNode,
} from '@backstage/frontend-plugin-api';
import { Button } from '@backstage/ui';
import { RiFileCopyLine, RiCheckLine } from '@remixicon/react';

function nodeToJson(node: AppNode): object {
  const attachments: Record<string, object[]> = {};
  for (const [input, children] of node.edges.attachments) {
    attachments[input] = children.map(nodeToJson);
  }

  return {
    id: node.spec.id,
    plugin: node.spec.plugin.pluginId,
    disabled: node.spec.disabled || undefined,
    ...(Object.keys(attachments).length > 0 ? { attachments } : {}),
  };
}

export function CopyTreeButton() {
  const appTreeApi = useApi(appTreeApiRef);
  const [copied, setCopied] = useState(false);

  const handlePress = () => {
    const { tree } = appTreeApi.getTree();
    const json = JSON.stringify(nodeToJson(tree.root), null, 2);
    window.navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Button
      variant="secondary"
      size="small"
      iconStart={copied ? <RiCheckLine /> : <RiFileCopyLine />}
      onPress={handlePress}
    >
      {copied ? 'Copied!' : 'Copy as JSON'}
    </Button>
  );
}
