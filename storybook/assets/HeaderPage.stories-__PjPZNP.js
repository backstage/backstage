import{a5 as T,j as e}from"./iframe-DEXNC9RX.js";import{H as g}from"./HeaderPage-Jo5G6-Z9.js";import{t as y}from"./index-BdXQ8KNR.js";import{M as b}from"./index-BlCxWptt.js";import{B as f}from"./Button-D5chsfEf.js";import{M,a as j,b as C}from"./Menu-Y9lmWBZp.js";import{B as R}from"./ButtonIcon-CMRM3Sox.js";import{C as x}from"./Container-DVTBW00t.js";import{T as s}from"./Text-BYDBMmGU.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-D-F9OntJ.js";import"./clsx-B-dksMZM.js";import"./Link-CyU_eiJH.js";import"./InternalLinkProvider-CkD8gRmm.js";import"./useFocusable-DbzfLgOG.js";import"./useObjectRef-o4sY1jkT.js";import"./useLink-tIVM0kGT.js";import"./usePress-BUDeIQXb.js";import"./Tabs-Qxdd_9nY.js";import"./utils-D2s8_aAJ.js";import"./SelectionManager-C-Gpw_5f.js";import"./useEvent-xbwRE03h.js";import"./SelectionIndicator-Cc34cNWG.js";import"./context-tSwZuYBl.js";import"./Hidden-BGcqtIUS.js";import"./useControlledState-BUiXvEtE.js";import"./useListState-7FDQESHT.js";import"./animation-C2XlIh5r.js";import"./useLabels-DPWYYtq_.js";import"./useHasTabbableChild-DAG_JxLa.js";import"./useFocusRing-GcFdPQvN.js";import"./Button-BvnngkZL.js";import"./Label-DyK2mE5k.js";import"./useLabel-B7_zZ6f1.js";import"./useButton-DZ8FMGK4.js";import"./defineComponent-DZFTZYi_.js";import"./useSurface-DSizYiYz.js";import"./Autocomplete-JUQ6TLit.js";import"./Separator-B6MmcLUi.js";import"./RSPContexts-DYYvVR2Y.js";import"./useLocalizedStringFormatter-BEEZyCP0.js";import"./Input-Dbs8GzJm.js";import"./useFormReset-Ch9Eqjq3.js";import"./useField-DeqFlfeq.js";import"./Form-Bixq8z0J.js";import"./ListBox-CJ-y5pOO.js";import"./Text-BAfIv-RV.js";import"./Dialog-Cjd5Wv_y.js";import"./OverlayArrow-BzArDlUv.js";import"./VisuallyHidden-CZl8X4Nx.js";import"./SearchField-Ba6Pfioe.js";import"./FieldError-DqX39up2.js";const n=T.meta({title:"Backstage UI/HeaderPage",component:g,parameters:{layout:"fullscreen"}}),v=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],w=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],d=t=>e.jsx(b,{children:e.jsx(t,{})}),L=[t=>e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{width:"250px",position:"fixed",left:"var(--sb-panel-left)",top:"var(--sb-panel-top)",bottom:"var(--sb-panel-bottom)",backgroundColor:"var(--sb-sidebar-bg)",borderRadius:"var(--sb-panel-radius)",border:"var(--sb-sidebar-border)",borderRight:"var(--sb-sidebar-border-right)",zIndex:1}}),e.jsxs("div",{style:{paddingLeft:"var(--sb-content-padding-inline)",minHeight:"200vh"},children:[e.jsx(t,{}),e.jsx(x,{children:e.jsx(s,{children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."})})]})]})],r=n.story({args:{title:"Page Title"}}),o=n.story({args:{...r.input.args,tabs:v},decorators:[d]}),i=n.story({decorators:[d],render:()=>e.jsx(g,{...r.input.args,customActions:e.jsxs(e.Fragment,{children:[e.jsx(f,{children:"Custom action"}),e.jsxs(M,{children:[e.jsx(R,{variant:"tertiary",icon:e.jsx(y,{}),"aria-label":"More options"}),e.jsx(j,{placement:"bottom end",children:w.map(t=>e.jsx(C,{onAction:t.onClick,href:t.href,children:t.label},t.value))})]})]})})}),c=n.story({decorators:[d],args:{...r.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=n.story({decorators:[d],args:{...r.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),a=n.story({decorators:[d],render:()=>e.jsx(g,{...r.input.args,tabs:v,customActions:e.jsx(f,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]})}),p=a.extend({decorators:[...L]}),l=n.story({args:{title:"Route Matching Demo",tabs:[{id:"home",label:"Home",href:"/home"},{id:"mentorship",label:"Mentorship",href:"/mentorship",matchStrategy:"prefix"},{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"settings",label:"Settings",href:"/settings"}]},render:t=>e.jsxs(b,{initialEntries:["/mentorship/events"],children:[e.jsx(g,{...t}),e.jsxs(x,{children:[e.jsxs(s,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsxs(s,{children:[`Notice how the "Mentorship" tab is active even though we're on a nested route. This is because it uses`," ",e.jsx("code",{children:'matchStrategy="prefix"'}),"."]}),e.jsx("br",{}),e.jsxs(s,{children:["• ",e.jsx("strong",{children:"Home"}),": exact matching (default) - not active"]}),e.jsxs(s,{children:["• ",e.jsx("strong",{children:"Mentorship"}),": prefix matching - IS active (URL starts with /mentorship)"]}),e.jsxs(s,{children:["• ",e.jsx("strong",{children:"Catalog"}),": prefix matching - not active"]}),e.jsxs(s,{children:["• ",e.jsx("strong",{children:"Settings"}),": exact matching (default) - not active"]})]})]})}),u=n.story({args:{title:"Exact Matching Demo",tabs:[{id:"mentorship",label:"Mentorship",href:"/mentorship"},{id:"events",label:"Events",href:"/mentorship/events"},{id:"mentors",label:"Mentors",href:"/mentorship/mentors"}]},render:t=>e.jsxs(b,{initialEntries:["/mentorship/events"],children:[e.jsx(g,{...t}),e.jsxs(x,{children:[e.jsxs(s,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsx(s,{children:'With default exact matching, only the "Events" tab is active because it exactly matches the current URL. The "Mentorship" tab is not active even though the URL is under /mentorship.'})]})]})}),h=n.story({args:{title:"Deep Nesting Demo",tabs:[{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"users",label:"Users",href:"/catalog/users",matchStrategy:"prefix"},{id:"components",label:"Components",href:"/catalog/components",matchStrategy:"prefix"}]},render:t=>e.jsxs(b,{initialEntries:["/catalog/users/john/details"],children:[e.jsx(g,{...t}),e.jsxs(x,{children:[e.jsxs(s,{as:"p",children:[e.jsx("strong",{children:"Current URL:"})," /catalog/users/john/details"]}),e.jsx("br",{}),e.jsxs(s,{as:"p",children:["Active tab is ",e.jsx("strong",{children:"Users"})," because:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Catalog"}),": Matches since URL starts with /catalog"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Users"}),': Is active since URL starts with /catalog/users, and is more specific (has more url segments) than "Catalog"']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Components"}),": not active (URL doesn't start with /catalog/components)"]})]}),e.jsx(s,{as:"p",children:"This demonstrates how prefix matching works with deeply nested routes."})]})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Default = () => <HeaderPage title="Page Title" />;
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
