ConfluenceResultListItem.tsx reference

```tsx
import React from 'react';
import { Link } from '@backstage/core-components';
import { IndexableDocument } from '@backstage/plugin-search-common';
import {
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

type Props = {
  result: IndexableDocument;
};

export const ConfluenceResultListItem = ({ result }: Props) => {
  // Remove html tags from document text before displaying
  const chars = [];
  let isTag = false;
  for (const c of result.text.substring(0, 500)) {
    if (c === '<') {
      isTag = true;
      continue;
    }
    if (c === '>') {
      isTag = false;
      chars.push(' ');
      continue;
    }
    if (!isTag) {
      chars.push(c);
    }
  }
  const excerpt =
    chars.join('').substring(0, 80) + (result.text.length > 80 ? '...' : '');

  return (
    <Link to={result.location}>
      <ListItem alignItems="center">
        <ListItemIcon>
          <img
            width="20"
            height="20"
            src="https://cdn.worldvectorlogo.com/logos/confluence-1.svg"
          />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{ variant: 'h6' }}
          primary={result.title}
          secondary={excerpt}
        />
      </ListItem>
      <Divider />
    </Link>
  );
};
```
