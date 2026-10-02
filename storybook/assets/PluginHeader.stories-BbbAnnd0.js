import{j as e,M as o,p as A}from"./iframe-DOtOeTqo.js";import{P as i}from"./PluginHeader-CrEBfi2q.js";import{g as w,t as I,b as H,c as P}from"./index-BlBcDPbs.js";import{a as L,b as W,M as k}from"./Menu-CRieYxkQ.js";import{B as c}from"./BUIProvider-DMOlRvK1.js";import{C as d}from"./Container-WfwirRIa.js";import{B as h}from"./ButtonIcon-sleBnERd.js";import{T as t}from"./Text-oWMdABsL.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-pgFMei_k.js";import"./useObjectRef-BWUUeiPu.js";import"./useCollection-ywvIf1ZR.js";import"./useFocusRing-BXb8q1JL.js";import"./openLink-CJNg7ARK.js";import"./Hidden-CxPa8WIq.js";import"./keyboard-Dpz_eYv5.js";import"./FocusScope-8l1FH1do.js";import"./useEvent-KvN5j0jW.js";import"./I18nProvider-DuDY5T7I.js";import"./usePress-BQ7zB3R2.js";import"./textSelection-8fES9RA1.js";import"./useControlledState-BfKz3a4E.js";import"./Link-B5Izhaq5.js";import"./useLink-C5Ok2pWw.js";import"./useHover-CLTRyNT2.js";import"./useLocalizedStringFormatter-BO4d3GOf.js";import"./Button-BEAJi762.js";import"./Label-BxIKHFQ8.js";import"./useLabel-DH87djdw.js";import"./useLabels-BnFtLpP2.js";import"./number-Bmc2WaUx.js";import"./useButton-nXyYv-0V.js";import"./Link-B3oEvCNi.js";import"./useResolvedHref-DUUdLYVO.js";import"./getNodeText-S38ODEZL.js";import"./Tooltip-BpL3QK8E.js";import"./useOverlayTriggerState-CMprxMq5.js";import"./animation-PioyXRyy.js";import"./VisuallyHidden-Cnf5jxGD.js";import"./Tabs-B-MUNZJB.js";import"./useHasTabbableChild-Bjh9h_xQ.js";import"./useListState-BmjKsDQ8.js";import"./Autocomplete-CvKotD4o.js";import"./getItemCount-DQUCnSau.js";import"./Input-CoNrOVCs.js";import"./ListBox-BTKNHs4G.js";import"./Text-CUFEUyEl.js";import"./Dialog-CiCl0SZu.js";import"./Heading-Ct93H_J-.js";import"./VisuallyHidden-LCnCHlaD.js";import"./SearchField-CRR7sSDC.js";import"./FieldError-BZUytoyE.js";import"./useFormValidation-NUNxJZWW.js";import"./useTextField-JZBlAGZ1.js";import"./useField-M0TANDTX.js";import"./useFormReset-DPXLv5Gr.js";import"./Virtualizer-DPvnqRcH.js";import"./useFilter-MznAiwUS.js";import"./BUIRoutingProvider-CCMgpbyZ.js";const s=A.meta({title:"Backstage UI/PluginHeader",component:i,parameters:{layout:"fullscreen"}}),n=r=>e.jsx(o,{children:e.jsx(c,{children:e.jsx(r,{})})}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],B=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],p=s.story({args:{},decorators:[n]}),u=s.story({args:{tabs:l},decorators:[n]}),m=s.story({args:{},decorators:[n],render:r=>e.jsx(i,{...r,customActions:e.jsxs(e.Fragment,{children:[e.jsx(h,{variant:"secondary",icon:e.jsx(H,{})}),e.jsx(h,{variant:"secondary",icon:e.jsx(P,{})}),e.jsx(h,{variant:"secondary",icon:e.jsx(w,{})}),e.jsxs(L,{children:[e.jsx(h,{variant:"secondary",icon:e.jsx(I,{})}),e.jsx(W,{placement:"bottom end",children:B.map(a=>e.jsx(k,{onAction:a.onClick,href:a.href,children:a.label},a.value))})]})]})})}),g=m.extend({args:{tabs:l}}),b=s.story({args:{tabs:l},render:r=>e.jsx(o,{initialEntries:["/campaigns"],children:e.jsxs(c,{children:[e.jsx(i,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/campaigns"})]}),e.jsx(t,{as:"p",children:'Notice how the "Campaigns" tab is selected (highlighted) because it matches the current path.'})]})]})})}),x=s.story({args:{tabs:l},render:r=>e.jsx(o,{initialEntries:["/integrations"],children:e.jsxs(c,{children:[e.jsx(i,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/integrations"})]}),e.jsx(t,{as:"p",children:'Notice how the "Integrations" tab is selected (highlighted) because it matches the current path.'})]})]})})}),v=s.story({args:{tabs:l},render:r=>e.jsx(o,{initialEntries:["/some-other-page"],children:e.jsxs(c,{children:[e.jsx(i,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/some-other-page"})]}),e.jsx(t,{as:"p",children:"No tab is selected because the current path doesn't match any tab's href."}),e.jsx(t,{as:"p",children:`Tabs without href (like "Overview", "Checks", "Tracks") fall back to React Aria's internal state.`})]})]})})}),f=s.story({args:{title:"Route Matching Demo",tabs:[{id:"home",label:"Home",href:"/home"},{id:"mentorship",label:"Mentorship",href:"/mentorship",matchStrategy:"prefix"},{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"settings",label:"Settings",href:"/settings"}]},render:r=>e.jsx(o,{initialEntries:["/mentorship/events"],children:e.jsxs(c,{children:[e.jsx(i,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsxs(t,{children:[`Notice how the "Mentorship" tab is active even though we're on a nested route. This is because it uses`," ",e.jsx("code",{children:'matchStrategy="prefix"'}),"."]}),e.jsx("br",{}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Home"}),": exact matching (default) - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Mentorship"}),": prefix matching - IS active (URL starts with /mentorship)"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Catalog"}),": prefix matching - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Settings"}),": exact matching (default) - not active"]})]})]})})}),j=s.story({args:{title:"Exact Matching Demo",tabs:[{id:"mentorship",label:"Mentorship",href:"/mentorship"},{id:"events",label:"Events",href:"/mentorship/events"},{id:"mentors",label:"Mentors",href:"/mentorship/mentors"}]},render:r=>e.jsx(o,{initialEntries:["/mentorship/events"],children:e.jsxs(c,{children:[e.jsx(i,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsx(t,{children:'With default exact matching, only the "Events" tab is active because it exactly matches the current URL. The "Mentorship" tab is not active even though the URL is under /mentorship.'})]})]})})}),y=s.story({args:{title:"Deep Nesting Demo",tabs:[{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"users",label:"Users",href:"/catalog/users",matchStrategy:"prefix"},{id:"components",label:"Components",href:"/catalog/components",matchStrategy:"prefix"}]},render:r=>e.jsx(o,{initialEntries:["/catalog/users/john/details"],children:e.jsxs(c,{children:[e.jsx(i,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{as:"p",children:[e.jsx("strong",{children:"Current URL:"})," /catalog/users/john/details"]}),e.jsx("br",{}),e.jsxs(t,{as:"p",children:["Active tab is ",e.jsx("strong",{children:"Users"})," because:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Catalog"}),": Matches since URL starts with /catalog"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Users"}),': Is active since URL starts with /catalog/users, and is more specific (has more url segments) than "Catalog"']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Components"}),": not active (URL doesn't start with /catalog/components)"]})]}),e.jsx(t,{as:"p",children:"This demonstrates how prefix matching works with deeply nested routes."})]})]})})}),T=s.story({args:{title:"Service Details",breadcrumbs:[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:"my-service",href:"/services/my-service"}]},decorators:[n]}),M=s.story({args:{title:"Service Details",breadcrumbs:[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:"Page with a very long title that should truncate",href:"/services/long"},{label:"Service Details",href:"/services/long/another"}]},decorators:[n]}),R=s.story({args:{title:"Introduction",breadcrumbs:[{label:"Home",href:"/"},{label:"Docs",href:"/docs"},{label:"Guides",href:"/docs/guides"},{label:"Setup",href:"/docs/guides/setup"},{label:"Introduction",href:"/docs/guides/setup/introduction"}]},decorators:[n]}),S=s.story({args:{title:"Service Details",breadcrumbs:[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:"my-service",href:"/services/my-service"}],tabs:l},decorators:[n]}),C=s.story({args:{title:"Service Details",breadcrumbs:[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:"my-service",href:"/services/my-service"}]},decorators:[n],render:r=>e.jsx(i,{...r,customActions:e.jsxs(e.Fragment,{children:[e.jsx(h,{variant:"secondary",icon:e.jsx(w,{})}),e.jsxs(L,{children:[e.jsx(h,{variant:"secondary",icon:e.jsx(I,{})}),e.jsx(W,{placement:"bottom end",children:B.map(a=>e.jsx(k,{onAction:a.onClick,href:a.href,children:a.label},a.value))})]})]})})}),U=m.extend({args:{tabs:l,breadcrumbs:[{label:"Home",href:"/"},{label:"Docs",href:"/docs"},{label:"Guides",href:"/docs/guides"},{label:"Setup page with a very long title that should truncate at some point",href:"/docs/guides/setup"},{label:"Introduction with a very long title that should truncate at some point",href:"/docs/guides/setup/introduction"}]}});p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...f.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...y.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...U.parameters?.docs?.source}}};const Ge=["Default","WithTabs","WithCustomActions","WithAllOptionsAndTabs","WithMockedURLCampaigns","WithMockedURLIntegrations","WithMockedURLNoMatch","WithTabsMatchingStrategies","WithTabsExactMatching","WithTabsPrefixMatchingDeep","WithBreadcrumbs","WithBreadcrumbsWithLongSegments","WithBreadcrumbsWithMoreThanFiveSegments","WithBreadcrumbsAndTabs","WithBreadcrumbsAndCustomActions","WithBreadcrumbsAndAllOptions"];export{p as Default,g as WithAllOptionsAndTabs,T as WithBreadcrumbs,U as WithBreadcrumbsAndAllOptions,C as WithBreadcrumbsAndCustomActions,S as WithBreadcrumbsAndTabs,M as WithBreadcrumbsWithLongSegments,R as WithBreadcrumbsWithMoreThanFiveSegments,m as WithCustomActions,b as WithMockedURLCampaigns,x as WithMockedURLIntegrations,v as WithMockedURLNoMatch,u as WithTabs,j as WithTabsExactMatching,f as WithTabsMatchingStrategies,y as WithTabsPrefixMatchingDeep,Ge as __namedExportsOrder};
