---
'@backstage/ui': patch
---

Migrated all components from `useStyles` to `useDefinition` hook. Exported `OwnProps` types for each component, enabling better type composition for consumers.

**Affected components:** Avatar, Checkbox, Container, Dialog, FieldError, FieldLabel, Flex, FullPage, Grid, HeaderPage, Link, Menu, PasswordField, PluginHeader, Popover, RadioGroup, SearchField, Select, Skeleton, Switch, Table, TablePagination, Tabs, TagGroup, Text, TextField, ToggleButton, ToggleButtonGroup, Tooltip, VisuallyHidden
