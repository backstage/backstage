---
'@backstage/plugin-mcp-actions-backend': minor
---

MCP tool names are now normalized to `snake_case` before they are exposed (lowercased, with any run of characters other than letters, digits, or underscores replaced by a single underscore), so an action such as `greet-user` from `my-custom-plugin` is now listed as `my_custom_plugin_greet_user`. This fixes tool calling for LLM clients (such as Anthropic Claude and Google Gemini) that reject tool names containing `.` or `-`.

Tool calls that reference the previous, un-normalized name (for example `my-custom-plugin.greet-user`) continue to resolve, so existing clients keep working without changes. If two actions normalize to the same tool name, only the first is listed and a warning is logged so the collision can be resolved by renaming one of the actions.
