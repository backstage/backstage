---
'@backstage/ui': minor
---

**BREAKING**: Migrated Checkbox component from Base UI to React Aria Components.

API changes required:

- `checked` → `isSelected`
- `defaultChecked` → `defaultSelected`
- `disabled` → `isDisabled`
- `required` → `isRequired`
- `label` prop removed - use `children` instead
- CSS: `bui-CheckboxLabel` class removed
- Data attribute: `data-checked` → `data-selected`
- Use without label is no longer supported

Migration examples:

Before:

```tsx
<Checkbox label="Accept terms" checked={agreed} onChange={setAgreed} />
```

After:

```tsx
<Checkbox isSelected={agreed} onChange={setAgreed}>
  Accept terms
</Checkbox>
```

Before:

```tsx
<Checkbox label="Option" disabled />
```

After:

```tsx
<Checkbox isDisabled>Option</Checkbox>
```

Before:

```tsx
<Checkbox />
```

After:

```tsx
<Checkbox>
  <VisuallyHidden>Accessible label</VisuallyHidden>
</Checkbox>
```
