---
'@backstage/plugin-scaffolder': patch
---

You can now hide sections or fields in your templates based on a feature flag. For example, take this template:

```json
{
  title: 'my-schema',
  steps: [
    {
      title: 'Fill in some steps',
      schema: {
        title: 'Fill in some steps',
        'backstage:featureFlag': 'experimental-feature',
        properties: {
          name: {
            title: 'Name',
            type: 'string',
            'backstage:featureFlag': 'should-show-some-stuff-first-option',
          },
          description: {
            title: 'Description',
            type: 'string',
            description: 'A description for the component',
          },
          owner: {
            title: 'Owner',
            type: 'string',
            description: 'Owner of the component',
          },
        },
        type: 'object',
      },
  },
}

```

If you have a feature flag that is called `experimental-feature` then your first step would be shown if you that feature flag was not active then it wouldn't be shown. The same goes for the properties in the schema. Make sure to use the key `backstage:featureFlag` in your templates if you want to use this functionality.
