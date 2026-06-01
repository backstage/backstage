# no-deprecated-bui-tokens

Warns when a deprecated `@backstage/ui` CSS token is referenced inside a JS/TS string or template literal.

The `@backstage/ui` design token system has been updated with a new set of semantic color families. The old tokens still work for backward compatibility, but they are scheduled for removal in a future major version.

## Rule Details

This rule reports a warning for any string value that contains a reference to a deprecated BUI CSS custom property, such as `var(--bui-bg-solid)` or `var(--bui-fg-danger)`.

Examples of **incorrect** code for this rule:

```js
// Deprecated background token
const style = { background: 'var(--bui-bg-solid)' };

// Deprecated foreground token
const style = { color: 'var(--bui-fg-danger)' };

// Deprecated token in a template literal
const css = `border: 1px solid var(--bui-border-danger)`;
```

Examples of **correct** code for this rule:

```js
// New accent family
const style = { background: 'var(--bui-accent-bg)' };

// New semantic negative family
const style = { color: 'var(--bui-negative-fg-subdued)' };

// New semantic positive family
const style = { borderColor: 'var(--bui-positive-border)' };
```

## Migration Guide

Replace deprecated tokens with their equivalents from the new semantic families.

### Neutral backgrounds

The neutral background tokens (`--bui-bg-app`, `--bui-bg-neutral-1..4`) are now the active semantic tokens with updated solid-color values. The `-hover`, `-pressed`, and `-disabled` interaction variants remain deprecated:

| Deprecated                    | Replacement           |
| ----------------------------- | --------------------- |
| `--bui-bg-neutral-1-hover`    | _(remove or restyle)_ |
| `--bui-bg-neutral-1-pressed`  | _(remove or restyle)_ |
| `--bui-bg-neutral-1-disabled` | _(remove or restyle)_ |
| `--bui-bg-neutral-2-hover`    | _(remove or restyle)_ |
| `--bui-bg-neutral-2-pressed`  | _(remove or restyle)_ |
| `--bui-bg-neutral-2-disabled` | _(remove or restyle)_ |
| `--bui-bg-neutral-3-hover`    | _(remove or restyle)_ |
| `--bui-bg-neutral-3-pressed`  | _(remove or restyle)_ |
| `--bui-bg-neutral-3-disabled` | _(remove or restyle)_ |
| `--bui-bg-neutral-4-hover`    | _(remove or restyle)_ |
| `--bui-bg-neutral-4-pressed`  | _(remove or restyle)_ |
| `--bui-bg-neutral-4-disabled` | _(remove or restyle)_ |

### Foreground

| Deprecated         | Replacement             |
| ------------------ | ----------------------- |
| `--bui-fg-danger`  | `--bui-fg-negative`     |
| `--bui-fg-success` | `--bui-fg-positive`     |
| `--bui-fg-info`    | `--bui-fg-announcement` |

### Accent

| Deprecated                | Replacement                |
| ------------------------- | -------------------------- |
| `--bui-bg-solid`          | `--bui-accent-bg`          |
| `--bui-bg-solid-hover`    | `--bui-accent-bg-hover`    |
| `--bui-bg-solid-disabled` | `--bui-accent-bg-disabled` |
| `--bui-fg-solid`          | `--bui-accent-fg`          |
| `--bui-fg-solid-disabled` | `--bui-accent-fg-disabled` |

### Positive

| Deprecated               | Replacement                 |
| ------------------------ | --------------------------- |
| `--bui-bg-success`       | `--bui-positive-bg-subdued` |
| `--bui-fg-success-on-bg` | `--bui-positive-fg-subdued` |
| `--bui-border-success`   | `--bui-positive-border`     |

### Negative

| Deprecated              | Replacement                 |
| ----------------------- | --------------------------- |
| `--bui-bg-danger`       | `--bui-negative-bg-subdued` |
| `--bui-fg-danger-on-bg` | `--bui-negative-fg-subdued` |
| `--bui-border-danger`   | `--bui-negative-border`     |

### Warning

| Deprecated               | Replacement                |
| ------------------------ | -------------------------- |
| `--bui-bg-warning`       | `--bui-warning-bg-subdued` |
| `--bui-fg-warning-on-bg` | `--bui-warning-fg-subdued` |
| `--bui-border-warning`   | `--bui-warning-border`     |

### Announcement

| Deprecated            | Replacement                     |
| --------------------- | ------------------------------- |
| `--bui-bg-info`       | `--bui-announcement-bg-subdued` |
| `--bui-fg-info-on-bg` | `--bui-announcement-fg-subdued` |
| `--bui-border-info`   | `--bui-announcement-border`     |
