/*
 * Copyright 2022 The Backstage Authors
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
import { MarkdownContent } from '@backstage/core-components';
import { Box, Text } from '@backstage/ui';

type WizardTemplateHeaderProps = {
  title?: string;
  description?: string;
};

export const WizardTemplateHeader = ({
  title,
  description,
}: WizardTemplateHeaderProps) => {
  if (!title && !description) {
    return null;
  }

  return (
    <Box py="6" px="6" mx="auto" style={{ maxWidth: '800px' }}>
      {title && (
        <Text
          as="h2"
          variant="title-small"
          weight="bold"
          style={{ marginBottom: 'var(--bui-space-2)', textAlign: 'center' }}
        >
          {title}
        </Text>
      )}
      {description && (
        <Box style={{ textAlign: 'center' }}>
          <MarkdownContent content={description} linkTarget="_blank" />
        </Box>
      )}
    </Box>
  );
};
