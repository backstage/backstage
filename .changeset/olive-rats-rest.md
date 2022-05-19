---
'@backstage/create-app': patch
---

Accessibility updates:

- Added `aria-label` to the sidebar Logo link. To enable this for an existing app, please make the following changes:

`packages/app/src/components/Root/Root.tsx`

```diff
const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useContext(SidebarContext);

  return (
    <div className={classes.root}>
      <Link
        component={NavLink}
        to="/"
        underline="none"
        className={classes.link}
+       aria-label="Home"
      >
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};
```
