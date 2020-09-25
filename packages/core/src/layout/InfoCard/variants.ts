/*
 * Copyright 2020 Spotify AB
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

const VARIANT_STYLES = {
  card: {
    flex: {
      display: 'flex',
      flexDirection: 'column',
    },
    fullHeight: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    height100: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100% - 10px)', // for pages without content header
      marginBottom: '10px',
    },
    contentheader: {
      height: 'calc(100% - 40px)', // for pages with content header
    },
    contentheadertabs: {
      height: 'calc(100% - 97px)', // for pages with content header and tabs (Tingle)
    },
    noShrink: {
      flexShrink: 0,
    },
    minheight300: {
      minHeight: 300,
      overflow: 'initial',
    },
    flat: {
      boxShadow: 'none',
    },
  },
  cardContent: {
    fullHeight: {
      flex: 1,
    },
    height100: {
      flex: 1,
    },
    contentRow: {
      display: 'flex',
      flexDirection: 'row',
    },
  },
};

export const getVariantStyles = (variant?: string): Record<string, object> => {
  const cardStyle = {};
  const contentStyle = {};

  if (variant) {
    const variants = variant.split(/[\s]+/g);
    variants.forEach(name => {
      Object.assign(
        cardStyle,
        VARIANT_STYLES.card[name as keyof typeof VARIANT_STYLES['card']],
      );
      Object.assign(
        contentStyle,
        VARIANT_STYLES.cardContent[
          name as keyof typeof VARIANT_STYLES['cardContent']
        ],
      );
    });
  }

  return { cardStyle, contentStyle };
};
