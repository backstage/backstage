import{a5 as T,j as e}from"./iframe-CIdfBUNc.js";import{H as g}from"./HeaderPage-DklHR26Z.js";import{t as y}from"./index-BHOfiGUs.js";import{M as b}from"./index-6Q4r393t.js";import{B as f}from"./Button-BdmjygXj.js";import{M,a as j,b as C}from"./Menu-DQnQFGKa.js";import{B as R}from"./ButtonIcon-ComFy0XB.js";import{C as x}from"./Container-QfkkQvKE.js";import{T as t}from"./Text-fCVoI7lV.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-DpbhKiTz.js";import"./clsx-B-dksMZM.js";import"./Link-BpcnesLj.js";import"./isExternalLink-DzQTpl4p.js";import"./usePress-Caq6LyaY.js";import"./useFocusable-CPjX_ZwV.js";import"./useObjectRef-DgB1_A6b.js";import"./useLink-CXftnk8X.js";import"./Tabs-L628DWYI.js";import"./useListState-Cz7KwnIh.js";import"./useEvent-1jKoOzqm.js";import"./SelectionIndicator-DOD2f3eX.js";import"./context-DVadYFRF.js";import"./Hidden-nXB6U8Ip.js";import"./useControlledState-CeIJUDVt.js";import"./utils-Cjmj99xt.js";import"./useLabels-DApO1jR3.js";import"./useHasTabbableChild-BwPflv97.js";import"./useFocusRing-DlPxtRlU.js";import"./Button-Ba3dPinB.js";import"./Label-BUxvg70y.js";import"./useLabel-DJE6Cj25.js";import"./Button.module-gtToApuQ.js";import"./useSurface-Dd5zaFJi.js";import"./Dialog-DU_eiDEs.js";import"./ListBox-CK5nRji4.js";import"./RSPContexts-BprzaPX6.js";import"./Text-CYbs9Rda.js";import"./useLocalizedStringFormatter-D_8Tctws.js";import"./OverlayArrow-DR8yh5th.js";import"./VisuallyHidden-CWRgOWii.js";import"./Input-oT3MkX-h.js";import"./useFormReset-DfTTI6Xy.js";import"./Form-CwTGXXRj.js";import"./SearchField-4UTBJ9KR.js";import"./FieldError-Bik11OU1.js";const n=T.meta({title:"Backstage UI/HeaderPage",component:g,parameters:{layout:"fullscreen"}}),v=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],w=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],d=r=>e.jsx(b,{children:e.jsx(r,{})}),L=[r=>e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{width:"250px",position:"fixed",left:"var(--sb-panel-left)",top:"var(--sb-panel-top)",bottom:"var(--sb-panel-bottom)",backgroundColor:"var(--sb-sidebar-bg)",borderRadius:"var(--sb-panel-radius)",border:"var(--sb-sidebar-border)",borderRight:"var(--sb-sidebar-border-right)",zIndex:1}}),e.jsxs("div",{style:{paddingLeft:"var(--sb-content-padding-inline)",minHeight:"200vh"},children:[e.jsx(r,{}),e.jsx(x,{children:e.jsx(t,{children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."})})]})]})],s=n.story({args:{title:"Page Title"}}),o=n.story({args:{...s.input.args,tabs:v},decorators:[d]}),i=n.story({decorators:[d],render:()=>e.jsx(g,{...s.input.args,customActions:e.jsxs(e.Fragment,{children:[e.jsx(f,{children:"Custom action"}),e.jsxs(M,{children:[e.jsx(R,{variant:"tertiary",icon:e.jsx(y,{}),"aria-label":"More options"}),e.jsx(j,{placement:"bottom end",children:w.map(r=>e.jsx(C,{onAction:r.onClick,href:r.href,children:r.label},r.value))})]})]})})}),c=n.story({decorators:[d],args:{...s.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=n.story({decorators:[d],args:{...s.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),a=n.story({decorators:[d],render:()=>e.jsx(g,{...s.input.args,tabs:v,customActions:e.jsx(f,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]})}),p=a.extend({decorators:[...L]}),u=n.story({args:{title:"Route Matching Demo",tabs:[{id:"home",label:"Home",href:"/home"},{id:"mentorship",label:"Mentorship",href:"/mentorship",matchStrategy:"prefix"},{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"settings",label:"Settings",href:"/settings"}]},render:r=>e.jsxs(b,{initialEntries:["/mentorship/events"],children:[e.jsx(g,{...r}),e.jsxs(x,{children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsxs(t,{children:[`Notice how the "Mentorship" tab is active even though we're on a nested route. This is because it uses`," ",e.jsx("code",{children:'matchStrategy="prefix"'}),"."]}),e.jsx("br",{}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Home"}),": exact matching (default) - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Mentorship"}),": prefix matching - IS active (URL starts with /mentorship)"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Catalog"}),": prefix matching - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Settings"}),": exact matching (default) - not active"]})]})]})}),h=n.story({args:{title:"Exact Matching Demo",tabs:[{id:"mentorship",label:"Mentorship",href:"/mentorship"},{id:"events",label:"Events",href:"/mentorship/events"},{id:"mentors",label:"Mentors",href:"/mentorship/mentors"}]},render:r=>e.jsxs(b,{initialEntries:["/mentorship/events"],children:[e.jsx(g,{...r}),e.jsxs(x,{children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsx(t,{children:'With default exact matching, only the "Events" tab is active because it exactly matches the current URL. The "Mentorship" tab is not active even though the URL is under /mentorship.'})]})]})}),l=n.story({args:{title:"Deep Nesting Demo",tabs:[{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"users",label:"Users",href:"/catalog/users",matchStrategy:"prefix"},{id:"components",label:"Components",href:"/catalog/components",matchStrategy:"prefix"}]},render:r=>e.jsxs(b,{initialEntries:["/catalog/users/john/details"],children:[e.jsx(g,{...r}),e.jsxs(x,{children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /catalog/users/john/details"]}),e.jsx("br",{}),e.jsx(t,{children:'Both "Catalog" and "Users" tabs are active because:'}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Catalog"}),": URL starts with /catalog"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Users"}),": URL starts with /catalog/users"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Components"}),": not active (URL doesn't start with /catalog/components)"]}),e.jsx("br",{}),e.jsx(t,{children:"This demonstrates how prefix matching works with deeply nested routes."})]})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => <HeaderPage title="Page Title" />;
`,...s.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const WithTabs = () => <HeaderPage tabs={tabs} />;
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
`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const WithTabsMatchingStrategies = () => (
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
`,...u.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const WithTabsExactMatching = () => (
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
`,...h.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const WithTabsPrefixMatchingDeep = () => (
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
      <Text>
        <strong>Current URL:</strong>/catalog/users/john/details
      </Text>
      <br />
      <Text>Both "Catalog" and "Users" tabs are active because:</Text>
      <Text>
        • <strong>Catalog</strong>: URL starts with /catalog
      </Text>
      <Text>
        • <strong>Users</strong>: URL starts with /catalog/users
      </Text>
      <Text>
        • <strong>Components</strong>: not active (URL doesn't start with
        /catalog/components)
      </Text>
      <br />
      <Text>
        This demonstrates how prefix matching works with deeply nested routes.
      </Text>
    </Container>
  </MemoryRouter>
);
`,...l.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Page Title'
  }
})`,...s.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...p.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...h.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
        <Text>
          <strong>Current URL:</strong> /catalog/users/john/details
        </Text>
        <br />
        <Text>Both "Catalog" and "Users" tabs are active because:</Text>
        <Text>
          • <strong>Catalog</strong>: URL starts with /catalog
        </Text>
        <Text>
          • <strong>Users</strong>: URL starts with /catalog/users
        </Text>
        <Text>
          • <strong>Components</strong>: not active (URL doesn't start with
          /catalog/components)
        </Text>
        <br />
        <Text>
          This demonstrates how prefix matching works with deeply nested routes.
        </Text>
      </Container>
    </MemoryRouter>
})`,...l.input.parameters?.docs?.source}}};const Te=["Default","WithTabs","WithCustomActions","WithBreadcrumbs","WithLongBreadcrumbs","WithEverything","WithLayout","WithTabsMatchingStrategies","WithTabsExactMatching","WithTabsPrefixMatchingDeep"];export{s as Default,c as WithBreadcrumbs,i as WithCustomActions,a as WithEverything,p as WithLayout,m as WithLongBreadcrumbs,o as WithTabs,h as WithTabsExactMatching,u as WithTabsMatchingStrategies,l as WithTabsPrefixMatchingDeep,Te as __namedExportsOrder};
