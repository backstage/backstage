# org-react

## features

- Group list picker component

### GroupListPicker

The `GroupListPicker` component displays a select box which also has autocomplete functionality.

To use the `GroupListPicker` component you'll need to import it and add it to your desired place.

```diff
+ import { GroupListPicker } from '@backstage/plugin-org-react';
+ import React, { useState } from 'react';

+ const [group, setGroup] = useState<GroupEntity | undefined>();

 <Grid container spacing={3}>
    <Grid item xs={12}>
+     <GroupListPicker groupTypes={['team']} placeholder='Search for a team' onChange={setGroup} defaultValue='Team A'/>
    </Grid>
 </Grid>
```

The `GroupListPicker` comes with four props:

- `groupTypes`: gives the user the option which group types the component should load. If no value is provided all group types will be loaded in;
- `placeholder`: the placeholder that the select box in the component should display. This might be helpful in informing your users what the functionality of the component is.
- `onChange`: a prop to help the user to give access to the selected group
- `defaultValue`: gives the user the option to define a default value that will be shown initially before making a selection
