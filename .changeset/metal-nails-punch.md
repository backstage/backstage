---
'@backstage/plugin-scaffolder-backend': patch
---

This patch adds changes to provide examples alongside scaffolder task actions.

The `createTemplateAction` function now takes a list of examples e.g.

```typescript
const actionExamples = [
  {
    description: 'Example 1',
    example: yaml.stringify({
      steps: [
        {
          action: 'test:action',
          id: 'test',
          input: {
            input1: 'value',
          },
        },
      ],
    }),
  },
];

export function createTestAction() {
  return createTemplateAction({
      id: 'test:action',
      examples: [
          {
              description: 'Example 1',
              examples: actionExamples
          }
      ],
      ...,
  });
```

These examples can be retrieved later from the api.

```bash
curl http://localhost:7007/api/scaffolder/v2/actions
```

```json
[
  {
    "id": "test:action",
    "examples": [
      {
        "description": "Example 1",
        "example": "steps:\n  - action: test:action\n    id: test\n    input:\n      input1: value\n"
      }
    ],
    "schema": {
      "input": {
        "type": "object",
        "properties": {
          "input1": {
            "title": "Input 1",
            "type": "string"
          }
        }
      }
    }
  }
]
```
