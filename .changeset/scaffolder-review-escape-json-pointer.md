---
'@backstage/plugin-scaffolder-react': patch
---

Fixed the scaffolder review step not masking, hiding or labelling fields whose names contain `/` or `~`. Field names are now escaped per RFC 6901 before being used as JSON Pointer segments, so a field named `api/token` with `ui:widget: password` is masked on the review step like any other password field.
