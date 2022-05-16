---
'@backstage/plugin-scaffolder': patch
---

You can now hide sections of fields in your template based on if the current user is a member of a specific group entity. For example, take this template:

```yaml
spec:
  type: website
  owner: team-a
  parameters:
    - name: Enter some stuff
      description: Enter some stuff
      backstage:memberOf: group:default/internal
      properties:
        inputString:
          type: string
          title: string input test
    - name: Enter more stuff
      description: Enter more stuff
      properties:
        inputString:
          type: string
          title: string input test
        inputObject:
          type: object
          title: object input test
          description: a little nested thing never hurt anyone right?
          properties:
            first:
              type: string
              title: first
              backstage:memberOf: group:default/internal
            second:
              type: number
              title: second
```

If you have a a group entity ref that is `group:default/internal` then your first step would be shown if the current user is a member of that group, otherwise it would not be shown. The same goes for the nested properties in the spec. Make sure to use the key `backstage:memberOf` in your templates if you want to use this functionality.
