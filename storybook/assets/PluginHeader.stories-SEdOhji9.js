import{j as e,p as A}from"./iframe-bb_jNxxL.js";import{T as o}from"./TestRouter-CbDFQ_sS.js";import{P as a}from"./PluginHeader-Cm0skTPz.js";import{g as w,t as I,b as H,c as P}from"./index-gvfFGbLs.js";import{a as L,b as W,M as k}from"./Menu-CJcjGEiz.js";import{B as c}from"./BUIProvider-3fANo4od.js";import{C as d}from"./Container-_TcIzaM2.js";import{B as h}from"./ButtonIcon-D9OaYA-z.js";import{T as t}from"./Text-BseoxH0X.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B6EXqJ8A.js";import"./utils-Cyge8L4m.js";import"./useObjectRef-CTDjzFB8.js";import"./useCollection-DV0iE3Tb.js";import"./useFocusRing-DDqjVrJn.js";import"./Hidden-7ff-isZb.js";import"./keyboard-CTRGf6zG.js";import"./getMetaValue-BAPq9Qsv.js";import"./FocusScope-H3a-3FIW.js";import"./useEvent-CLir4Cc2.js";import"./I18nProvider-B9G7Dj3y.js";import"./usePress-iPbewX15.js";import"./textSelection-DLp-xbkE.js";import"./useControlledState-B45Nf08u.js";import"./Link-Bn2yFlaz.js";import"./useLink-Cw4nOyzC.js";import"./useHover-dfqWQZHs.js";import"./useLocalizedStringFormatter-Db8iDqbo.js";import"./Button-B0WaVeZf.js";import"./Label-C64Zc2HQ.js";import"./useLabel-DvDKUI6U.js";import"./useLabels-B5_kFWwx.js";import"./number-DwC5Q0g4.js";import"./useButton-Dgm20RBw.js";import"./Link-CqA1DZlI.js";import"./getNodeText-XEz2Kd1g.js";import"./BUIRoutingProvider-DqHM2OTt.js";import"./Tooltip-BiZdYZQM.js";import"./useOverlayTriggerState-Cwdw0na1.js";import"./animation-BLiFJPlN.js";import"./VisuallyHidden-BNKTl-Ou.js";import"./Tabs-HhcKyfYT.js";import"./SelectionIndicator-BvbLcwFj.js";import"./useHasTabbableChild-aiZ5SoGg.js";import"./useListState-DG0_AzeR.js";import"./Autocomplete-DbeBzPgx.js";import"./useLoadMoreSentinel-C2DRsS6z.js";import"./Input-Dr54Is2P.js";import"./ListBox-16vWbqAu.js";import"./Text-BtpIt2qG.js";import"./Dialog-CshjZfCk.js";import"./Heading-DqjAjdHh.js";import"./VisuallyHidden-V0bjBViI.js";import"./SearchField-C4sv5qiQ.js";import"./FieldError-CzTxz--v.js";import"./Form-C58QXp5W.js";import"./useFormValidation-CWqstwdw.js";import"./useTextField-CI0DqPWz.js";import"./useField-BGbko4b6.js";import"./useFormReset-Dv4_zW6V.js";import"./Virtualizer-DMR2YKbK.js";import"./useFilter-BEmfJ5SZ.js";const s=A.meta({title:"Backstage UI/PluginHeader",component:a,parameters:{layout:"fullscreen"}}),n=r=>e.jsx(o,{children:e.jsx(c,{children:e.jsx(r,{})})}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],B=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],p=s.story({args:{},decorators:[n]}),u=s.story({args:{tabs:l},decorators:[n]}),m=s.story({args:{},decorators:[n],render:r=>e.jsx(a,{...r,customActions:e.jsxs(e.Fragment,{children:[e.jsx(h,{variant:"secondary",icon:e.jsx(H,{})}),e.jsx(h,{variant:"secondary",icon:e.jsx(P,{})}),e.jsx(h,{variant:"secondary",icon:e.jsx(w,{})}),e.jsxs(L,{children:[e.jsx(h,{variant:"secondary",icon:e.jsx(I,{})}),e.jsx(W,{placement:"bottom end",children:B.map(i=>e.jsx(k,{onAction:i.onClick,href:i.href,children:i.label},i.value))})]})]})})}),g=m.extend({args:{tabs:l}}),b=s.story({args:{tabs:l},render:r=>e.jsx(o,{initialEntries:["/campaigns"],children:e.jsxs(c,{children:[e.jsx(a,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/campaigns"})]}),e.jsx(t,{as:"p",children:'Notice how the "Campaigns" tab is selected (highlighted) because it matches the current path.'})]})]})})}),x=s.story({args:{tabs:l},render:r=>e.jsx(o,{initialEntries:["/integrations"],children:e.jsxs(c,{children:[e.jsx(a,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/integrations"})]}),e.jsx(t,{as:"p",children:'Notice how the "Integrations" tab is selected (highlighted) because it matches the current path.'})]})]})})}),v=s.story({args:{tabs:l},render:r=>e.jsx(o,{initialEntries:["/some-other-page"],children:e.jsxs(c,{children:[e.jsx(a,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/some-other-page"})]}),e.jsx(t,{as:"p",children:"No tab is selected because the current path doesn't match any tab's href."}),e.jsx(t,{as:"p",children:`Tabs without href (like "Overview", "Checks", "Tracks") fall back to React Aria's internal state.`})]})]})})}),f=s.story({args:{title:"Route Matching Demo",tabs:[{id:"home",label:"Home",href:"/home"},{id:"mentorship",label:"Mentorship",href:"/mentorship",matchStrategy:"prefix"},{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"settings",label:"Settings",href:"/settings"}]},render:r=>e.jsx(o,{initialEntries:["/mentorship/events"],children:e.jsxs(c,{children:[e.jsx(a,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsxs(t,{children:[`Notice how the "Mentorship" tab is active even though we're on a nested route. This is because it uses`," ",e.jsx("code",{children:'matchStrategy="prefix"'}),"."]}),e.jsx("br",{}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Home"}),": exact matching (default) - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Mentorship"}),": prefix matching - IS active (URL starts with /mentorship)"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Catalog"}),": prefix matching - not active"]}),e.jsxs(t,{children:["• ",e.jsx("strong",{children:"Settings"}),": exact matching (default) - not active"]})]})]})})}),j=s.story({args:{title:"Exact Matching Demo",tabs:[{id:"mentorship",label:"Mentorship",href:"/mentorship"},{id:"events",label:"Events",href:"/mentorship/events"},{id:"mentors",label:"Mentors",href:"/mentorship/mentors"}]},render:r=>e.jsx(o,{initialEntries:["/mentorship/events"],children:e.jsxs(c,{children:[e.jsx(a,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Current URL:"})," /mentorship/events"]}),e.jsx("br",{}),e.jsx(t,{children:'With default exact matching, only the "Events" tab is active because it exactly matches the current URL. The "Mentorship" tab is not active even though the URL is under /mentorship.'})]})]})})}),y=s.story({args:{title:"Deep Nesting Demo",tabs:[{id:"catalog",label:"Catalog",href:"/catalog",matchStrategy:"prefix"},{id:"users",label:"Users",href:"/catalog/users",matchStrategy:"prefix"},{id:"components",label:"Components",href:"/catalog/components",matchStrategy:"prefix"}]},render:r=>e.jsx(o,{initialEntries:["/catalog/users/john/details"],children:e.jsxs(c,{children:[e.jsx(a,{...r}),e.jsxs(d,{mt:"6",children:[e.jsxs(t,{as:"p",children:[e.jsx("strong",{children:"Current URL:"})," /catalog/users/john/details"]}),e.jsx("br",{}),e.jsxs(t,{as:"p",children:["Active tab is ",e.jsx("strong",{children:"Users"})," because:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Catalog"}),": Matches since URL starts with /catalog"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Users"}),': Is active since URL starts with /catalog/users, and is more specific (has more url segments) than "Catalog"']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Components"}),": not active (URL doesn't start with /catalog/components)"]})]}),e.jsx(t,{as:"p",children:"This demonstrates how prefix matching works with deeply nested routes."})]})]})})}),T=s.story({args:{title:"Service Details",breadcrumbs:[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:"my-service",href:"/services/my-service"}]},decorators:[n]}),R=s.story({args:{title:"Service Details",breadcrumbs:[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:"Page with a very long title that should truncate",href:"/services/long"},{label:"Service Details",href:"/services/long/another"}]},decorators:[n]}),S=s.story({args:{title:"Introduction",breadcrumbs:[{label:"Home",href:"/"},{label:"Docs",href:"/docs"},{label:"Guides",href:"/docs/guides"},{label:"Setup",href:"/docs/guides/setup"},{label:"Introduction",href:"/docs/guides/setup/introduction"}]},decorators:[n]}),C=s.story({args:{title:"Service Details",breadcrumbs:[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:"my-service",href:"/services/my-service"}],tabs:l},decorators:[n]}),M=s.story({args:{title:"Service Details",breadcrumbs:[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:"my-service",href:"/services/my-service"}]},decorators:[n],render:r=>e.jsx(a,{...r,customActions:e.jsxs(e.Fragment,{children:[e.jsx(h,{variant:"secondary",icon:e.jsx(w,{})}),e.jsxs(L,{children:[e.jsx(h,{variant:"secondary",icon:e.jsx(I,{})}),e.jsx(W,{placement:"bottom end",children:B.map(i=>e.jsx(k,{onAction:i.onClick,href:i.href,children:i.label},i.value))})]})]})})}),U=m.extend({args:{tabs:l,breadcrumbs:[{label:"Home",href:"/"},{label:"Docs",href:"/docs"},{label:"Guides",href:"/docs/guides"},{label:"Setup page with a very long title that should truncate at some point",href:"/docs/guides/setup"},{label:"Introduction with a very long title that should truncate at some point",href:"/docs/guides/setup/introduction"}]}});p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
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
  render: args => <TestRouter initialEntries={['/campaigns']}>
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
    </TestRouter>
})`,...b.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    tabs
  },
  render: args => <TestRouter initialEntries={['/integrations']}>
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
    </TestRouter>
})`,...x.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    tabs
  },
  render: args => <TestRouter initialEntries={['/some-other-page']}>
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
    </TestRouter>
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
  render: args => <TestRouter initialEntries={['/mentorship/events']}>
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
    </TestRouter>
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
  render: args => <TestRouter initialEntries={['/mentorship/events']}>
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
    </TestRouter>
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
  render: args => <TestRouter initialEntries={['/catalog/users/john/details']}>
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
    </TestRouter>
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
})`,...T.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...R.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
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
    }],
    tabs
  },
  decorators: [withRouter]
})`,...C.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...M.input.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`WithCustomActions.extend({
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
})`,...U.parameters?.docs?.source}}};const qe=["Default","WithTabs","WithCustomActions","WithAllOptionsAndTabs","WithMockedURLCampaigns","WithMockedURLIntegrations","WithMockedURLNoMatch","WithTabsMatchingStrategies","WithTabsExactMatching","WithTabsPrefixMatchingDeep","WithBreadcrumbs","WithBreadcrumbsWithLongSegments","WithBreadcrumbsWithMoreThanFiveSegments","WithBreadcrumbsAndTabs","WithBreadcrumbsAndCustomActions","WithBreadcrumbsAndAllOptions"];export{p as Default,g as WithAllOptionsAndTabs,T as WithBreadcrumbs,U as WithBreadcrumbsAndAllOptions,M as WithBreadcrumbsAndCustomActions,C as WithBreadcrumbsAndTabs,R as WithBreadcrumbsWithLongSegments,S as WithBreadcrumbsWithMoreThanFiveSegments,m as WithCustomActions,b as WithMockedURLCampaigns,x as WithMockedURLIntegrations,v as WithMockedURLNoMatch,u as WithTabs,j as WithTabsExactMatching,f as WithTabsMatchingStrategies,y as WithTabsPrefixMatchingDeep,qe as __namedExportsOrder};
