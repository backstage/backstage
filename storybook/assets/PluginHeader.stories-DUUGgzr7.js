import{bR as e,w as o,c7 as A}from"./iframe-BSg6SOip.js";import{P as i}from"./PluginHeader-B6udpcbH.js";import{t as w,V as I,K as H,n as P}from"./index-Dlj3HaWF.js";import{h as L,M as W,c as k}from"./Menu-L20_sRcG.js";import{B as c}from"./BUIProvider-DGOt-Xmy.js";import{C as d}from"./Container-BWE3mk_r.js";import{B as h}from"./ButtonIcon-BZq12D5a.js";import{T as t}from"./Text-BUrmjhwZ.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DeLUZGx2.js";import"./useObjectRef-DBlAjOUP.js";import"./useCollection-DvHDK50b.js";import"./useFocusRing-DGKZUDqT.js";import"./openLink-DxYjWf7G.js";import"./Hidden-4PpluWSp.js";import"./keyboard-CsWowfPP.js";import"./FocusScope-Cokg97zJ.js";import"./useEvent-wFo09GKu.js";import"./I18nProvider-C5Ed87oL.js";import"./usePress-DhUqF1zw.js";import"./textSelection-aDFvxn9c.js";import"./useControlledState-CaozfHK9.js";import"./Link-B-1gThbt.js";import"./useLink-BXx0MEjr.js";import"./useHover-BKKglU9f.js";import"./useLocalizedStringFormatter-3P7dKLk3.js";import"./Button-OzTainv7.js";import"./Label-Bsgi-8sx.js";import"./useLabel-xLEOMe10.js";import"./useLabels-C_VR0tdY.js";import"./number-iU0vIrtR.js";import"./useButton-BIeTy3DX.js";import"./Link-CU8rIc5m.js";import"./useResolvedHref-qBxDchOt.js";import"./getNodeText-cZzvp9la.js";import"./Tooltip-YKPXWgKl.js";import"./useOverlayTriggerState-BjxIi2GR.js";import"./animation-C65meOdJ.js";import"./VisuallyHidden-DBJGIqj2.js";import"./Tabs-CMm7XmoF.js";import"./useHasTabbableChild-D2AyRjoL.js";import"./useListState-CTPsqM3T.js";import"./Autocomplete-CnJA6POS.js";import"./getItemCount-DKo1Nidv.js";import"./Input-DH05hXmi.js";import"./ListBox-VuPp4ZDp.js";import"./Text-sM1EKRDW.js";import"./Dialog-g4w5QBOm.js";import"./Heading-CRk9HMj5.js";import"./VisuallyHidden-NMydw6nU.js";import"./SearchField-BDXMhnez.js";import"./FieldError-BlC4M7Iq.js";import"./useFormValidation-ChfEGaAs.js";import"./useTextField-unZ9EnYz.js";import"./useField-CXk8tlI8.js";import"./useFormReset-D0dwzMqm.js";import"./Virtualizer-BuUh5RvF.js";import"./useFilter-DzFFH65V.js";const s=A.meta({title:"Backstage UI/PluginHeader",component:i,parameters:{layout:"fullscreen"}}),n=r=>e.jsx(o,{children:e.jsx(c,{children:e.jsx(r,{})})}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],B=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],p=s.story({args:{},decorators:[n]}),u=s.story({args:{tabs:l},decorators:[n]}),m=s.story({args:{},decorators:[n],render:r=>e.jsx(i,{...r,customActions:e.jsxs(e.Fragment,{children:[e.jsx(h,{variant:"secondary",icon:e.jsx(H,{})}),e.jsx(h,{variant:"secondary",icon:e.jsx(P,{})}),e.jsx(h,{variant:"secondary",icon:e.jsx(w,{})}),e.jsxs(L,{children:[e.jsx(h,{variant:"secondary",icon:e.jsx(I,{})}),e.jsx(W,{placement:"bottom end",children:B.map(a=>e.jsx(k,{onAction:a.onClick,href:a.href,children:a.label},a.value))})]})]})})}),g=m.extend({args:{tabs:l}}),b=s.story({args:{tabs:l},render:r=>e.jsx(o,{initialEntries:["/campaigns"],children:e.jsxs(c,{children:[e.jsx(i,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/campaigns"})]}),e.jsx(t,{as:"p",children:'Notice how the "Campaigns" tab is selected (highlighted) because it matches the current path.'})]})]})})}),x=s.story({args:{tabs:l},render:r=>e.jsx(o,{initialEntries:["/integrations"],children:e.jsxs(c,{children:[e.jsx(i,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/integrations"})]}),e.jsx(t,{as:"p",children:'Notice how the "Integrations" tab is selected (highlighted) because it matches the current path.'})]})]})})}),v=s.story({args:{tabs:l},render:r=>e.jsx(o,{initialEntries:["/some-other-page"],children:e.jsxs(c,{children:[e.jsx(i,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/some-other-page"})]}),e.jsx(t,{as:"p",children:"No tab is selected because the current path doesn't match any tab's href."}),e.jsx(t,{as:"p",children:`Tabs without href (like "Overview", "Checks", "Tracks") fall back to React Aria's internal state.`})]})]})})}),f=s.story({args:{title:"Route Matching Demo",tabs:[{id:"home",label:"Home",href:"/home"},{id:"mentorship",label:"Mentorship",href:"/mentorship",matchStrategy:"prefix"},{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"settings",label:"Settings",href:"/settings"}]},render:r=>e.jsx(o,{initialEntries:["/mentorship/events"],children:e.jsxs(c,{children:[e.jsx(i,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsxs(t,{children:[`Notice how the "Mentorship" tab is active even though we're on a nested route. This is because it uses`," ",e.jsx("code",{children:'matchStrategy="prefix"'}),"."]}),e.jsx("br",{}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Home"}),": exact matching (default) - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Mentorship"}),": prefix matching - IS active (URL starts with /mentorship)"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Catalog"}),": prefix matching - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Settings"}),": exact matching (default) - not active"]})]})]})})}),y=s.story({args:{title:"Exact Matching Demo",tabs:[{id:"mentorship",label:"Mentorship",href:"/mentorship"},{id:"events",label:"Events",href:"/mentorship/events"},{id:"mentors",label:"Mentors",href:"/mentorship/mentors"}]},render:r=>e.jsx(o,{initialEntries:["/mentorship/events"],children:e.jsxs(c,{children:[e.jsx(i,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsx(t,{children:'With default exact matching, only the "Events" tab is active because it exactly matches the current URL. The "Mentorship" tab is not active even though the URL is under /mentorship.'})]})]})})}),j=s.story({args:{title:"Deep Nesting Demo",tabs:[{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"users",label:"Users",href:"/catalog/users",matchStrategy:"prefix"},{id:"components",label:"Components",href:"/catalog/components",matchStrategy:"prefix"}]},render:r=>e.jsx(o,{initialEntries:["/catalog/users/john/details"],children:e.jsxs(c,{children:[e.jsx(i,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{as:"p",children:[e.jsx("strong",{children:"Current URL:"})," /catalog/users/john/details"]}),e.jsx("br",{}),e.jsxs(t,{as:"p",children:["Active tab is ",e.jsx("strong",{children:"Users"})," because:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Catalog"}),": Matches since URL starts with /catalog"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Users"}),': Is active since URL starts with /catalog/users, and is more specific (has more url segments) than "Catalog"']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Components"}),": not active (URL doesn't start with /catalog/components)"]})]}),e.jsx(t,{as:"p",children:"This demonstrates how prefix matching works with deeply nested routes."})]})]})})}),T=s.story({args:{title:"Service Details",breadcrumbs:[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:"my-service",href:"/services/my-service"}]},decorators:[n]}),M=s.story({args:{title:"Service Details",breadcrumbs:[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:"Page with a very long title that should truncate",href:"/services/long"},{label:"Service Details",href:"/services/long/another"}]},decorators:[n]}),R=s.story({args:{title:"Introduction",breadcrumbs:[{label:"Home",href:"/"},{label:"Docs",href:"/docs"},{label:"Guides",href:"/docs/guides"},{label:"Setup",href:"/docs/guides/setup"},{label:"Introduction",href:"/docs/guides/setup/introduction"}]},decorators:[n]}),S=s.story({args:{title:"Service Details",breadcrumbs:[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:"my-service",href:"/services/my-service"}],tabs:l},decorators:[n]}),C=s.story({args:{title:"Service Details",breadcrumbs:[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:"my-service",href:"/services/my-service"}]},decorators:[n],render:r=>e.jsx(i,{...r,customActions:e.jsxs(e.Fragment,{children:[e.jsx(h,{variant:"secondary",icon:e.jsx(w,{})}),e.jsxs(L,{children:[e.jsx(h,{variant:"secondary",icon:e.jsx(I,{})}),e.jsx(W,{placement:"bottom end",children:B.map(a=>e.jsx(k,{onAction:a.onClick,href:a.href,children:a.label},a.value))})]})]})})}),U=m.extend({args:{tabs:l,breadcrumbs:[{label:"Home",href:"/"},{label:"Docs",href:"/docs"},{label:"Guides",href:"/docs/guides"},{label:"Setup page with a very long title that should truncate at some point",href:"/docs/guides/setup"},{label:"Introduction with a very long title that should truncate at some point",href:"/docs/guides/setup/introduction"}]}});p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {},
  decorators: [withRouter]
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    tabs
  },
  decorators: [withRouter]
})`,...u.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`WithCustomActions.extend({
  args: {
    tabs
  }
})`,...g.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...b.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...x.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...v.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...f.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...y.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Service Details',
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Services',
      href: '/services'
    }, {
      label: 'my-service',
      href: '/services/my-service'
    }]
  },
  decorators: [withRouter]
})`,...T.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Service Details',
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Services',
      href: '/services'
    }, {
      label: 'Page with a very long title that should truncate',
      href: '/services/long'
    }, {
      label: 'Service Details',
      href: '/services/long/another'
    }]
  },
  decorators: [withRouter]
})`,...M.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Introduction',
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Docs',
      href: '/docs'
    }, {
      label: 'Guides',
      href: '/docs/guides'
    }, {
      label: 'Setup',
      href: '/docs/guides/setup'
    }, {
      label: 'Introduction',
      href: '/docs/guides/setup/introduction'
    }]
  },
  decorators: [withRouter]
})`,...R.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Service Details',
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Services',
      href: '/services'
    }, {
      label: 'my-service',
      href: '/services/my-service'
    }],
    tabs
  },
  decorators: [withRouter]
})`,...S.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Service Details',
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Services',
      href: '/services'
    }, {
      label: 'my-service',
      href: '/services/my-service'
    }]
  },
  decorators: [withRouter],
  render: args => <PluginHeader {...args} customActions={<>
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
})`,...C.input.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`WithCustomActions.extend({
  args: {
    tabs,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Docs',
      href: '/docs'
    }, {
      label: 'Guides',
      href: '/docs/guides'
    }, {
      label: 'Setup page with a very long title that should truncate at some point',
      href: '/docs/guides/setup'
    }, {
      label: 'Introduction with a very long title that should truncate at some point',
      href: '/docs/guides/setup/introduction'
    }]
  }
})`,...U.parameters?.docs?.source}}};const Fe=["Default","WithTabs","WithCustomActions","WithAllOptionsAndTabs","WithMockedURLCampaigns","WithMockedURLIntegrations","WithMockedURLNoMatch","WithTabsMatchingStrategies","WithTabsExactMatching","WithTabsPrefixMatchingDeep","WithBreadcrumbs","WithBreadcrumbsWithLongSegments","WithBreadcrumbsWithMoreThanFiveSegments","WithBreadcrumbsAndTabs","WithBreadcrumbsAndCustomActions","WithBreadcrumbsAndAllOptions"];export{p as Default,g as WithAllOptionsAndTabs,T as WithBreadcrumbs,U as WithBreadcrumbsAndAllOptions,C as WithBreadcrumbsAndCustomActions,S as WithBreadcrumbsAndTabs,M as WithBreadcrumbsWithLongSegments,R as WithBreadcrumbsWithMoreThanFiveSegments,m as WithCustomActions,b as WithMockedURLCampaigns,x as WithMockedURLIntegrations,v as WithMockedURLNoMatch,u as WithTabs,y as WithTabsExactMatching,f as WithTabsMatchingStrategies,j as WithTabsPrefixMatchingDeep,Fe as __namedExportsOrder};
