import{j as e}from"./jsx-runtime-hv06LKfz.js";import{T as r,a as s,b as a,c as j}from"./Tabs-DiJgBOHw.js";import{B as o}from"./Box-BVb6FGyq.js";import{T as t}from"./Text-C2hFegYR.js";import{M as i}from"./index-B7KODvs-.js";import"./index-D8-PC79C.js";import"./Collection-ep6p65Wv.js";import"./Hidden-Bl3CD3Sw.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useFocusRing-CSBfGNH9.js";import"./utils-SVxEJA3c.js";import"./clsx-B-dksMZM.js";import"./usePress-BiO5y4q0.js";import"./FocusScope-8zIF1xgC.js";import"./context-C8UuisDZ.js";import"./useControlledState-hFzvQclK.js";import"./useLabels-CXdioV2U.js";import"./useStyles-Dc-DqJ_c.js";import"./spacing.props-m9PQeFPu.js";const q={title:"Backstage UI/Tabs",component:r},u=v=>e.jsx(i,{children:e.jsx(v,{})}),n={args:{children:""},decorators:[u],render:()=>e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"tab1",children:"Tab 1"}),e.jsx(a,{id:"tab2",children:"Tab 2"}),e.jsx(a,{id:"tab3",children:"Tab 3 With long title"})]})})},c={args:{children:""},decorators:[u],render:()=>e.jsxs(r,{children:[e.jsxs(s,{children:[e.jsx(a,{id:"tab1",children:"Settings"}),e.jsx(a,{id:"tab2",children:"Profile"}),e.jsx(a,{id:"tab3",children:"Preferences"})]}),e.jsx(j,{id:"tab1",children:e.jsx(t,{children:"Settings panel content goes here"})}),e.jsx(j,{id:"tab2",children:e.jsx(t,{children:"Profile panel content goes here"})}),e.jsx(j,{id:"tab3",children:e.jsx(t,{children:"Preferences panel content goes here"})})]})},h={args:{children:""},render:()=>e.jsxs(i,{initialEntries:["/tab2"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"tab1",href:"/tab1",children:"Tab 1"}),e.jsx(a,{id:"tab2",href:"/tab2",children:"Tab 2"}),e.jsx(a,{id:"tab3",href:"/tab3",children:"Tab 3 With long title"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/tab2"})]}),e.jsx(t,{as:"p",children:'Notice how the "Tab 2" tab is selected (highlighted) because it matches the current path.'})]})]})},d={args:{children:""},render:()=>e.jsxs(i,{initialEntries:["/tab3"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"tab1",href:"/tab1",children:"Tab 1"}),e.jsx(a,{id:"tab2",href:"/tab2",children:"Tab 2"}),e.jsx(a,{id:"tab3",href:"/tab3",children:"Tab 3 With long title"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/tab3"})]}),e.jsx(t,{children:'Notice how the "Tab 3 With long title" tab is selected (highlighted) because it matches the current path.'})]})]})},l={args:{children:""},render:()=>e.jsxs(i,{initialEntries:["/some-other-page"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"tab1",href:"/tab1",children:"Tab 1"}),e.jsx(a,{id:"tab2",href:"/tab2",children:"Tab 2"}),e.jsx(a,{id:"tab3",href:"/tab3",children:"Tab 3 With long title"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/some-other-page"})]}),e.jsx(t,{children:"No tab is selected because the current path doesn't match any tab's href."}),e.jsx(t,{children:`Tabs without href (like "Tab 1", "Tab 2", "Tab 3 With long title") fall back to React Aria's internal state.`})]})]})},b={args:{children:""},render:()=>e.jsxs(i,{initialEntries:["/mentorship/events"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"mentorship",href:"/mentorship",children:"Mentorship"}),e.jsx(a,{id:"events",href:"/mentorship/events",children:"Events"}),e.jsx(a,{id:"catalog",href:"/catalog",children:"Catalog"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL: ",e.jsx("strong",{children:"/mentorship/events"})]}),e.jsx(t,{children:'Using default exact matching, only the "Events" tab is active because it exactly matches the URL.'}),e.jsx(t,{children:'The "Mentorship" tab is NOT active even though the URL contains "/mentorship".'})]})]})},x={args:{children:""},render:()=>e.jsxs(i,{initialEntries:["/mentorship/events"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"mentorship",href:"/mentorship",matchStrategy:"prefix",children:"Mentorship"}),e.jsx(a,{id:"events",href:"/mentorship/events",children:"Events"}),e.jsx(a,{id:"catalog",href:"/catalog",matchStrategy:"prefix",children:"Catalog"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL: ",e.jsx("strong",{children:"/mentorship/events"})]}),e.jsx(t,{children:'The "Mentorship" tab uses prefix matching and IS active because "/mentorship/events" starts with "/mentorship".'}),e.jsx(t,{children:'The "Events" tab uses exact matching and is also active because it exactly matches.'}),e.jsx(t,{children:`The "Catalog" tab uses prefix matching but is NOT active because the URL doesn't start with "/catalog".`})]})]})},T={args:{children:""},render:()=>e.jsxs(i,{initialEntries:["/catalog/users/john/details"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"home",href:"/home",children:"Home"}),e.jsx(a,{id:"catalog",href:"/catalog",matchStrategy:"prefix",children:"Catalog"}),e.jsx(a,{id:"mentorship",href:"/mentorship",matchStrategy:"prefix",children:"Mentorship"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL: ",e.jsx("strong",{children:"/catalog/users/john/details"})]}),e.jsx(t,{as:"p",children:'The "Catalog" tab is active because it uses prefix matching and the URL starts with "/catalog".'}),e.jsx(t,{as:"p",children:'This works for any level of nesting under "/catalog".'})]})]})},m={args:{children:""},render:()=>e.jsxs(i,{initialEntries:["/dashboard/analytics/reports"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"overview",href:"/dashboard",children:"Overview"}),e.jsx(a,{id:"analytics",href:"/dashboard/analytics",matchStrategy:"prefix",children:"Analytics"}),e.jsx(a,{id:"settings",href:"/dashboard/settings",matchStrategy:"prefix",children:"Settings"}),e.jsx(a,{id:"help",href:"/help",children:"Help"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL: ",e.jsx("strong",{children:"/dashboard/analytics/reports"})]}),e.jsx(t,{children:`• "Overview" tab: exact matching, NOT active (doesn't exactly match "/dashboard")`}),e.jsx(t,{children:'• "Analytics" tab: prefix matching, IS active (URL starts with "/dashboard/analytics")'}),e.jsx(t,{children:`• "Settings" tab: prefix matching, NOT active (URL doesn't start with "/dashboard/settings")`}),e.jsx(t,{children:`• "Help" tab: exact matching, NOT active (doesn't exactly match "/help")`})]})]})},p={args:{children:""},render:()=>e.jsxs(i,{initialEntries:["/foobar"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"foo",href:"/foo",matchStrategy:"prefix",children:"Foo"}),e.jsx(a,{id:"foobar",href:"/foobar",children:"Foobar"}),e.jsx(a,{id:"foo-exact",href:"/foo",children:"Foo (exact)"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL: ",e.jsx("strong",{children:"/foobar"})]}),e.jsx(t,{children:'• "Foo" tab (prefix): NOT active - prevents "/foo" from matching "/foobar"'}),e.jsx(t,{children:'• "Foobar" tab (exact): IS active - exactly matches "/foobar"'}),e.jsx(t,{children:`• "Foo (exact)" tab: NOT active - doesn't exactly match "/foobar"`}),e.jsx(t,{children:'This shows that prefix matching properly requires a "/" separator to prevent false matches.'})]})]})},g={args:{children:""},render:()=>e.jsxs(i,{initialEntries:["/foo/bar"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"foo",href:"/foo",matchStrategy:"prefix",children:"Foo"}),e.jsx(a,{id:"foobar",href:"/foobar",children:"Foobar"}),e.jsx(a,{id:"bar",href:"/bar",matchStrategy:"prefix",children:"Bar"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL: ",e.jsx("strong",{children:"/foo/bar"})]}),e.jsx(t,{children:'• "Foo" tab (prefix): IS active - "/foo/bar" starts with "/foo/"'}),e.jsx(t,{children:`• "Foobar" tab (exact): NOT active - doesn't exactly match "/foobar"`}),e.jsx(t,{children:`• "Bar" tab (prefix): NOT active - "/foo/bar" doesn't start with "/bar"`}),e.jsx(t,{children:'This demonstrates proper prefix matching with the "/" separator.'})]})]})},f={args:{children:""},render:()=>e.jsxs(i,{initialEntries:["/"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"home",href:"/",children:"Home"}),e.jsx(a,{id:"home-prefix",href:"/",matchStrategy:"prefix",children:"Home (prefix)"}),e.jsx(a,{id:"catalog",href:"/catalog",matchStrategy:"prefix",children:"Catalog"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL: ",e.jsx("strong",{children:"/"})]}),e.jsx(t,{children:'• "Home" tab (exact): IS active - exactly matches "/"'}),e.jsx(t,{children:'• "Home (prefix)" tab: IS active - "/" matches "/"'}),e.jsx(t,{children:`• "Catalog" tab (prefix): NOT active - "/" doesn't start with "/catalog"`})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: ''
  },
  decorators: [withRouter],
  render: () => <Tabs>
      <TabList>
        <Tab id="tab1">Tab 1</Tab>
        <Tab id="tab2">Tab 2</Tab>
        <Tab id="tab3">Tab 3 With long title</Tab>
      </TabList>
    </Tabs>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: ''
  },
  decorators: [withRouter],
  render: () => <Tabs>
      <TabList>
        <Tab id="tab1">Settings</Tab>
        <Tab id="tab2">Profile</Tab>
        <Tab id="tab3">Preferences</Tab>
      </TabList>
      <TabPanel id="tab1">
        <Text>Settings panel content goes here</Text>
      </TabPanel>
      <TabPanel id="tab2">
        <Text>Profile panel content goes here</Text>
      </TabPanel>
      <TabPanel id="tab3">
        <Text>Preferences panel content goes here</Text>
      </TabPanel>
    </Tabs>
}`,...c.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/tab2']}>
      <Tabs>
        <TabList>
          <Tab id="tab1" href="/tab1">
            Tab 1
          </Tab>
          <Tab id="tab2" href="/tab2">
            Tab 2
          </Tab>
          <Tab id="tab3" href="/tab3">
            Tab 3 With long title
          </Tab>
        </TabList>
      </Tabs>
      <Box mt="6" pl="2">
        <Text as="p">
          Current URL is mocked to be: <strong>/tab2</strong>
        </Text>
        <Text as="p">
          Notice how the "Tab 2" tab is selected (highlighted) because it
          matches the current path.
        </Text>
      </Box>
    </MemoryRouter>
}`,...h.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/tab3']}>
      <Tabs>
        <TabList>
          <Tab id="tab1" href="/tab1">
            Tab 1
          </Tab>
          <Tab id="tab2" href="/tab2">
            Tab 2
          </Tab>
          <Tab id="tab3" href="/tab3">
            Tab 3 With long title
          </Tab>
        </TabList>
      </Tabs>
      <Box mt="6" pl="2">
        <Text>
          Current URL is mocked to be: <strong>/tab3</strong>
        </Text>
        <Text>
          Notice how the "Tab 3 With long title" tab is selected (highlighted)
          because it matches the current path.
        </Text>
      </Box>
    </MemoryRouter>
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/some-other-page']}>
      <Tabs>
        <TabList>
          <Tab id="tab1" href="/tab1">
            Tab 1
          </Tab>
          <Tab id="tab2" href="/tab2">
            Tab 2
          </Tab>
          <Tab id="tab3" href="/tab3">
            Tab 3 With long title
          </Tab>
        </TabList>
      </Tabs>
      <Box mt="6" pl="2">
        <Text>
          Current URL is mocked to be: <strong>/some-other-page</strong>
        </Text>
        <Text>
          No tab is selected because the current path doesn't match any tab's
          href.
        </Text>
        <Text>
          Tabs without href (like "Tab 1", "Tab 2", "Tab 3 With long title")
          fall back to React Aria's internal state.
        </Text>
      </Box>
    </MemoryRouter>
}`,...l.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/mentorship/events']}>
      <Tabs>
        <TabList>
          <Tab id="mentorship" href="/mentorship">
            Mentorship
          </Tab>
          <Tab id="events" href="/mentorship/events">
            Events
          </Tab>
          <Tab id="catalog" href="/catalog">
            Catalog
          </Tab>
        </TabList>
      </Tabs>
      <Box mt="6" pl="2">
        <Text>
          Current URL: <strong>/mentorship/events</strong>
        </Text>
        <Text>
          Using default exact matching, only the "Events" tab is active because
          it exactly matches the URL.
        </Text>
        <Text>
          The "Mentorship" tab is NOT active even though the URL contains
          "/mentorship".
        </Text>
      </Box>
    </MemoryRouter>
}`,...b.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/mentorship/events']}>
      <Tabs>
        <TabList>
          <Tab id="mentorship" href="/mentorship" matchStrategy="prefix">
            Mentorship
          </Tab>
          <Tab id="events" href="/mentorship/events">
            Events
          </Tab>
          <Tab id="catalog" href="/catalog" matchStrategy="prefix">
            Catalog
          </Tab>
        </TabList>
      </Tabs>
      <Box mt="6" pl="2">
        <Text>
          Current URL: <strong>/mentorship/events</strong>
        </Text>
        <Text>
          The "Mentorship" tab uses prefix matching and IS active because
          "/mentorship/events" starts with "/mentorship".
        </Text>
        <Text>
          The "Events" tab uses exact matching and is also active because it
          exactly matches.
        </Text>
        <Text>
          The "Catalog" tab uses prefix matching but is NOT active because the
          URL doesn't start with "/catalog".
        </Text>
      </Box>
    </MemoryRouter>
}`,...x.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/catalog/users/john/details']}>
      <Tabs>
        <TabList>
          <Tab id="home" href="/home">
            Home
          </Tab>
          <Tab id="catalog" href="/catalog" matchStrategy="prefix">
            Catalog
          </Tab>
          <Tab id="mentorship" href="/mentorship" matchStrategy="prefix">
            Mentorship
          </Tab>
        </TabList>
      </Tabs>
      <Box mt="6" pl="2">
        <Text as="p">
          Current URL: <strong>/catalog/users/john/details</strong>
        </Text>
        <Text as="p">
          The "Catalog" tab is active because it uses prefix matching and the
          URL starts with "/catalog".
        </Text>
        <Text as="p">
          This works for any level of nesting under "/catalog".
        </Text>
      </Box>
    </MemoryRouter>
}`,...T.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/dashboard/analytics/reports']}>
      <Tabs>
        <TabList>
          <Tab id="overview" href="/dashboard">
            Overview
          </Tab>
          <Tab id="analytics" href="/dashboard/analytics" matchStrategy="prefix">
            Analytics
          </Tab>
          <Tab id="settings" href="/dashboard/settings" matchStrategy="prefix">
            Settings
          </Tab>
          <Tab id="help" href="/help">
            Help
          </Tab>
        </TabList>
      </Tabs>
      <Box mt="6" pl="2">
        <Text>
          Current URL: <strong>/dashboard/analytics/reports</strong>
        </Text>
        <Text>
          • "Overview" tab: exact matching, NOT active (doesn't exactly match
          "/dashboard")
        </Text>
        <Text>
          • "Analytics" tab: prefix matching, IS active (URL starts with
          "/dashboard/analytics")
        </Text>
        <Text>
          • "Settings" tab: prefix matching, NOT active (URL doesn't start with
          "/dashboard/settings")
        </Text>
        <Text>
          • "Help" tab: exact matching, NOT active (doesn't exactly match
          "/help")
        </Text>
      </Box>
    </MemoryRouter>
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/foobar']}>
      <Tabs>
        <TabList>
          <Tab id="foo" href="/foo" matchStrategy="prefix">
            Foo
          </Tab>
          <Tab id="foobar" href="/foobar">
            Foobar
          </Tab>
          <Tab id="foo-exact" href="/foo">
            Foo (exact)
          </Tab>
        </TabList>
      </Tabs>
      <Box mt="6" pl="2">
        <Text>
          Current URL: <strong>/foobar</strong>
        </Text>
        <Text>
          • "Foo" tab (prefix): NOT active - prevents "/foo" from matching
          "/foobar"
        </Text>
        <Text>
          • "Foobar" tab (exact): IS active - exactly matches "/foobar"
        </Text>
        <Text>
          • "Foo (exact)" tab: NOT active - doesn't exactly match "/foobar"
        </Text>
        <Text>
          This shows that prefix matching properly requires a "/" separator to
          prevent false matches.
        </Text>
      </Box>
    </MemoryRouter>
}`,...p.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/foo/bar']}>
      <Tabs>
        <TabList>
          <Tab id="foo" href="/foo" matchStrategy="prefix">
            Foo
          </Tab>
          <Tab id="foobar" href="/foobar">
            Foobar
          </Tab>
          <Tab id="bar" href="/bar" matchStrategy="prefix">
            Bar
          </Tab>
        </TabList>
      </Tabs>
      <Box mt="6" pl="2">
        <Text>
          Current URL: <strong>/foo/bar</strong>
        </Text>
        <Text>
          • "Foo" tab (prefix): IS active - "/foo/bar" starts with "/foo/"
        </Text>
        <Text>
          • "Foobar" tab (exact): NOT active - doesn't exactly match "/foobar"
        </Text>
        <Text>
          • "Bar" tab (prefix): NOT active - "/foo/bar" doesn't start with
          "/bar"
        </Text>
        <Text>
          This demonstrates proper prefix matching with the "/" separator.
        </Text>
      </Box>
    </MemoryRouter>
}`,...g.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/']}>
      <Tabs>
        <TabList>
          <Tab id="home" href="/">
            Home
          </Tab>
          <Tab id="home-prefix" href="/" matchStrategy="prefix">
            Home (prefix)
          </Tab>
          <Tab id="catalog" href="/catalog" matchStrategy="prefix">
            Catalog
          </Tab>
        </TabList>
      </Tabs>
      <Box mt="6" pl="2">
        <Text>
          Current URL: <strong>/</strong>
        </Text>
        <Text>• "Home" tab (exact): IS active - exactly matches "/"</Text>
        <Text>• "Home (prefix)" tab: IS active - "/" matches "/"</Text>
        <Text>
          • "Catalog" tab (prefix): NOT active - "/" doesn't start with
          "/catalog"
        </Text>
      </Box>
    </MemoryRouter>
}`,...f.parameters?.docs?.source}}};const _=["Default","WithTabPanels","WithMockedURLTab2","WithMockedURLTab3","WithMockedURLNoMatch","ExactMatchingDefault","PrefixMatchingForNestedRoutes","PrefixMatchingDeepNesting","MixedMatchingStrategies","PrefixMatchingEdgeCases","PrefixMatchingWithSlash","RootPathMatching"];export{n as Default,b as ExactMatchingDefault,m as MixedMatchingStrategies,T as PrefixMatchingDeepNesting,p as PrefixMatchingEdgeCases,x as PrefixMatchingForNestedRoutes,g as PrefixMatchingWithSlash,f as RootPathMatching,l as WithMockedURLNoMatch,h as WithMockedURLTab2,d as WithMockedURLTab3,c as WithTabPanels,_ as __namedExportsOrder,q as default};
