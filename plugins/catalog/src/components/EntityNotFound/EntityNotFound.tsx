/*
 * Copyright 2020 The Backstage Authors
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

import { Box, ButtonLink, Flex, Text } from '@backstage/ui';
import { Illo } from './Illo';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import styles from './EntityNotFound.module.css';

export function EntityNotFound() {
  const { t } = useTranslationRef(catalogTranslationRef);

  return (
    <Flex gap="0" className={styles.container}>
      <Illo />
      <Box className={styles.content}>
        <Text
          as="h2"
          variant="title-large"
          weight="bold"
          className={styles.title}
        >
          {t('entityNotFound.title')}
        </Text>
        <Text as="p" variant="body-large" className={styles.body}>
          {t('entityNotFound.description')}
        </Text>
        <ButtonLink
          variant="primary"
          size="medium"
          href="https://backstage.io/docs"
        >
          {t('entityNotFound.docButtonTitle')}
        </ButtonLink>
      </Box>
    </Flex>
  );
}
