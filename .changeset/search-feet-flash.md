---
'@backstage/plugin-search-react': minor
---

Provides search autocomplete functionality through a `SearchAutocomplete` component.
A `SearchAutocompleteDefaultOption` can also be used to render options with icons, primary texts, and secondary texts.
Example:

```jsx
import React, { ChangeEvent, useState, useCallback } from 'react';
import useAsync from 'react-use/lib/useAsync';

import { Grid, Paper } from '@material-ui/core';

import { Page, Content } from '@backstage/core-components';
import { SearchAutocomplete, SearchAutocompleteDefaultOption} from '@backstage/plugin-search-react';

const OptionsIcon = () => <svg />

const SearchPage = () => {
  const [inputValue, setInputValue] = useState('');

  const options = useAsync(async () => {
    // Gets and returns autocomplete options
  }, [inputValue])

  const useCallback((_event: ChangeEvent<{}>, newInputValue: string) => {
    setInputValue(newInputValue);
  }, [setInputValue])

  return (
    <Page themeId="home">
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper>
              <SearchAutocomplete
                options={options}
                inputValue={inputValue}
                inputDebounceTime={100}
                onInputChange={handleInputChange}
                getOptionLabel={option => option.title}
                renderOption={option => (
                  <SearchAutocompleteDefaultOption
                    icon={<OptionIcon />}
                    primaryText={option.title}
                    secondaryText={option.text}
                  />
                )}
              />
            </Paper>
          </Grid>
        </Grid>
        {'/* Filters and results are omitted */'}
      </Content>
    </Page>
  );
};
```
