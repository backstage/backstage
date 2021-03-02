---
'@backstage/core': minor
'@backstage/plugin-pagerduty': patch
---

- Adds onClick and other props to IconLinkVertical;
- Allows TriggerButton component to render when pager duty key is missing;
- Refactors TriggerButton and PagerDutyCard not to have shared state;
- Removes the `action` prop of the IconLinkVertical component while adding `onClick`.

  Instead of having an action including a button with onClick, now the whole component can be clickable making it easier to implement and having a better UX.

  Before:

  ```ts
  const myLink: IconLinkVerticalProps = {
    label: 'Click me',
    action: <Button onClick={myAction} />,
    icon: <MyIcon onClick={myAction} />,
  };
  ```

  After:

  ```ts
  const myLink: IconLinkVerticalProps = {
    label: 'Click me',
    onClick: myAction,
    icon: <MyIcon />,
  };
  ```
