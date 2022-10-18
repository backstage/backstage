# org-react

## features

- Group list picker component

### GroupListPicker

The `GroupListPicker` component displays a select box which also has autocomplete functionality.

To use the `GroupListPicker` component you'll need to import it and add it to your desired place.

```diff
+ import { GroupListPicker } from '@backstage/plugin-org-react';

 <Grid container spacing={3}>
    <Grid item xs={12}>
+     <GroupListPicker groupTypes={['team']} defaultGroup='team-a' placeholder='Search for a team' />
    </Grid>
 </Grid>
```

The `GroupListPicker` comes with three optional props:

- **groupTypes**: gives the user the option which group types the component should load. If no value is provided all group types will be loaded in;
- **defaultGroup**: which group by default should be selected. For example, a group of the logged in user;
- **placeholder**: the placeholder that the select box in the component should display. This might be helpfull in informing your users what the functionality of the component is.
