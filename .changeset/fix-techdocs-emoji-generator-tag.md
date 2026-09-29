---
'@backstage/plugin-techdocs-node': patch
---

Corrected the `materialx.emoji.to_svg` entry in the Python YAML tag allowlist. The entry was written as `python/object.apply` (with a dot), which is not a valid PyYAML tag construct — PyYAML's separator is a slash, and the intended tag kind is `python/name`, not `python/object/apply`. The `emoji_generator` config value expects a function reference, not a function call. As written, the entry could never match any valid config, so no `mkdocs.yml` could use an allowlisted `emoji_generator` for this function.
