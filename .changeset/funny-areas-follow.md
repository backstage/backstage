---
'@backstage/plugin-mcp-actions-backend': minor
---

## Summary

Adds support for MCP action outputs of type `image`. When an action returns `{ type: 'image', data: <base64> }`, the service now emits an image content block instead of coercing the entire output into a fenced JSON text blob. This avoids unnecessary LLM parsing overhead and enables compatible clients to render images directly.

Previously every tool/action result was wrapped as a text payload:

````json
{
  "content": [
    {
      "type": "text",
      "text": "```json\n{...}\n```"
    }
  ]
}
````

This caused:

- Image generation tools to be treated as text, slowing responses.
- Failures or degraded behavior when large base64 data was reinterpreted downstream.

Now image outputs pass through structurally:

```json
{
  "content": [
    {
      "type": "image",
      "data": "<base64>",
      "mimeType": "image/png"
    }
  ]
}
```

## Usage

### Register the action

```ts
actionsRegistry.register(createGenerateImageAction());
```

### Inside the action

```ts
return {
  output: {
    type: 'image',
    data: base64Data,
  },
};
```

### Client receives

```json
{
  "content": [
    {
      "type": "image",
      "data": "<base64>",
      "mimeType": "image/png"
    }
  ]
}
```

## Implementation Notes

- Added type guards:
  - `isJsonObject(value: JsonValue): value is JsonObject`
  - `isImageOutput(obj: JsonObject): obj is { type: 'image'; data: JsonValue }`
- Conditional branch in `McpService.callTool`:
  - If image → `{ type: 'image', data, mimeType: 'image/png' }`
  - Else → legacy fenced JSON text output preserved (no breaking change)
- MIME type currently fixed to `image/png` (can be generalized later).

## Diff (Excerpt)

````diff
+ // Type guard to check if a JsonValue is a JsonObject
+ function isJsonObject(value: JsonValue): value is JsonObject { ... }
+ function isImageOutput(obj: JsonObject): obj is JsonObject & { type: 'image'; data: JsonValue } { ... }
...
-  type: 'text'
-  text: ```json ... ```
+  type: isImageType ? 'image' : 'text'
+  (image → data + mimeType, else → fenced JSON)
````
