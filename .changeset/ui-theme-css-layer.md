---
'@backstage/ui': patch
---

Added a `theme` CSS cascade layer between `components` and `utilities`. BUI leaves it empty: put your app's brand overrides in `@layer theme` to win over component styles without raising specificity, while utility props still take precedence. Existing styles are unaffected.

If your app already declares its own layer named `theme`, its rules now sit below BUI's utility classes instead of above them.

**Affected components:** Accordion, Alert, Avatar, Badge, Box, Button, ButtonIcon, ButtonLink, Card, Checkbox, CheckboxGroup, Combobox, Container, DatePicker, DateRangePicker, Dialog, FieldError, FieldLabel, Flex, FullPage, Grid, Header, Link, List, Menu, NumberField, PasswordField, PluginHeader, Popover, RadioGroup, SearchAutocomplete, SearchField, Select, Skeleton, Slider, Switch, Table, TablePagination, Tabs, TagGroup, Text, TextAreaField, TextField, ToggleButton, ToggleButtonGroup, Tooltip, VisuallyHidden
