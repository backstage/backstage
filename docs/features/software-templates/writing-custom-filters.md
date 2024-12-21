---
id: writing-custom-filters
title: Writing Custom Filters
description: How to write your own filters for software templates
---

By default, the scaffolder page provides a set of filters that you can use to filter the available software templates. However, you can also write your own filters based on custom kinds and properties, and mix and match them with the default filters.

## Writing a Custom Filter

Writing a custom filter for the scaffolder is almost identical to [writing custom filters for the catalog](https://backstage.io/docs/features/software-catalog/catalog-customization/#customize-filters).

The following example will show you how to write a custom filter to split the default tag filter into multiple customized categories. Instead of having a single tag filter, we can have one filter for Languages, another for AWS Services and a third for Status.

First, we create a new component called `CustomEntityTagPicker` that will render a single tag picker for a specific category. We will use this component in `App.tsx` to override the default filters.

Then, we add a `CustomEntityTagFilter` which implements the `EntityFilter` interface. The `filterEntity` implementation will depend on the custom filter logic you want to apply. We also need to create a new type `CustomFilters` that extends the `DefaultEntityFilters` and adds the custom filter we created.

Finally, we use the `useEntityList` hook to get the current filters and add/update the list of filters when the user interacts with our custom filter. We can then plug in the custom tags into the view.

```tsx title="src/components/scaffolder/CustomEntityTagPicker.tsx"
import React from 'react';
import {
  DefaultEntityFilters,
  EntityFilter,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';

export type EntityTagPickerProps = {
  label: string;
  allowedTags: string[];
  showCounts?: boolean;
};

class CustomEntityTagFilter implements EntityFilter {
  constructor(readonly values: string[]) {}

  filterEntity(entity: Entity): boolean {
    const entityTags = entity.metadata.tags ?? [];
    return this.values.every(tag => entityTags.includes(tag));
  }
}

export type CustomFilters = DefaultEntityFilters & {
  customTags: CustomEntityTagFilter;
};

export const CustomEntityTagPicker = (props: EntityTagPickerProps) => {
  const {
    filters: { customTags },
    updateFilters,
  } = useEntityList<CustomFilters>();

  function onChange(value: string) {
    const newTags = customTags?.values.includes(value)
      ? customTags.values.filter(tag => tag !== value)
      : [...(customTags?.values ?? []), value];
    updateFilters({
      customTags: newTags.length
        ? new CustomEntityTagFilter(newTags)
        : undefined,
    });
  }
  const allowedTags = props.allowedTags.map(tag =>
    tag.toLocaleLowerCase('en-US'),
  );

  return (
    <Box display="flex" flexDirection="column">
      <FormControl component="fieldset">
        <Typography variant="button">{props.label}</Typography>
        <FormGroup>
          {allowedTags.map(tier => (
            <FormControlLabel
              key={tier}
              control={
                <Checkbox
                  checked={customTags?.values.includes(tier)}
                  onChange={() => onChange(tier)}
                />
              }
              label={`${tier.charAt(0).toLocaleUpperCase('en-US')}${tier.slice(
                1,
              )}`}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
};
```

Once we have the `CustomEntityTagPicker` component, we can use it in `App.tsx` to override the default filters. We can also add other filters like `EntityTagPicker` and `EntityOwnerPicker` to the list of filters.

:::note Note

The `EntityKindPicker` is required in order to display all the existing templates. It is hidden by default in order to improve the user experience.

:::

```tsx title="src/App.tsx"
// ...
<Route
  path="/create"
  element={
    <ScaffolderPage
      defaultPreviewTemplate={defaultPreviewTemplate}
      groups={[
        {
          title: 'Recommended',
          filter: entity =>
            entity?.metadata?.tags?.includes('recommended') ?? false,
        },
      ]}
      {/* highlight-add-start */}
      overrideFilters={
        <>
          <EntityKindPicker initialFilter="template" hidden />
          <EntityTagPicker />
          <CustomEntityTagPicker label='languages' allowedTags={['React', 'Java', 'Go']} />
          <CustomEntityTagPicker label='aws services' allowedTags={['AWS-Lambda', 's3', 'Fargate']} />
          <CustomEntityTagPicker label='status' allowedTags={['Experimental', 'First Class', 'Community Contributed']} />
          <EntityOwnerPicker />
        </>
      }
      {/* highlight-add-end */}
    />
  }
>
  <ScaffolderFieldExtensions>
    <DelayingComponentFieldExtension />
  </ScaffolderFieldExtensions>
  <ScaffolderLayouts>
    <TwoColumnLayout />
  </ScaffolderLayouts>
</Route>
// ...
```
