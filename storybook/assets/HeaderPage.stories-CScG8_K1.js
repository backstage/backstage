import{j as e}from"./jsx-runtime-hv06LKfz.js";import{e as o}from"./TablePagination-UuIaJRQ_.js";import{B as f}from"./Button-Bf122Ew1.js";import{C as b}from"./Container-CsYEARq4.js";import{T as t}from"./Text-B-YcxuAG.js";import{M as x}from"./index-B7KODvs-.js";import"./index-D8-PC79C.js";import"./clsx-B-dksMZM.js";import"./provider-DntK2tr9.js";import"./useStyles-BSSAtcKC.js";import"./Box-bdFYA742.js";import"./spacing.props-m9PQeFPu.js";import"./Grid-DgCUMUxY.js";import"./Flex-Co3-3Y6W.js";import"./useBaseUiId-D_SK3tu4.js";import"./Collapsible-oCQaOc00.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./ScrollArea-ngUsS74r.js";import"./FieldLabel-DfCfC9HW.js";import"./Label-x6hg8m87.js";import"./utils-SVxEJA3c.js";import"./Hidden-Bl3CD3Sw.js";import"./Link-B4jsamBv.js";import"./useFocusRing-BDW1BQ1a.js";import"./usePress-CG1fvX6x.js";import"./ButtonIcon-BSgtwn5y.js";import"./Button-BVmmXt8z.js";import"./Tabs-C7OZlfRT.js";import"./Collection-CrXXjB02.js";import"./FocusScope-1Zfm8FiP.js";import"./context-C8UuisDZ.js";import"./useControlledState-hFzvQclK.js";import"./useLabels-CXdioV2U.js";import"./Link-DatNe69X.js";import"./ButtonLink-D-XuerfG.js";import"./RadioGroup-DJVJaaw3.js";import"./FieldError-DnfqdXMQ.js";import"./useFormReset-JKupIHyW.js";import"./VisuallyHidden-BQdEkh9J.js";import"./Select-CgIMwJnh.js";import"./OverlayArrow-CR591i--.js";import"./useLocalizedStringFormatter-Di64h_0G.js";import"./Switch-Bbj9mDjK.js";import"./TextField-CZ7wTdPc.js";import"./Input-FLKGWv3G.js";import"./TextField-Cu1PFB9q.js";import"./Tooltip-BVBepQan.js";import"./SearchField-sy3UtP8m.js";import"./Skeleton-BIVtobe8.js";import"./index-BKN9BsH4.js";const ve={title:"Backstage UI/HeaderPage",component:o,parameters:{layout:"fullscreen"}},v=[{id:"overview",label:"Overview"},{id:"checks",label:"Checks"},{id:"tracks",label:"Tracks"},{id:"campaigns",label:"Campaigns"},{id:"integrations",label:"Integrations"}],j=[{label:"Settings",value:"settings"},{label:"Invite new members",value:"invite-new-members"}],i=s=>e.jsx(x,{children:e.jsx(s,{})}),T=[s=>e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{width:"250px",position:"fixed",left:"var(--sb-panel-left)",top:"var(--sb-panel-top)",bottom:"var(--sb-panel-bottom)",backgroundColor:"var(--sb-sidebar-bg)",borderRadius:"var(--sb-panel-radius)",border:"var(--sb-sidebar-border)",borderRight:"var(--sb-sidebar-border-right)",zIndex:1}}),e.jsxs("div",{style:{paddingLeft:"var(--sb-content-padding-inline)",minHeight:"200vh"},children:[e.jsx(s,{}),e.jsx(b,{children:e.jsx(t,{children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."})})]})]})],r={args:{title:"Page Title"}},n={args:{...r.args,tabs:v},decorators:[i]},c={args:{...r.args,menuItems:j}},m={render:()=>e.jsx(o,{...r.args,customActions:e.jsx(f,{children:"Custom action"})})},h={decorators:[i],args:{...r.args,breadcrumbs:[{label:"Home",href:"/"}]}},l={decorators:[i],args:{...r.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}},a={decorators:[i],render:()=>e.jsx(o,{...r.args,menuItems:j,tabs:v,customActions:e.jsx(f,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]})},g={args:{...a.args},decorators:[i,...T],render:a.render},d={args:{title:"Route Matching Demo",tabs:[{id:"home",label:"Home",href:"/home"},{id:"mentorship",label:"Mentorship",href:"/mentorship",matchStrategy:"prefix"},{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"settings",label:"Settings",href:"/settings"}]},render:s=>e.jsxs(x,{initialEntries:["/mentorship/events"],children:[e.jsx(o,{...s}),e.jsxs(b,{children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsxs(t,{children:[`Notice how the "Mentorship" tab is active even though we're on a nested route. This is because it uses`," ",e.jsx("code",{children:'matchStrategy="prefix"'}),"."]}),e.jsx("br",{}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Home"}),": exact matching (default) - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Mentorship"}),": prefix matching - IS active (URL starts with /mentorship)"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Catalog"}),": prefix matching - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Settings"}),": exact matching (default) - not active"]})]})]})},p={args:{title:"Exact Matching Demo",tabs:[{id:"mentorship",label:"Mentorship",href:"/mentorship"},{id:"events",label:"Events",href:"/mentorship/events"},{id:"mentors",label:"Mentors",href:"/mentorship/mentors"}]},render:s=>e.jsxs(x,{initialEntries:["/mentorship/events"],children:[e.jsx(o,{...s}),e.jsxs(b,{children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsx(t,{children:'With default exact matching, only the "Events" tab is active because it exactly matches the current URL. The "Mentorship" tab is not active even though the URL is under /mentorship.'})]})]})},u={args:{title:"Deep Nesting Demo",tabs:[{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"users",label:"Users",href:"/catalog/users",matchStrategy:"prefix"},{id:"components",label:"Components",href:"/catalog/components",matchStrategy:"prefix"}]},render:s=>e.jsxs(x,{initialEntries:["/catalog/users/john/details"],children:[e.jsx(o,{...s}),e.jsxs(b,{children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /catalog/users/john/details"]}),e.jsx("br",{}),e.jsx(t,{children:'Both "Catalog" and "Users" tabs are active because:'}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Catalog"}),": URL starts with /catalog"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Users"}),": URL starts with /catalog/users"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Components"}),": not active (URL doesn't start with /catalog/components)"]}),e.jsx("br",{}),e.jsx(t,{children:"This demonstrates how prefix matching works with deeply nested routes."})]})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Page Title'
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    tabs
  },
  decorators: [withRouter]
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    menuItems
  }
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <HeaderPage {...Default.args} customActions={<Button>Custom action</Button>} />
}`,...m.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  decorators: [withRouter],
  args: {
    ...Default.args,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }]
  }
}`,...h.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  decorators: [withRouter],
  args: {
    ...Default.args,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Long Breadcrumb Name',
      href: '/long-breadcrumb'
    }]
  }
}`,...l.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  decorators: [withRouter],
  render: () => <HeaderPage {...Default.args} menuItems={menuItems} tabs={tabs} customActions={<Button>Custom action</Button>} breadcrumbs={[{
    label: 'Home',
    href: '/'
  }]} />
}`,...a.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithEverything.args
  },
  decorators: [withRouter, ...layoutDecorator],
  render: WithEverything.render
}`,...g.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};const je=["Default","WithTabs","WithMenuItems","WithCustomActions","WithBreadcrumbs","WithLongBreadcrumbs","WithEverything","WithLayout","WithTabsMatchingStrategies","WithTabsExactMatching","WithTabsPrefixMatchingDeep"];export{r as Default,h as WithBreadcrumbs,m as WithCustomActions,a as WithEverything,g as WithLayout,l as WithLongBreadcrumbs,c as WithMenuItems,n as WithTabs,p as WithTabsExactMatching,d as WithTabsMatchingStrategies,u as WithTabsPrefixMatchingDeep,je as __namedExportsOrder,ve as default};
