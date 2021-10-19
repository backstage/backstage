---
'@backstage/core-components': minor
---

I add optional props with action, subject, value, and attributes for override onClick event props

```
<Link
    to="/test"
    onClick={customOnClick}
    options={{
        action: 'custom:click',
        subject: 'custom:subject',
        value: 123,
        attributes: { to: '/custom_link' },
    }}
>
    {linkText}
</Link>
```
