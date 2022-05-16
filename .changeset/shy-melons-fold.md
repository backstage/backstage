---
'@backstage/plugin-scaffolder': patch
---

You can now hide sections of fields in your template based on if the current user is a member of a specific group entity. For example, take this template:

```json
{
  title: 'my-schema',
  steps: [
    {
      title: 'Fill in some steps',
      schema: {
        title: 'Fill in some steps',
        'backstage:memberOf': 'group:default/internal',
        properties: {
          name: {
            title: 'Name',
            type: 'string',
            'backstage:memberOf': 'group:default/admins',
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

If you have a a group entity ref that is `group:default/internal` then your first step would be shown if the current user is a member of that group, otherwise it would not bne shown. The same goes for the properties in the schema. Make sure to use the key `backstage:memberOf` in your templates if you want to use this functionality.
