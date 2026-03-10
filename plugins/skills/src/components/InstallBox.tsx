/*
 * Copyright 2026 The Backstage Authors
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

import { useEffect, useState } from 'react';
import { Box, Button, Flex, Text } from '@backstage/ui';

type InstallBoxProps = {
  command: string;
  description: string;
};

/** @internal */
export function InstallBox({ command, description }: InstallBoxProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  return (
    <Flex direction="column" gap="3">
      <Text>{description}</Text>
      <Flex align="start" gap="2">
        <Box
          style={{
            backgroundColor: 'var(--bui-bg-neutral-1, #f5f5f5)',
            padding: 'var(--bui-space-3, 12px)',
            borderRadius: 'var(--bui-radius-md, 8px)',
            fontFamily: 'monospace',
            overflowX: 'auto',
            flex: 1,
          }}
        >
          <Text>{command}</Text>
        </Box>
        <Button
          variant="secondary"
          size="small"
          onPress={async () => {
            try {
              await globalThis.navigator?.clipboard?.writeText(command);
              setCopied(true);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </Flex>
    </Flex>
  );
}
