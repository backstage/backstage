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
import { useApi } from '@backstage/core-plugin-api';
import { appThemeApiRef } from '@backstage/core-plugin-api';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  HeaderPage,
  Text,
  TextField,
  Switch,
} from '@backstage/ui';
import {
  convertMuiToBuiTheme,
  ConvertMuiToBuiThemeOptions,
} from './convertMuiToBuiTheme';

interface ThemePreviewProps {
  themeId: string;
  themeTitle: string;
  variant: 'light' | 'dark';
  Provider: React.ComponentType<{ children: React.ReactNode }>;
}

// Memoization cache for generated CSS
const cssCache = new Map<string, string>();

interface ThemeContentProps {
  themeId: string;
  themeTitle: string;
  variant: 'light' | 'dark';
}

function ThemeContent({ themeId, themeTitle, variant }: ThemeContentProps) {
  const [generatedCss, setGeneratedCss] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [includeThemeId, setIncludeThemeId] = useState(false);
  const muiTheme = useTheme();

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
      <Box p="4">
        <Flex direction="column" gap="3">
          <Flex justify="between" align="center">
            <Text variant="title-small">{themeTitle}</Text>
            <Text variant="body-small" color="secondary">
              {variant} theme
            </Text>
          </Flex>

          <Flex gap="2" align="center">
            <Switch
              isSelected={includeThemeId}
              onChange={setIncludeThemeId}
              label="Include theme ID scoping"
            />
          </Flex>

          <Flex gap="2">
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
            <TextField
              value={generatedCss}
              isReadOnly
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
            />
          </Box>

          {isPreviewMode && (
            <Box
              p="3"
              style={{
                border: '1px solid var(--bui-border)',
                borderRadius: 'var(--bui-radius-2)',
                backgroundColor: 'var(--bui-bg-surface-1)',
              }}
            >
              <Text variant="body-small" style={{ marginBottom: '8px' }}>
                Live Preview:
              </Text>
              <Box
                p="2"
                style={{
                  backgroundColor: 'var(--bui-bg-solid)',
                  color: 'var(--bui-fg-solid)',
                }}
              >
                <Text>Solid Button</Text>
              </Box>
              <Box
                p="2"
                mt="2"
                style={{
                  backgroundColor: 'var(--bui-bg-tint)',
                  color: 'var(--bui-fg-tint)',
                }}
              >
                <Text>Tint Button</Text>
              </Box>
              <Box
                p="2"
                mt="2"
                style={{
                  backgroundColor: 'var(--bui-bg-surface-2)',
                  color: 'var(--bui-fg-primary)',
                }}
              >
                <Text>Surface Card</Text>
              </Box>
            </Box>
          )}
        </Flex>
      </Box>
    </Card>
  );
}

function ThemePreview({
  themeId,
  themeTitle,
  variant,
  Provider,
}: ThemePreviewProps) {
  return (
    <Provider>
      <ThemeContent
        themeId={themeId}
        themeTitle={themeTitle}
        variant={variant}
      />
    </Provider>
  );
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
          <Grid.Root gap="3">
            {installedThemes.map(theme => (
              <Grid.Item key={theme.id}>
                <ThemePreview
                  themeId={theme.id}
                  themeTitle={theme.title}
                  variant={theme.variant}
                  Provider={theme.Provider}
                />
              </Grid.Item>
            ))}
          </Grid.Root>
        )}
      </Box>
    </Container>
  );
}
