import{p as T,j as e}from"./iframe-Dc6SVWG5.js";import{H as g}from"./HeaderPage-BFPh9JmG.js";import{t as y}from"./index-BWnIyO3Z.js";import{M as b}from"./index-8XuG-gel.js";import{B as f}from"./Button-Dv0Y71En.js";import{M,a as j,b as C}from"./Menu-D-16y3qz.js";import{B as R}from"./ButtonIcon-CguJjZcb.js";import{C as x}from"./Container-DfeRwNpu.js";import{T as s}from"./Text-gCGmpf2i.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-CL_MDcHO.js";import"./clsx-B-dksMZM.js";import"./Link-aR0MuyNQ.js";import"./InternalLinkProvider-D290ZhhU.js";import"./useFocusable-LM1L35XX.js";import"./useObjectRef-Biw-Bebg.js";import"./useLink-CWEcYp0a.js";import"./usePress-BxWfv09F.js";import"./Tabs-BKCkrjRA.js";import"./utils-CkvIxLd7.js";import"./SelectionManager-C6ZldRxO.js";import"./useEvent-Bz0TdNaU.js";import"./SelectionIndicator-C_VU39Wd.js";import"./context-cuGJULiq.js";import"./Hidden-C38r4S5D.js";import"./useControlledState-HfwHR9sg.js";import"./useListState-B8deYco5.js";import"./animation-BizhCcua.js";import"./useLabels-BR2mQG65.js";import"./useHasTabbableChild-BxQzay4D.js";import"./useFocusRing-Dku9y1ia.js";import"./Button-BS0Br5HO.js";import"./Label-6Y_Zl-EN.js";import"./useLabel-De6ceFch.js";import"./useButton-DrqSWZx0.js";import"./defineComponent-CN_4ZuAm.js";import"./useSurface-D9qox8Zh.js";import"./Autocomplete-Di_VeME2.js";import"./Separator-BVgsqqXp.js";import"./RSPContexts-B0LI4DaB.js";import"./useLocalizedStringFormatter-BOaSdzIm.js";import"./Input-CUEHesyF.js";import"./useFormReset-DyDw8nQm.js";import"./useField-K1Nz90yQ.js";import"./Form-wP8UYMOg.js";import"./ListBox-CA9zVciq.js";import"./Text-CHyfrd5F.js";import"./Dialog-de_JxtvN.js";import"./OverlayArrow-B4RV6xUL.js";import"./VisuallyHidden-CtukbqzC.js";import"./SearchField-BTuZeSfK.js";import"./FieldError-yXGS4-gg.js";const n=T.meta({title:"Backstage UI/HeaderPage",component:g,parameters:{layout:"fullscreen"}}),v=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],w=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],d=t=>e.jsx(b,{children:e.jsx(t,{})}),L=[t=>e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{width:"250px",position:"fixed",left:"var(--sb-panel-left)",top:"var(--sb-panel-top)",bottom:"var(--sb-panel-bottom)",backgroundColor:"var(--sb-sidebar-bg)",borderRadius:"var(--sb-panel-radius)",border:"var(--sb-sidebar-border)",borderRight:"var(--sb-sidebar-border-right)",zIndex:1}}),e.jsxs("div",{style:{paddingLeft:"var(--sb-content-padding-inline)",minHeight:"200vh"},children:[e.jsx(t,{}),e.jsx(x,{children:e.jsx(s,{children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."})})]})]})],r=n.story({args:{title:"Page Title"}}),o=n.story({args:{...r.input.args,tabs:v},decorators:[d]}),i=n.story({decorators:[d],render:()=>e.jsx(g,{...r.input.args,customActions:e.jsxs(e.Fragment,{children:[e.jsx(f,{children:"Custom action"}),e.jsxs(M,{children:[e.jsx(R,{variant:"tertiary",icon:e.jsx(y,{}),"aria-label":"More options"}),e.jsx(j,{placement:"bottom end",children:w.map(t=>e.jsx(C,{onAction:t.onClick,href:t.href,children:t.label},t.value))})]})]})})}),c=n.story({decorators:[d],args:{...r.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=n.story({decorators:[d],args:{...r.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),a=n.story({decorators:[d],render:()=>e.jsx(g,{...r.input.args,tabs:v,customActions:e.jsx(f,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]})}),p=a.extend({decorators:[...L]}),l=n.story({args:{title:"Route Matching Demo",tabs:[{id:"home",label:"Home",href:"/home"},{id:"mentorship",label:"Mentorship",href:"/mentorship",matchStrategy:"prefix"},{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"settings",label:"Settings",href:"/settings"}]},render:t=>e.jsxs(b,{initialEntries:["/mentorship/events"],children:[e.jsx(g,{...t}),e.jsxs(x,{children:[e.jsxs(s,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsxs(s,{children:[`Notice how the "Mentorship" tab is active even though we're on a nested route. This is because it uses`," ",e.jsx("code",{children:'matchStrategy="prefix"'}),"."]}),e.jsx("br",{}),e.jsxs(s,{children:["• ",e.jsx("strong",{children:"Home"}),": exact matching (default) - not active"]}),e.jsxs(s,{children:["• ",e.jsx("strong",{children:"Mentorship"}),": prefix matching - IS active (URL starts with /mentorship)"]}),e.jsxs(s,{children:["• ",e.jsx("strong",{children:"Catalog"}),": prefix matching - not active"]}),e.jsxs(s,{children:["• ",e.jsx("strong",{children:"Settings"}),": exact matching (default) - not active"]})]})]})}),u=n.story({args:{title:"Exact Matching Demo",tabs:[{id:"mentorship",label:"Mentorship",href:"/mentorship"},{id:"events",label:"Events",href:"/mentorship/events"},{id:"mentors",label:"Mentors",href:"/mentorship/mentors"}]},render:t=>e.jsxs(b,{initialEntries:["/mentorship/events"],children:[e.jsx(g,{...t}),e.jsxs(x,{children:[e.jsxs(s,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsx(s,{children:'With default exact matching, only the "Events" tab is active because it exactly matches the current URL. The "Mentorship" tab is not active even though the URL is under /mentorship.'})]})]})}),h=n.story({args:{title:"Deep Nesting Demo",tabs:[{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"users",label:"Users",href:"/catalog/users",matchStrategy:"prefix"},{id:"components",label:"Components",href:"/catalog/components",matchStrategy:"prefix"}]},render:t=>e.jsxs(b,{initialEntries:["/catalog/users/john/details"],children:[e.jsx(g,{...t}),e.jsxs(x,{children:[e.jsxs(s,{as:"p",children:[e.jsx("strong",{children:"Current URL:"})," /catalog/users/john/details"]}),e.jsx("br",{}),e.jsxs(s,{as:"p",children:["Active tab is ",e.jsx("strong",{children:"Users"})," because:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Catalog"}),": Matches since URL starts with /catalog"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Users"}),': Is active since URL starts with /catalog/users, and is more specific (has more url segments) than "Catalog"']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Components"}),": not active (URL doesn't start with /catalog/components)"]})]}),e.jsx(s,{as:"p",children:"This demonstrates how prefix matching works with deeply nested routes."})]})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Default = () => <HeaderPage title="Page Title" />;
`,...r.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const WithTabs = () => <HeaderPage tabs={tabs} />;
`,...o.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const WithCustomActions = () => (
  <HeaderPage
    {...Default.input.args}
    customActions={
      <>
        <Button>Custom action</Button>
        <MenuTrigger>
          <ButtonIcon
            variant="tertiary"
            icon={<RiMore2Line />}
            aria-label="More options"
          />
          <Menu placement="bottom end">
            {menuItems.map((option) => (
              <MenuItem
                key={option.value}
                onAction={option.onClick}
                href={option.href}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </MenuTrigger>
      </>
    }
  />
);
`,...i.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const WithBreadcrumbs = () => (
  <HeaderPage breadcrumbs={[{ label: "Home", href: "/" }]} />
);
`,...c.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const WithLongBreadcrumbs = () => (
  <HeaderPage
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Long Breadcrumb Name", href: "/long-breadcrumb" },
    ]}
  />
);
`,...m.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const WithEverything = () => (
  <HeaderPage
    {...Default.input.args}
    tabs={tabs}
    customActions={<Button>Custom action</Button>}
    breadcrumbs={[{ label: "Home", href: "/" }]}
  />
);
`,...a.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const WithLayout = () => <HeaderPage />;
`,...p.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const WithTabsMatchingStrategies = () => (
  <MemoryRouter initialEntries={["/mentorship/events"]}>
    <HeaderPage
      title="Route Matching Demo"
      tabs={[
        {
          id: "home",
          label: "Home",
          href: "/home",
        },
        {
          id: "mentorship",
          label: "Mentorship",
          href: "/mentorship",
          matchStrategy: "prefix",
        },
        {
          id: "catalog",
          label: "Catalog",
          href: "/catalog",
          matchStrategy: "prefix",
        },
        {
          id: "settings",
          label: "Settings",
          href: "/settings",
        },
      ]}
    />
    <Container>
      <Text>
        <strong>Current URL:</strong>/mentorship/events
      </Text>
      <br />
      <Text>
        Notice how the "Mentorship" tab is active even though we're on a nested
        route. This is because it uses <code>matchStrategy="prefix"</code>.
      </Text>
      <br />
      <Text>
        • <strong>Home</strong>: exact matching (default) - not active
      </Text>
      <Text>
        • <strong>Mentorship</strong>: prefix matching - IS active (URL starts
        with /mentorship)
      </Text>
      <Text>
        • <strong>Catalog</strong>: prefix matching - not active
      </Text>
      <Text>
        • <strong>Settings</strong>: exact matching (default) - not active
      </Text>
    </Container>
  </MemoryRouter>
);
`,...l.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const WithTabsExactMatching = () => (
  <MemoryRouter initialEntries={["/mentorship/events"]}>
    <HeaderPage
      title="Exact Matching Demo"
      tabs={[
        {
          id: "mentorship",
          label: "Mentorship",
          href: "/mentorship",
        },
        {
          id: "events",
          label: "Events",
          href: "/mentorship/events",
        },
        {
          id: "mentors",
          label: "Mentors",
          href: "/mentorship/mentors",
        },
      ]}
    />
    <Container>
      <Text>
        <strong>Current URL:</strong>/mentorship/events
      </Text>
      <br />
      <Text>
        With default exact matching, only the "Events" tab is active because it
        exactly matches the current URL. The "Mentorship" tab is not active even
        though the URL is under /mentorship.
      </Text>
    </Container>
  </MemoryRouter>
);
`,...u.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const WithTabsPrefixMatchingDeep = () => (
  <MemoryRouter initialEntries={["/catalog/users/john/details"]}>
    <HeaderPage
      title="Deep Nesting Demo"
      tabs={[
        {
          id: "catalog",
          label: "Catalog",
          href: "/catalog",
          matchStrategy: "prefix",
        },
        {
          id: "users",
          label: "Users",
          href: "/catalog/users",
          matchStrategy: "prefix",
        },
        {
          id: "components",
          label: "Components",
          href: "/catalog/components",
          matchStrategy: "prefix",
        },
      ]}
    />
    <Container>
      <Text as="p">
        <strong>Current URL:</strong>/catalog/users/john/details
      </Text>
      <br />
      <Text as="p">
        Active tab is <strong>Users</strong>because:
      </Text>
      <ul>
        <li>
          <strong>Catalog</strong>: Matches since URL starts with /catalog
        </li>
        <li>
          <strong>Users</strong>: Is active since URL starts with
          /catalog/users, and is more specific (has more url segments) than
          "Catalog"
        </li>
        <li>
          <strong>Components</strong>: not active (URL doesn't start with
          /catalog/components)
        </li>
      </ul>
      <Text as="p">
        This demonstrates how prefix matching works with deeply nested routes.
      </Text>
    </Container>
  </MemoryRouter>
);
`,...h.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Page Title'
  }
})`,...r.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    tabs
  },
  decorators: [withRouter]
})`,...o.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <HeaderPage {...Default.input.args} customActions={<>
          <Button>Custom action</Button>
          <MenuTrigger>
            <ButtonIcon variant="tertiary" icon={<RiMore2Line />} aria-label="More options" />
            <Menu placement="bottom end">
              {menuItems.map(option => <MenuItem key={option.value} onAction={option.onClick} href={option.href}>
                  {option.label}
                </MenuItem>)}
            </Menu>
          </MenuTrigger>
        </>} />
})`,...i.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }]
  }
})`,...c.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Long Breadcrumb Name',
      href: '/long-breadcrumb'
    }]
  }
})`,...m.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <HeaderPage {...Default.input.args} tabs={tabs} customActions={<Button>Custom action</Button>} breadcrumbs={[{
    label: 'Home',
    href: '/'
  }]} />
})`,...a.input.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`WithEverything.extend({
  decorators: [...layoutDecorator]
})`,...p.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Route Matching Demo',
    tabs: [{
      id: 'home',
      label: 'Home',
      href: '/home'
    }, {
      id: 'mentorship',
      label: 'Mentorship',
      href: '/mentorship',
      matchStrategy: 'prefix'
    }, {
      id: 'catalog',
      label: 'Catalog',
      href: '/catalog',
      matchStrategy: 'prefix'
    }, {
      id: 'settings',
      label: 'Settings',
      href: '/settings'
    }]
  },
  render: args => <MemoryRouter initialEntries={['/mentorship/events']}>
      <HeaderPage {...args} />
      <Container>
        <Text>
          <strong>Current URL:</strong> /mentorship/events
        </Text>
        <br />
        <Text>
          Notice how the "Mentorship" tab is active even though we're on a
          nested route. This is because it uses{' '}
          <code>matchStrategy="prefix"</code>.
        </Text>
        <br />
        <Text>
          • <strong>Home</strong>: exact matching (default) - not active
        </Text>
        <Text>
          • <strong>Mentorship</strong>: prefix matching - IS active (URL starts
          with /mentorship)
        </Text>
        <Text>
          • <strong>Catalog</strong>: prefix matching - not active
        </Text>
        <Text>
          • <strong>Settings</strong>: exact matching (default) - not active
        </Text>
      </Container>
    </MemoryRouter>
})`,...l.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Exact Matching Demo',
    tabs: [{
      id: 'mentorship',
      label: 'Mentorship',
      href: '/mentorship'
    }, {
      id: 'events',
      label: 'Events',
      href: '/mentorship/events'
    }, {
      id: 'mentors',
      label: 'Mentors',
      href: '/mentorship/mentors'
    }]
  },
  render: args => <MemoryRouter initialEntries={['/mentorship/events']}>
      <HeaderPage {...args} />
      <Container>
        <Text>
          <strong>Current URL:</strong> /mentorship/events
        </Text>
        <br />
        <Text>
          With default exact matching, only the "Events" tab is active because
          it exactly matches the current URL. The "Mentorship" tab is not active
          even though the URL is under /mentorship.
        </Text>
      </Container>
    </MemoryRouter>
})`,...u.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Deep Nesting Demo',
    tabs: [{
      id: 'catalog',
      label: 'Catalog',
      href: '/catalog',
      matchStrategy: 'prefix'
    }, {
      id: 'users',
      label: 'Users',
      href: '/catalog/users',
      matchStrategy: 'prefix'
    }, {
      id: 'components',
      label: 'Components',
      href: '/catalog/components',
      matchStrategy: 'prefix'
    }]
  },
  render: args => <MemoryRouter initialEntries={['/catalog/users/john/details']}>
      <HeaderPage {...args} />
      <Container>
        <Text as="p">
          <strong>Current URL:</strong> /catalog/users/john/details
        </Text>
        <br />
        <Text as="p">
          Active tab is <strong>Users</strong> because:
        </Text>
        <ul>
          <li>
            <strong>Catalog</strong>: Matches since URL starts with /catalog
          </li>
          <li>
            <strong>Users</strong>: Is active since URL starts with
            /catalog/users, and is more specific (has more url segments) than
            "Catalog"
          </li>
          <li>
            <strong>Components</strong>: not active (URL doesn't start with
            /catalog/components)
          </li>
        </ul>
        <Text as="p">
          This demonstrates how prefix matching works with deeply nested routes.
        </Text>
      </Container>
    </MemoryRouter>
})`,...h.input.parameters?.docs?.source}}};const we=["Default","WithTabs","WithCustomActions","WithBreadcrumbs","WithLongBreadcrumbs","WithEverything","WithLayout","WithTabsMatchingStrategies","WithTabsExactMatching","WithTabsPrefixMatchingDeep"];export{r as Default,c as WithBreadcrumbs,i as WithCustomActions,a as WithEverything,p as WithLayout,m as WithLongBreadcrumbs,o as WithTabs,u as WithTabsExactMatching,l as WithTabsMatchingStrategies,h as WithTabsPrefixMatchingDeep,we as __namedExportsOrder};
