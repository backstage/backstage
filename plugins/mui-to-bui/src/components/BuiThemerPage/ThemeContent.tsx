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

import { useMemo, useState, useCallback } from 'react';
import { Theme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  Flex,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from '@backstage/ui';
import { convertMuiToBuiTheme } from './convertMuiToBuiTheme';
import { BuiThemePreview } from './BuiThemePreview';

interface ThemeContentProps {
  themeId: string;
  themeTitle: string;
  variant: 'light' | 'dark';
  muiTheme: Theme;
}

export function ThemeContent({
  themeId,
  themeTitle,
  variant,
  muiTheme,
}: ThemeContentProps) {
  const [activeTab, setActiveTab] = useState<string>('css');

  const { css, styleObject } = useMemo(() => {
    return convertMuiToBuiTheme(muiTheme);
  }, [muiTheme]);

  const handleCopy = useCallback(() => {
    window.navigator.clipboard.writeText(css);
  }, [css]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bui-theme-${themeId}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [css, themeId]);

  return (
    <Card>
      <Box p="6">
        <Flex direction="column" gap="4">
          <Flex justify="between" align="center">
            <Text variant="title-medium">{themeTitle}</Text>
            <Text variant="body-small" color="secondary">
              {variant} theme
            </Text>
          </Flex>

          <Flex gap="3">
            <Button onClick={handleCopy} variant="secondary">
              Copy CSS
            </Button>
            <Button onClick={handleDownload} variant="secondary">
              Download CSS
            </Button>
          </Flex>

          <Tabs
            selectedKey={activeTab}
            onSelectionChange={key => setActiveTab(key as string)}
          >
            <TabList>
              <Tab id="css">Generated CSS</Tab>
              <Tab id="preview">Live Preview</Tab>
            </TabList>

            <TabPanel id="css">
              <Box
                p="3"
                style={{
                  backgroundColor: 'var(--bui-bg-neutral-2)',
                  border: '1px solid var(--bui-border-2)',
                  borderRadius: 'var(--bui-radius-2)',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  height: '600px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                {css}
              </Box>
            </TabPanel>

            <TabPanel id="preview">
              <Box>
                <BuiThemePreview mode={variant} styleObject={styleObject} />
              </Box>
            </TabPanel>
          </Tabs>
        </Flex>
      </Box>
    </Card>
  );
}
