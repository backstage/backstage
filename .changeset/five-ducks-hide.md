---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: The `NavLogoBlueprint` has been removed and replaced by `NavContentBlueprint`, which instead replaces the entire navbar. The default navbar has also been switched to a more minimal implementation.

To use `NavContentBlueprint` to install new logos, you can use it as follows:

```tsx
NavContentBlueprint.make({
  params: {
    component: ({ items }) => {
      return compatWrapper(
        <Sidebar>
          <SidebarLogo />

          {/* Other sidebar content */}

          <SidebarScrollWrapper>
            {items.map((item, index) => (
              <SidebarItem {...item} key={index} />
            ))}
          </SidebarScrollWrapper>

          {/* Other sidebar content */}
        </Sidebar>,
      );
    },
  },
});
```
