import{p as T,j as e}from"./iframe-DLcIH_b-.js";import{H as g}from"./HeaderPage-CEqx4-Wz.js";import{t as y}from"./index-U1-yfkib.js";import{M as b}from"./index-DTUFdyDi.js";import{B as f}from"./Button-DpzfE-iS.js";import{M,a as j,b as C}from"./Menu-CReYGmHY.js";import{B as R}from"./ButtonIcon-COT0r4-N.js";import{C as x}from"./Container-B3napqBi.js";import{T as s}from"./Text-DtkDoMXD.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-ghcsv-kN.js";import"./clsx-B-dksMZM.js";import"./Link-8loHDJR2.js";import"./InternalLinkProvider-DTqKA_DL.js";import"./useFocusable-COLPdtNP.js";import"./useObjectRef-BNxyJtDQ.js";import"./useLink-D74QZJWJ.js";import"./usePress-D5-QKxyp.js";import"./Tabs-Dinjq_3R.js";import"./utils-6XH3t80_.js";import"./SelectionManager-CAqsTtDS.js";import"./useEvent-B9-ZNUbE.js";import"./SelectionIndicator-05L8P_4u.js";import"./context-BCnjLdcH.js";import"./Hidden-Dbl1_rAo.js";import"./useControlledState-CsKdprzK.js";import"./useListState-DgJMhDvI.js";import"./animation-CQnzXyLO.js";import"./useLabels-B02BkAZQ.js";import"./useHasTabbableChild-Cp56NaR1.js";import"./useFocusRing-DvQ-zwm3.js";import"./Button-NjJOiD_d.js";import"./Label-DvVHWj6N.js";import"./useLabel-CLOn0dAa.js";import"./useButton-U8aef3G_.js";import"./defineComponent-CSx6JnkK.js";import"./useSurface-8rFU95IU.js";import"./Autocomplete-XwjWtcna.js";import"./Separator-CUtT3ogn.js";import"./RSPContexts-B1ipuEOv.js";import"./useLocalizedStringFormatter-BJZighW_.js";import"./Input-BsyyZJEF.js";import"./useFormReset-CAoZESJp.js";import"./useField-Cqa7VFXm.js";import"./Form-BdKdD9Pl.js";import"./ListBox-B3KLZYeQ.js";import"./Text-DbHFd58E.js";import"./Dialog-BYAmfeP1.js";import"./OverlayArrow-JxZOf1ot.js";import"./VisuallyHidden-D1d8cPyY.js";import"./SearchField-zWZ91Y54.js";import"./FieldError-BWP6sF06.js";const n=T.meta({title:"Backstage UI/HeaderPage",component:g,parameters:{layout:"fullscreen"}}),v=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],w=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],d=t=>e.jsx(b,{children:e.jsx(t,{})}),L=[t=>e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{width:"250px",position:"fixed",left:"var(--sb-panel-left)",top:"var(--sb-panel-top)",bottom:"var(--sb-panel-bottom)",backgroundColor:"var(--sb-sidebar-bg)",borderRadius:"var(--sb-panel-radius)",border:"var(--sb-sidebar-border)",borderRight:"var(--sb-sidebar-border-right)",zIndex:1}}),e.jsxs("div",{style:{paddingLeft:"var(--sb-content-padding-inline)",minHeight:"200vh"},children:[e.jsx(t,{}),e.jsx(x,{children:e.jsx(s,{children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."})})]})]})],r=n.story({args:{title:"Page Title"}}),o=n.story({args:{...r.input.args,tabs:v},decorators:[d]}),i=n.story({decorators:[d],render:()=>e.jsx(g,{...r.input.args,customActions:e.jsxs(e.Fragment,{children:[e.jsx(f,{children:"Custom action"}),e.jsxs(M,{children:[e.jsx(R,{variant:"tertiary",icon:e.jsx(y,{}),"aria-label":"More options"}),e.jsx(j,{placement:"bottom end",children:w.map(t=>e.jsx(C,{onAction:t.onClick,href:t.href,children:t.label},t.value))})]})]})})}),c=n.story({decorators:[d],args:{...r.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=n.story({decorators:[d],args:{...r.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),a=n.story({decorators:[d],render:()=>e.jsx(g,{...r.input.args,tabs:v,customActions:e.jsx(f,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]})}),p=a.extend({decorators:[...L]}),l=n.story({args:{title:"Route Matching Demo",tabs:[{id:"home",label:"Home",href:"/home"},{id:"mentorship",label:"Mentorship",href:"/mentorship",matchStrategy:"prefix"},{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"settings",label:"Settings",href:"/settings"}]},render:t=>e.jsxs(b,{initialEntries:["/mentorship/events"],children:[e.jsx(g,{...t}),e.jsxs(x,{children:[e.jsxs(s,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsxs(s,{children:[`Notice how the "Mentorship" tab is active even though we're on a nested route. This is because it uses`," ",e.jsx("code",{children:'matchStrategy="prefix"'}),"."]}),e.jsx("br",{}),e.jsxs(s,{children:["• ",e.jsx("strong",{children:"Home"}),": exact matching (default) - not active"]}),e.jsxs(s,{children:["• ",e.jsx("strong",{children:"Mentorship"}),": prefix matching - IS active (URL starts with /mentorship)"]}),e.jsxs(s,{children:["• ",e.jsx("strong",{children:"Catalog"}),": prefix matching - not active"]}),e.jsxs(s,{children:["• ",e.jsx("strong",{children:"Settings"}),": exact matching (default) - not active"]})]})]})}),u=n.story({args:{title:"Exact Matching Demo",tabs:[{id:"mentorship",label:"Mentorship",href:"/mentorship"},{id:"events",label:"Events",href:"/mentorship/events"},{id:"mentors",label:"Mentors",href:"/mentorship/mentors"}]},render:t=>e.jsxs(b,{initialEntries:["/mentorship/events"],children:[e.jsx(g,{...t}),e.jsxs(x,{children:[e.jsxs(s,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsx(s,{children:'With default exact matching, only the "Events" tab is active because it exactly matches the current URL. The "Mentorship" tab is not active even though the URL is under /mentorship.'})]})]})}),h=n.story({args:{title:"Deep Nesting Demo",tabs:[{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"users",label:"Users",href:"/catalog/users",matchStrategy:"prefix"},{id:"components",label:"Components",href:"/catalog/components",matchStrategy:"prefix"}]},render:t=>e.jsxs(b,{initialEntries:["/catalog/users/john/details"],children:[e.jsx(g,{...t}),e.jsxs(x,{children:[e.jsxs(s,{as:"p",children:[e.jsx("strong",{children:"Current URL:"})," /catalog/users/john/details"]}),e.jsx("br",{}),e.jsxs(s,{as:"p",children:["Active tab is ",e.jsx("strong",{children:"Users"})," because:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Catalog"}),": Matches since URL starts with /catalog"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Users"}),': Is active since URL starts with /catalog/users, and is more specific (has more url segments) than "Catalog"']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Components"}),": not active (URL doesn't start with /catalog/components)"]})]}),e.jsx(s,{as:"p",children:"This demonstrates how prefix matching works with deeply nested routes."})]})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Default = () => <HeaderPage title="Page Title" />;
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
