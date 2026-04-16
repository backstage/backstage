import{j as e,M as a,p as T}from"./iframe-B7ESvRaB.js";import{P as i}from"./PluginHeader-gW3V5ekJ.js";import{b as M,c as R,g as C,t as U}from"./index-DbP8Hxod.js";import{M as w,a as L,b as I}from"./Menu-DCUnT5Am.js";import{B as n}from"./BUIProvider-sIkzvwhM.js";import{C as o}from"./Container-BF6BZzDy.js";import{B as l}from"./ButtonIcon-Be6gXqqZ.js";import{T as t}from"./Text-2w665EoO.js";import"./preload-helper-PPVm8Dsz.js";import"./Link-DAVUo9kS.js";import"./useLink-C4zSeWp7.js";import"./useGlobalListeners-DQLyYZ9f.js";import"./useObjectRef-Dd7TU9CZ.js";import"./openLink-BFNE09ao.js";import"./usePress-HRSvR9KN.js";import"./textSelection-XuXSjEvl.js";import"./getNodeText-C-fdRcD6.js";import"./Tabs-mS0TDYPy.js";import"./utils-Cr8yviUJ.js";import"./useCollection-BY8iat3j.js";import"./Hidden-CK51uwW5.js";import"./keyboard-D5YIFYbX.js";import"./FocusScope-BH80Flu8.js";import"./useEvent-DHH67uGj.js";import"./I18nProvider-BeIWmuaR.js";import"./useControlledState-CAbD27ky.js";import"./useHasTabbableChild-DGtOQdpC.js";import"./useLabels-CZf5BL8e.js";import"./useListState-Dp5LXYnH.js";import"./animation-Dck7a-0Y.js";import"./useHover-ByBQ7Oss.js";import"./linkUtils-tKDL5Jm1.js";import"./Autocomplete-CNmEvmEM.js";import"./useLocalizedStringFormatter-DDwB1B3c.js";import"./Button-CkPxspJE.js";import"./Label-B06uCzgg.js";import"./useLabel-4lo-IT0x.js";import"./number-DKEC05wv.js";import"./useButton-DtXFNKA5.js";import"./getItemCount-DH8ckQTJ.js";import"./useTextField-Cr00JWXn.js";import"./useField-BUR4AR8N.js";import"./useFormReset-Cx4bKIVX.js";import"./useFormValidation-b6a5_FZR.js";import"./ListBox-Dy1BN8xK.js";import"./Text-DRd6SIAI.js";import"./Dialog-B8ZfYxUf.js";import"./Heading-CAK7K7Ei.js";import"./useOverlayTriggerState-BQI29lrc.js";import"./VisuallyHidden-BCbZC_pS.js";import"./SearchField-CNcmfNuo.js";import"./FieldError-eB_pr8Wa.js";import"./Virtualizer-BuzZbCd_.js";import"./useFilter-BTettxGt.js";const s=T.meta({title:"Backstage UI/PluginHeader",component:i,parameters:{layout:"fullscreen"}}),y=r=>e.jsx(a,{children:e.jsx(n,{children:e.jsx(r,{})})}),h=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],k=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],p=s.story({args:{},decorators:[y]}),g=s.story({args:{tabs:h},decorators:[y]}),c=s.story({args:{},decorators:[y],render:r=>e.jsx(i,{...r,customActions:e.jsxs(e.Fragment,{children:[e.jsx(l,{variant:"secondary",icon:e.jsx(M,{})}),e.jsx(l,{variant:"secondary",icon:e.jsx(R,{})}),e.jsx(l,{variant:"secondary",icon:e.jsx(C,{})}),e.jsxs(w,{children:[e.jsx(l,{variant:"secondary",icon:e.jsx(U,{})}),e.jsx(L,{placement:"bottom end",children:k.map(m=>e.jsx(I,{onAction:m.onClick,href:m.href,children:m.label},m.value))})]})]})})}),d=c.extend({args:{tabs:h}}),u=s.story({args:{tabs:h},render:r=>e.jsx(a,{initialEntries:["/campaigns"],children:e.jsxs(n,{children:[e.jsx(i,{...r}),e.jsxs(o,{mt:"6",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/campaigns"})]}),e.jsx(t,{as:"p",children:'Notice how the "Campaigns" tab is selected (highlighted) because it matches the current path.'})]})]})})}),x=s.story({args:{tabs:h},render:r=>e.jsx(a,{initialEntries:["/integrations"],children:e.jsxs(n,{children:[e.jsx(i,{...r}),e.jsxs(o,{mt:"6",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/integrations"})]}),e.jsx(t,{as:"p",children:'Notice how the "Integrations" tab is selected (highlighted) because it matches the current path.'})]})]})})}),b=s.story({args:{tabs:h},render:r=>e.jsx(a,{initialEntries:["/some-other-page"],children:e.jsxs(n,{children:[e.jsx(i,{...r}),e.jsxs(o,{mt:"6",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/some-other-page"})]}),e.jsx(t,{as:"p",children:"No tab is selected because the current path doesn't match any tab's href."}),e.jsx(t,{as:"p",children:`Tabs without href (like "Overview", "Checks", "Tracks") fall back to React Aria's internal state.`})]})]})})}),j=s.story({args:{title:"Route Matching Demo",tabs:[{id:"home",label:"Home",href:"/home"},{id:"mentorship",label:"Mentorship",href:"/mentorship",matchStrategy:"prefix"},{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"settings",label:"Settings",href:"/settings"}]},render:r=>e.jsx(a,{initialEntries:["/mentorship/events"],children:e.jsxs(n,{children:[e.jsx(i,{...r}),e.jsxs(o,{mt:"6",children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsxs(t,{children:[`Notice how the "Mentorship" tab is active even though we're on a nested route. This is because it uses`," ",e.jsx("code",{children:'matchStrategy="prefix"'}),"."]}),e.jsx("br",{}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Home"}),": exact matching (default) - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Mentorship"}),": prefix matching - IS active (URL starts with /mentorship)"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Catalog"}),": prefix matching - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Settings"}),": exact matching (default) - not active"]})]})]})})}),v=s.story({args:{title:"Exact Matching Demo",tabs:[{id:"mentorship",label:"Mentorship",href:"/mentorship"},{id:"events",label:"Events",href:"/mentorship/events"},{id:"mentors",label:"Mentors",href:"/mentorship/mentors"}]},render:r=>e.jsx(a,{initialEntries:["/mentorship/events"],children:e.jsxs(n,{children:[e.jsx(i,{...r}),e.jsxs(o,{mt:"6",children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsx(t,{children:'With default exact matching, only the "Events" tab is active because it exactly matches the current URL. The "Mentorship" tab is not active even though the URL is under /mentorship.'})]})]})})}),f=s.story({args:{title:"Deep Nesting Demo",tabs:[{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"users",label:"Users",href:"/catalog/users",matchStrategy:"prefix"},{id:"components",label:"Components",href:"/catalog/components",matchStrategy:"prefix"}]},render:r=>e.jsx(a,{initialEntries:["/catalog/users/john/details"],children:e.jsxs(n,{children:[e.jsx(i,{...r}),e.jsxs(o,{mt:"6",children:[e.jsxs(t,{as:"p",children:[e.jsx("strong",{children:"Current URL:"})," /catalog/users/john/details"]}),e.jsx("br",{}),e.jsxs(t,{as:"p",children:["Active tab is ",e.jsx("strong",{children:"Users"})," because:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Catalog"}),": Matches since URL starts with /catalog"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Users"}),': Is active since URL starts with /catalog/users, and is more specific (has more url segments) than "Catalog"']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Components"}),": not active (URL doesn't start with /catalog/components)"]})]}),e.jsx(t,{as:"p",children:"This demonstrates how prefix matching works with deeply nested routes."})]})]})})});p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {},
  decorators: [withRouter]
})`,...p.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    tabs
  },
  decorators: [withRouter]
})`,...g.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {},
  decorators: [withRouter],
  render: args => <PluginHeader {...args} customActions={<>
          <ButtonIcon variant="secondary" icon={<RiCloudy2Line />} />
          <ButtonIcon variant="secondary" icon={<RiEmotionHappyLine />} />
          <ButtonIcon variant="secondary" icon={<RiHeartLine />} />
          <MenuTrigger>
            <ButtonIcon variant="secondary" icon={<RiMore2Line />} />
            <Menu placement="bottom end">
              {menuItems.map(option => <MenuItem key={option.value} onAction={option.onClick} href={option.href}>
                  {option.label}
                </MenuItem>)}
            </Menu>
          </MenuTrigger>
        </>} />
})`,...c.input.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`WithCustomActions.extend({
  args: {
    tabs
  }
})`,...d.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    tabs
  },
  render: args => <MemoryRouter initialEntries={['/campaigns']}>
      <BUIProvider>
        <PluginHeader {...args} />
        <Container mt="6">
          <Text as="p">
            Current URL is mocked to be: <strong>/campaigns</strong>
          </Text>
          <Text as="p">
            Notice how the "Campaigns" tab is selected (highlighted) because it
            matches the current path.
          </Text>
        </Container>
      </BUIProvider>
    </MemoryRouter>
})`,...u.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    tabs
  },
  render: args => <MemoryRouter initialEntries={['/integrations']}>
      <BUIProvider>
        <PluginHeader {...args} />
        <Container mt="6">
          <Text as="p">
            Current URL is mocked to be: <strong>/integrations</strong>
          </Text>
          <Text as="p">
            Notice how the "Integrations" tab is selected (highlighted) because
            it matches the current path.
          </Text>
        </Container>
      </BUIProvider>
    </MemoryRouter>
})`,...x.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    tabs
  },
  render: args => <MemoryRouter initialEntries={['/some-other-page']}>
      <BUIProvider>
        <PluginHeader {...args} />
        <Container mt="6">
          <Text as="p">
            Current URL is mocked to be: <strong>/some-other-page</strong>
          </Text>
          <Text as="p">
            No tab is selected because the current path doesn't match any tab's
            href.
          </Text>
          <Text as="p">
            Tabs without href (like "Overview", "Checks", "Tracks") fall back to
            React Aria's internal state.
          </Text>
        </Container>
      </BUIProvider>
    </MemoryRouter>
})`,...b.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
      <BUIProvider>
        <PluginHeader {...args} />
        <Container mt="6">
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
            • <strong>Mentorship</strong>: prefix matching - IS active (URL
            starts with /mentorship)
          </Text>
          <Text>
            • <strong>Catalog</strong>: prefix matching - not active
          </Text>
          <Text>
            • <strong>Settings</strong>: exact matching (default) - not active
          </Text>
        </Container>
      </BUIProvider>
    </MemoryRouter>
})`,...j.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
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
      <BUIProvider>
        <PluginHeader {...args} />
        <Container mt="6">
          <Text>
            <strong>Current URL:</strong> /mentorship/events
          </Text>
          <br />
          <Text>
            With default exact matching, only the "Events" tab is active because
            it exactly matches the current URL. The "Mentorship" tab is not
            active even though the URL is under /mentorship.
          </Text>
        </Container>
      </BUIProvider>
    </MemoryRouter>
})`,...v.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
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
      <BUIProvider>
        <PluginHeader {...args} />
        <Container mt="6">
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
            This demonstrates how prefix matching works with deeply nested
            routes.
          </Text>
        </Container>
      </BUIProvider>
    </MemoryRouter>
})`,...f.input.parameters?.docs?.source}}};const Se=["Default","WithTabs","WithCustomActions","WithAllOptionsAndTabs","WithMockedURLCampaigns","WithMockedURLIntegrations","WithMockedURLNoMatch","WithTabsMatchingStrategies","WithTabsExactMatching","WithTabsPrefixMatchingDeep"];export{p as Default,d as WithAllOptionsAndTabs,c as WithCustomActions,u as WithMockedURLCampaigns,x as WithMockedURLIntegrations,b as WithMockedURLNoMatch,g as WithTabs,v as WithTabsExactMatching,j as WithTabsMatchingStrategies,f as WithTabsPrefixMatchingDeep,Se as __namedExportsOrder};
