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

import { useMemo, useState, useCallback, useEffect } from 'react';
import { AppTheme, useApi } from '@backstage/core-plugin-api';
import { appThemeApiRef } from '@backstage/core-plugin-api';
import { Theme, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  HeaderPage,
  Text,
  Switch,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TextField,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  CardHeader,
  CardBody,
} from '@backstage/ui';
import { convertMuiToBuiTheme } from './convertMuiToBuiTheme';

interface ThemeContentProps {
  themeId: string;
  themeTitle: string;
  variant: 'light' | 'dark';
  muiTheme: Theme;
}

interface IsolatedPreviewProps {
  mode: 'light' | 'dark';
  css: string;
}

function BuiThemePreview({ mode, css }: IsolatedPreviewProps) {
  return (
    <div
      // Setting the theme mode ensures that the correct defaults are picked up from the BUI theme
      data-theme-mode={mode}
      style={{
        // Apply the generated CSS variables directly to this container
        // This creates a scoped context where the variables take precedence
        ...Object.fromEntries(
          css
            .split('\n')
            .filter(line => line.trim().startsWith('--bui-'))
            .map(line => {
              const [key, value] = line.trim().split(':');
              return [key?.trim(), value?.replace(';', '').trim()];
            })
            .filter(([key, value]) => key && value),
        ),
        width: '100%',
        backgroundColor: 'var(--bui-bg-surface-2)',
        padding: 'var(--bui-space-3)',
        borderRadius: 'var(--bui-radius-2)',
      }}
    >
      <Flex direction="column" gap="4">
        <Card>
          <CardHeader>Theme Preview</CardHeader>
          <CardBody>
            <Text
              variant="body-small"
              style={{ color: 'var(--bui-fg-secondary)' }}
            >
              This preview shows how your theme will look with various Backstage
              UI components
            </Text>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Button Variants</CardHeader>
          <CardBody>
            <Flex gap="3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Form Inputs</CardHeader>
          <CardBody>
            <Flex direction="column" gap="3">
              <TextField label="Text Input" placeholder="Enter some text" />
              <Select
                label="Select Input"
                options={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' },
                ]}
              />
              <Checkbox label="Checkbox Option" />
              <RadioGroup label="Radio Group" orientation="horizontal">
                <Radio value="radio-option" />
                <Text variant="body-small">Option 1</Text>
                <Radio value="radio-option" />
                <Text variant="body-small">Option 2</Text>
                <Radio value="radio-option" />
                <Text variant="body-small">Option 3</Text>
              </RadioGroup>
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Surface Variations</CardHeader>
          <CardBody>
            <Flex gap="3">
              <Card
                style={{
                  backgroundColor: 'var(--bui-bg-surface-1)',
                  color: 'var(--bui-fg-primary)',
                  padding: '12px',
                  minWidth: '120px',
                }}
              >
                <Text variant="body-small">Surface 1</Text>
              </Card>
              <Card
                style={{
                  backgroundColor: 'var(--bui-bg-surface-2)',
                  color: 'var(--bui-fg-primary)',
                  padding: '12px',
                  minWidth: '120px',
                }}
              >
                <Text variant="body-small">Surface 2</Text>
              </Card>
              <Card
                style={{
                  backgroundColor: 'var(--bui-bg-solid)',
                  color: 'var(--bui-fg-solid)',
                  padding: '12px',
                  minWidth: '120px',
                }}
              >
                <Text variant="body-small">Solid</Text>
              </Card>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </div>
  );
}

function ThemeContent({
  themeId,
  themeTitle,
  variant,
  muiTheme,
}: ThemeContentProps) {
  const [generatedCss, setGeneratedCss] = useState<string>('');
  const [includeThemeId, setIncludeThemeId] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('css');

  const css = useMemo(() => {
    return convertMuiToBuiTheme(muiTheme, {
      themeId,
      includeThemeId,
    });
  }, [muiTheme, themeId, includeThemeId]);

  useEffect(() => {
    setGeneratedCss(css);
  }, [css]);

  const handleCopy = useCallback(() => {
    window.navigator.clipboard.writeText(generatedCss);
  }, [generatedCss]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([generatedCss], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bui-theme-${themeId}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generatedCss, themeId]);

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

          <Flex gap="3" align="center">
            <Switch
              isSelected={includeThemeId}
              onChange={setIncludeThemeId}
              label="Include theme ID scoping"
            />
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
              <Box>
                <Text variant="body-small" style={{ marginBottom: '8px' }}>
                  Generated CSS:
                </Text>
                <Box
                  p="3"
                  style={{
                    backgroundColor: 'var(--bui-bg-surface-2)',
                    border: '1px solid var(--bui-border)',
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
                  {generatedCss}
                </Box>
              </Box>
            </TabPanel>

            <TabPanel id="preview">
              <Box>
                <BuiThemePreview mode={variant} css={generatedCss} />
              </Box>
            </TabPanel>
          </Tabs>
        </Flex>
      </Box>
    </Card>
  );
}

function MuiThemeExtractor(props: {
  appTheme: AppTheme;
  children: (theme: Theme) => JSX.Element;
}): JSX.Element {
  const { appTheme, children } = props;
  const [theme, setTheme] = useState<Theme | null>(null);
  const { Provider } = appTheme;
  if (theme) {
    return children(theme);
  }

  return (
    <Provider>
      <MuiThemeExtractorInner setTheme={setTheme} />
    </Provider>
  );
}

function MuiThemeExtractorInner(props: { setTheme: (theme: Theme) => void }) {
  props.setTheme(useTheme());
  return null;
}

export function BuiThemerPage() {
  const appThemeApi = useApi(appThemeApiRef);
  const installedThemes = appThemeApi.getInstalledThemes();

  return (
    <Container>
      <HeaderPage title="BUI Theme Converter" />
      <Box mt="4">
        <Text variant="body-medium" color="secondary">
          Convert MUI v5 themes to BUI CSS variables. Select a theme to generate
          the corresponding BUI CSS variables that can be copied or downloaded.
        </Text>
      </Box>

      <Box mt="4">
        {installedThemes.length === 0 ? (
          <Card>
            <Box p="4">
              <Text>
                No themes found. Please install some themes in your Backstage
                app.
              </Text>
            </Box>
          </Card>
        ) : (
          <Flex direction="column" gap="4">
            {installedThemes.map(theme => (
              <MuiThemeExtractor key={theme.id} appTheme={theme}>
                {muiTheme => (
                  <ThemeContent
                    key={theme.id}
                    themeId={theme.id}
                    themeTitle={theme.title}
                    variant={theme.variant}
                    muiTheme={muiTheme}
                  />
                )}
              </MuiThemeExtractor>
            ))}
          </Flex>
        )}
      </Box>
    </Container>
  );
}
