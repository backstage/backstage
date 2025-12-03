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

import { useApi } from '@backstage/core-plugin-api';
import { appThemeApiRef } from '@backstage/core-plugin-api';
import { Box, Card, Container, Flex, HeaderPage, Text } from '@backstage/ui';
import { ThemeContent } from './ThemeContent';
import { MuiThemeExtractor } from './MuiThemeExtractor';

export const BuiThemerPage = () => {
  const appThemeApi = useApi(appThemeApiRef);
  const installedThemes = appThemeApi.getInstalledThemes();

  return (
    <Container>
      <HeaderPage title="BUI Theme Converter" />
      <Box m="4">
        <Text variant="body-medium" color="secondary">
          Convert your MUI v5 theme into BUI CSS variables. Pick a theme to view
          and export the generated BUI CSS variable definitions for use in your
          project.
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
};
