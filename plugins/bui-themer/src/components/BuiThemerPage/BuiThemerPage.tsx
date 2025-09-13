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
} from '@backstage/ui';
import {
  convertMuiToBuiTheme,
  ConvertMuiToBuiThemeOptions,
} from './convertMuiToBuiTheme';

// Memoization cache for generated CSS
const cssCache = new Map<string, string>();

interface ThemeContentProps {
  themeId: string;
  themeTitle: string;
  variant: 'light' | 'dark';
  muiTheme: Theme;
}

function ThemeContent({
  themeId,
  themeTitle,
  variant,
  muiTheme,
}: ThemeContentProps) {
  const [generatedCss, setGeneratedCss] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [includeThemeId, setIncludeThemeId] = useState(false);

  const css = useMemo(() => {
    // Create cache key based on theme properties and options
    const cacheKey = `${themeId}-${includeThemeId}-${JSON.stringify({
      palette: muiTheme.palette,
      typography: muiTheme.typography,
      spacing: muiTheme.spacing,
      shape: muiTheme.shape,
    })}`;

    // Check cache first
    if (cssCache.has(cacheKey)) {
      return cssCache.get(cacheKey)!;
    }

    const options: ConvertMuiToBuiThemeOptions = {
      themeId,
      includeThemeId,
    };
    const result = convertMuiToBuiTheme(muiTheme, options);

    // Cache the result
    cssCache.set(cacheKey, result);

    // Clean up old cache entries (keep only last 50)
    if (cssCache.size > 50) {
      const firstKey = cssCache.keys().next().value;
      if (firstKey) {
        cssCache.delete(firstKey);
      }
    }

    return result;
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

  const handlePreviewToggle = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      // Apply the generated CSS to a style element
      const styleId = `bui-theme-preview-${themeId}`;
      let styleElement = document.getElementById(styleId);
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = generatedCss;
    } else {
      // Remove the preview styles
      const styleElement = document.getElementById(
        `bui-theme-preview-${themeId}`,
      );
      if (styleElement) {
        styleElement.remove();
      }
    }
  }, [isPreviewMode, generatedCss, themeId]);

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
            <Button
              onClick={handlePreviewToggle}
              variant={isPreviewMode ? 'primary' : 'secondary'}
            >
              {isPreviewMode ? 'Stop Preview' : 'Preview'}
            </Button>
          </Flex>

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
                maxHeight: '400px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {generatedCss}
            </Box>
          </Box>

          {isPreviewMode && (
            <Box>
              <Text variant="body-medium" style={{ marginBottom: '12px' }}>
                Live Preview:
              </Text>
              <Box
                p="4"
                style={{
                  border: '1px solid var(--bui-border)',
                  borderRadius: 'var(--bui-radius-2)',
                  backgroundColor: 'var(--bui-bg-surface-1)',
                }}
              >
                <Flex direction="column" gap="3">
                  <Box
                    p="3"
                    style={{
                      backgroundColor: 'var(--bui-bg-solid)',
                      color: 'var(--bui-fg-solid)',
                      borderRadius: 'var(--bui-radius-1)',
                    }}
                  >
                    <Text variant="body-medium">Solid Button</Text>
                  </Box>
                  <Box
                    p="3"
                    style={{
                      backgroundColor: 'var(--bui-bg-tint)',
                      color: 'var(--bui-fg-tint)',
                      borderRadius: 'var(--bui-radius-1)',
                    }}
                  >
                    <Text variant="body-medium">Tint Button</Text>
                  </Box>
                  <Box
                    p="3"
                    style={{
                      backgroundColor: 'var(--bui-bg-surface-2)',
                      color: 'var(--bui-fg-primary)',
                      borderRadius: 'var(--bui-radius-1)',
                    }}
                  >
                    <Text variant="body-medium">Surface Card</Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
          )}
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
