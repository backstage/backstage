import{j as e}from"./iframe-DXt6I_1q.js";import{H as o}from"./HeaderPage-DvNqOrVb.js";import{t as v}from"./index-lNkMn2dW.js";import{M as u}from"./index-kCs7zF-O.js";import{B as x}from"./Button-BzPVw9jd.js";import{M as j,a as T,b as M}from"./Menu-BZ-zDJml.js";import{B as C}from"./ButtonIcon-BdQelBlQ.js";import{C as b}from"./Container-Sx504Zeq.js";import{T as t}from"./Text-CPASI0-F.js";import"./preload-helper-D9Z9MdNV.js";import"./useStyles-CKDOjn9p.js";import"./clsx-B-dksMZM.js";import"./Link-DDL1m-_R.js";import"./Link--CXxkrs2.js";import"./utils-LcmEw3G_.js";import"./useFocusRing-Yf5GNPk5.js";import"./usePress-DQRChKQT.js";import"./isExternalLink-DzQTpl4p.js";import"./Tabs-DcI-B56m.js";import"./useListState-3j3xhyPM.js";import"./useEvent-BWmpDmPs.js";import"./SelectionIndicator-CiqLhtNy.js";import"./context-Bb-8dEAz.js";import"./Hidden-CSvgiNeY.js";import"./useControlledState-BY6XzekM.js";import"./useLabels-D9LRKjNw.js";import"./useHasTabbableChild-BYb3bBeA.js";import"./Button-5y2EAwUZ.js";import"./Label-BOOV9aoK.js";import"./useLabel-AcvxzzJS.js";import"./Button.module-BPzqtDAO.js";import"./Dialog-rtruUuFK.js";import"./ListBox-C7CSGo5E.js";import"./RSPContexts-8_cBbO_q.js";import"./Text-CJFX5rWX.js";import"./useLocalizedStringFormatter-BLESCg-X.js";import"./OverlayArrow-DbQZR9Vg.js";import"./VisuallyHidden-CGxqwenU.js";import"./Input-C108iTEn.js";import"./useFormReset-BBg88K2L.js";import"./Form-CNN8kECL.js";import"./SearchField-C59KVCmO.js";import"./FieldError-BQcEFFZN.js";const ue={title:"Backstage UI/HeaderPage",component:o,parameters:{layout:"fullscreen"}},f=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],y=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],n=r=>e.jsx(u,{children:e.jsx(r,{})}),R=[r=>e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{width:"250px",position:"fixed",left:"var(--sb-panel-left)",top:"var(--sb-panel-top)",bottom:"var(--sb-panel-bottom)",backgroundColor:"var(--sb-sidebar-bg)",borderRadius:"var(--sb-panel-radius)",border:"var(--sb-sidebar-border)",borderRight:"var(--sb-sidebar-border-right)",zIndex:1}}),e.jsxs("div",{style:{paddingLeft:"var(--sb-content-padding-inline)",minHeight:"200vh"},children:[e.jsx(r,{}),e.jsx(b,{children:e.jsx(t,{children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."})})]})]})],s={args:{title:"Page Title"}},i={args:{...s.args,tabs:f},decorators:[n]},c={decorators:[n],render:()=>e.jsx(o,{...s.args,customActions:e.jsxs(e.Fragment,{children:[e.jsx(x,{children:"Custom action"}),e.jsxs(j,{children:[e.jsx(C,{variant:"tertiary",icon:e.jsx(v,{}),"aria-label":"More options"}),e.jsx(T,{placement:"bottom end",children:y.map(r=>e.jsx(M,{onAction:r.onClick,href:r.href,children:r.label},r.value))})]})]})})},m={decorators:[n],args:{...s.args,breadcrumbs:[{label:"Home",href:"/"}]}},h={decorators:[n],args:{...s.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}},a={decorators:[n],render:()=>e.jsx(o,{...s.args,tabs:f,customActions:e.jsx(x,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]})},l={args:{...a.args},decorators:[n,...R],render:a.render},g={args:{title:"Route Matching Demo",tabs:[{id:"home",label:"Home",href:"/home"},{id:"mentorship",label:"Mentorship",href:"/mentorship",matchStrategy:"prefix"},{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"settings",label:"Settings",href:"/settings"}]},render:r=>e.jsxs(u,{initialEntries:["/mentorship/events"],children:[e.jsx(o,{...r}),e.jsxs(b,{children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsxs(t,{children:[`Notice how the "Mentorship" tab is active even though we're on a nested route. This is because it uses`," ",e.jsx("code",{children:'matchStrategy="prefix"'}),"."]}),e.jsx("br",{}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Home"}),": exact matching (default) - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Mentorship"}),": prefix matching - IS active (URL starts with /mentorship)"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Catalog"}),": prefix matching - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Settings"}),": exact matching (default) - not active"]})]})]})},d={args:{title:"Exact Matching Demo",tabs:[{id:"mentorship",label:"Mentorship",href:"/mentorship"},{id:"events",label:"Events",href:"/mentorship/events"},{id:"mentors",label:"Mentors",href:"/mentorship/mentors"}]},render:r=>e.jsxs(u,{initialEntries:["/mentorship/events"],children:[e.jsx(o,{...r}),e.jsxs(b,{children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsx(t,{children:'With default exact matching, only the "Events" tab is active because it exactly matches the current URL. The "Mentorship" tab is not active even though the URL is under /mentorship.'})]})]})},p={args:{title:"Deep Nesting Demo",tabs:[{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"users",label:"Users",href:"/catalog/users",matchStrategy:"prefix"},{id:"components",label:"Components",href:"/catalog/components",matchStrategy:"prefix"}]},render:r=>e.jsxs(u,{initialEntries:["/catalog/users/john/details"],children:[e.jsx(o,{...r}),e.jsxs(b,{children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /catalog/users/john/details"]}),e.jsx("br",{}),e.jsx(t,{children:'Both "Catalog" and "Users" tabs are active because:'}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Catalog"}),": URL starts with /catalog"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Users"}),": URL starts with /catalog/users"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Components"}),": not active (URL doesn't start with /catalog/components)"]}),e.jsx("br",{}),e.jsx(t,{children:"This demonstrates how prefix matching works with deeply nested routes."})]})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Page Title'
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    tabs
  },
  decorators: [withRouter]
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  decorators: [withRouter],
  render: () => <HeaderPage {...Default.args} customActions={<>
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
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  decorators: [withRouter],
  args: {
    ...Default.args,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }]
  }
}`,...m.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  decorators: [withRouter],
  render: () => <HeaderPage {...Default.args} tabs={tabs} customActions={<Button>Custom action</Button>} breadcrumbs={[{
    label: 'Home',
    href: '/'
  }]} />
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...WithEverything.args
  },
  decorators: [withRouter, ...layoutDecorator],
  render: WithEverything.render
}`,...l.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};const be=["Default","WithTabs","WithCustomActions","WithBreadcrumbs","WithLongBreadcrumbs","WithEverything","WithLayout","WithTabsMatchingStrategies","WithTabsExactMatching","WithTabsPrefixMatchingDeep"];export{s as Default,m as WithBreadcrumbs,c as WithCustomActions,a as WithEverything,l as WithLayout,h as WithLongBreadcrumbs,i as WithTabs,d as WithTabsExactMatching,g as WithTabsMatchingStrategies,p as WithTabsPrefixMatchingDeep,be as __namedExportsOrder,ue as default};
