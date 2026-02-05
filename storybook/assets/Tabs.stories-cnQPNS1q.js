import{p as L,j as e}from"./iframe-M9O-K8SB.js";import{T as r,a as s,b as a,c as j}from"./Tabs-D0FA7CWN.js";import{M as n}from"./index-CuiKZooy.js";import{B as o}from"./Box-FY2l0ff9.js";import{T as t}from"./Text-RD33cT1s.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BXllfVt4.js";import"./useObjectRef-BPFp5snO.js";import"./clsx-B-dksMZM.js";import"./SelectionManager-AOhnTTKk.js";import"./useFocusable-BwFERnd_.js";import"./useEvent-BRbGx-1q.js";import"./SelectionIndicator-yhlvspp_.js";import"./context-Bv6kxITJ.js";import"./usePress-ByOsZuB9.js";import"./Hidden-DTd05gNK.js";import"./useControlledState-DzBnLbpE.js";import"./useListState-DtLAZGwv.js";import"./animation-D5pTcXzL.js";import"./useLabels-C3g0X61E.js";import"./useHasTabbableChild-D6MbJ94R.js";import"./useFocusRing-COnCKKka.js";import"./useStyles-BRwt6BXn.js";import"./InternalLinkProvider-Bi_DmABW.js";import"./defineComponent-BmABoWOu.js";import"./useSurface-CJaN3YoD.js";const i=L.meta({title:"Backstage UI/Tabs",component:r}),v=R=>e.jsx(n,{children:e.jsx(R,{})}),c=i.story({args:{children:""},decorators:[v],render:()=>e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"tab1",children:"Tab 1"}),e.jsx(a,{id:"tab2",children:"Tab 2"}),e.jsx(a,{id:"tab3",children:"Tab 3 With long title"})]})})}),h=i.story({args:{children:""},decorators:[v],render:()=>e.jsxs(r,{children:[e.jsxs(s,{children:[e.jsx(a,{id:"tab1",children:"Settings"}),e.jsx(a,{id:"tab2",children:"Profile"}),e.jsx(a,{id:"tab3",children:"Preferences"})]}),e.jsx(j,{id:"tab1",children:e.jsx(t,{children:"Settings panel content goes here"})}),e.jsx(j,{id:"tab2",children:e.jsx(t,{children:"Profile panel content goes here"})}),e.jsx(j,{id:"tab3",children:e.jsx(t,{children:"Preferences panel content goes here"})})]})}),b=i.story({args:{children:""},render:()=>e.jsxs(n,{initialEntries:["/tab2"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"tab1",href:"/tab1",children:"Tab 1"}),e.jsx(a,{id:"tab2",href:"/tab2",children:"Tab 2"}),e.jsx(a,{id:"tab3",href:"/tab3",children:"Tab 3 With long title"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/tab2"})]}),e.jsx(t,{as:"p",children:'Notice how the "Tab 2" tab is selected (highlighted) because it matches the current path.'})]})]})}),d=i.story({args:{children:""},render:()=>e.jsxs(n,{initialEntries:["/tab3"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"tab1",href:"/tab1",children:"Tab 1"}),e.jsx(a,{id:"tab2",href:"/tab2",children:"Tab 2"}),e.jsx(a,{id:"tab3",href:"/tab3",children:"Tab 3 With long title"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/tab3"})]}),e.jsx(t,{children:'Notice how the "Tab 3 With long title" tab is selected (highlighted) because it matches the current path.'})]})]})}),T=i.story({args:{children:""},render:()=>e.jsxs(n,{initialEntries:["/some-other-page"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"tab1",href:"/tab1",children:"Tab 1"}),e.jsx(a,{id:"tab2",href:"/tab2",children:"Tab 2"}),e.jsx(a,{id:"tab3",href:"/tab3",children:"Tab 3 With long title"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/some-other-page"})]}),e.jsx(t,{children:"No tab is selected because the current path doesn't match any tab's href."}),e.jsx(t,{children:`Tabs without href (like "Tab 1", "Tab 2", "Tab 3 With long title") fall back to React Aria's internal state.`})]})]})}),l=i.story({args:{children:""},render:()=>e.jsxs(n,{initialEntries:["/mentorship/events"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"mentorship",href:"/mentorship",children:"Mentorship"}),e.jsx(a,{id:"events",href:"/mentorship/events",children:"Events"}),e.jsx(a,{id:"catalog",href:"/catalog",children:"Catalog"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL: ",e.jsx("strong",{children:"/mentorship/events"})]}),e.jsx(t,{children:'Using default exact matching, only the "Events" tab is active because it exactly matches the URL.'}),e.jsx(t,{children:'The "Mentorship" tab is NOT active even though the URL contains "/mentorship".'})]})]})}),x=i.story({args:{children:""},render:()=>e.jsxs(n,{initialEntries:["/mentorship/events"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"mentorship",href:"/mentorship",matchStrategy:"prefix",children:"Mentorship"}),e.jsx(a,{id:"events",href:"/mentorship/events",children:"Events"}),e.jsx(a,{id:"catalog",href:"/catalog",matchStrategy:"prefix",children:"Catalog"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL: ",e.jsx("strong",{children:"/mentorship/events"})]}),e.jsx(t,{children:'The "Mentorship" tab uses prefix matching and IS active because "/mentorship/events" starts with "/mentorship".'}),e.jsx(t,{children:'The "Events" tab uses exact matching and is also active because it exactly matches.'}),e.jsx(t,{children:`The "Catalog" tab uses prefix matching but is NOT active because the URL doesn't start with "/catalog".`})]})]})}),p=i.story({args:{children:""},render:()=>e.jsxs(n,{initialEntries:["/catalog/users/john/details"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"home",href:"/home",children:"Home"}),e.jsx(a,{id:"catalog",href:"/catalog",matchStrategy:"prefix",children:"Catalog"}),e.jsx(a,{id:"mentorship",href:"/mentorship",matchStrategy:"prefix",children:"Mentorship"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL: ",e.jsx("strong",{children:"/catalog/users/john/details"})]}),e.jsx(t,{as:"p",children:'The "Catalog" tab is active because it uses prefix matching and the URL starts with "/catalog".'}),e.jsx(t,{as:"p",children:'This works for any level of nesting under "/catalog".'})]})]})}),m=i.story({args:{children:""},render:()=>e.jsxs(n,{initialEntries:["/dashboard/analytics/reports"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"overview",href:"/dashboard",children:"Overview"}),e.jsx(a,{id:"analytics",href:"/dashboard/analytics",matchStrategy:"prefix",children:"Analytics"}),e.jsx(a,{id:"settings",href:"/dashboard/settings",matchStrategy:"prefix",children:"Settings"}),e.jsx(a,{id:"help",href:"/help",children:"Help"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL: ",e.jsx("strong",{children:"/dashboard/analytics/reports"})]}),e.jsx(t,{children:`• "Overview" tab: exact matching, NOT active (doesn't exactly match "/dashboard")`}),e.jsx(t,{children:'• "Analytics" tab: prefix matching, IS active (URL starts with "/dashboard/analytics")'}),e.jsx(t,{children:`• "Settings" tab: prefix matching, NOT active (URL doesn't start with "/dashboard/settings")`}),e.jsx(t,{children:`• "Help" tab: exact matching, NOT active (doesn't exactly match "/help")`})]})]})}),g=i.story({args:{children:""},render:()=>e.jsxs(n,{initialEntries:["/foobar"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"foo",href:"/foo",matchStrategy:"prefix",children:"Foo"}),e.jsx(a,{id:"foobar",href:"/foobar",children:"Foobar"}),e.jsx(a,{id:"foo-exact",href:"/foo",children:"Foo (exact)"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL: ",e.jsx("strong",{children:"/foobar"})]}),e.jsx(t,{children:'• "Foo" tab (prefix): NOT active - prevents "/foo" from matching "/foobar"'}),e.jsx(t,{children:'• "Foobar" tab (exact): IS active - exactly matches "/foobar"'}),e.jsx(t,{children:`• "Foo (exact)" tab: NOT active - doesn't exactly match "/foobar"`}),e.jsx(t,{children:'This shows that prefix matching properly requires a "/" separator to prevent false matches.'})]})]})}),u=i.story({args:{children:""},render:()=>e.jsxs(n,{initialEntries:["/foo/bar"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"foo",href:"/foo",matchStrategy:"prefix",children:"Foo"}),e.jsx(a,{id:"foobar",href:"/foobar",children:"Foobar"}),e.jsx(a,{id:"bar",href:"/bar",matchStrategy:"prefix",children:"Bar"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL: ",e.jsx("strong",{children:"/foo/bar"})]}),e.jsx(t,{children:'• "Foo" tab (prefix): IS active - "/foo/bar" starts with "/foo/"'}),e.jsx(t,{children:`• "Foobar" tab (exact): NOT active - doesn't exactly match "/foobar"`}),e.jsx(t,{children:`• "Bar" tab (prefix): NOT active - "/foo/bar" doesn't start with "/bar"`}),e.jsx(t,{children:'This demonstrates proper prefix matching with the "/" separator.'})]})]})}),f=i.story({args:{children:""},render:()=>e.jsxs(n,{initialEntries:["/"],children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"home",href:"/",children:"Home"}),e.jsx(a,{id:"home-prefix",href:"/",matchStrategy:"prefix",children:"Home (prefix)"}),e.jsx(a,{id:"catalog",href:"/catalog",matchStrategy:"prefix",children:"Catalog"})]})}),e.jsxs(o,{mt:"6",pl:"2",children:[e.jsxs(t,{children:["Current URL: ",e.jsx("strong",{children:"/"})]}),e.jsx(t,{children:'• "Home" tab (exact): IS active - exactly matches "/"'}),e.jsx(t,{children:'• "Home (prefix)" tab: IS active - "/" matches "/"'}),e.jsx(t,{children:`• "Catalog" tab (prefix): NOT active - "/" doesn't start with "/catalog"`})]})]})}),y=i.story({args:{children:""},render:()=>e.jsx(n,{initialEntries:["/random-page"],children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsxs(t,{style:{fontSize:"16px",color:"#666"},children:["Current URL: ",e.jsx("strong",{children:"/random-page"})]}),e.jsxs(t,{children:[" ",e.jsx("strong",{children:"Case 1: Without hrefs"})]}),e.jsxs(r,{children:[e.jsxs(s,{children:[e.jsx(a,{id:"settings",children:"Settings"}),e.jsx(a,{id:"preferences",children:"Preferences"}),e.jsx(a,{id:"advanced",children:"Advanced"})]}),e.jsx(j,{id:"settings",children:e.jsx(t,{children:"Settings content - React Aria manages this selection"})}),e.jsx(j,{id:"preferences",children:e.jsx(t,{children:"Preferences content - works normally"})}),e.jsx(j,{id:"advanced",children:e.jsx(t,{children:"Advanced content - local state only"})})]}),e.jsxs(t,{children:[" ",e.jsx("strong",{children:"Case 2: With hrefs"})," By default no selection is shown because the URL doesn't match any tab's href."," "]}),e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"catalog",href:"/catalog",children:"Catalog"}),e.jsx(a,{id:"create",href:"/create",children:"Create"}),e.jsx(a,{id:"docs",href:"/docs",children:"Docs"})]})})]})})});c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const Default = () => (
  <Tabs>
    <TabList>
      <Tab id="tab1">Tab 1</Tab>
      <Tab id="tab2">Tab 2</Tab>
      <Tab id="tab3">Tab 3 With long title</Tab>
    </TabList>
  </Tabs>
);
`,...c.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const WithTabPanels = () => (
  <Tabs>
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
);
`,...h.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{code:`const WithMockedURLTab2 = () => (
  <MemoryRouter initialEntries={["/tab2"]}>
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
        Notice how the "Tab 2" tab is selected (highlighted) because it matches
        the current path.
      </Text>
    </Box>
  </MemoryRouter>
);
`,...b.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const WithMockedURLTab3 = () => (
  <MemoryRouter initialEntries={["/tab3"]}>
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
);
`,...d.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{code:`const WithMockedURLNoMatch = () => (
  <MemoryRouter initialEntries={["/some-other-page"]}>
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
        Tabs without href (like "Tab 1", "Tab 2", "Tab 3 With long title") fall
        back to React Aria's internal state.
      </Text>
    </Box>
  </MemoryRouter>
);
`,...T.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const ExactMatchingDefault = () => (
  <MemoryRouter initialEntries={["/mentorship/events"]}>
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
        Using default exact matching, only the "Events" tab is active because it
        exactly matches the URL.
      </Text>
      <Text>
        The "Mentorship" tab is NOT active even though the URL contains
        "/mentorship".
      </Text>
    </Box>
  </MemoryRouter>
);
`,...l.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const PrefixMatchingForNestedRoutes = () => (
  <MemoryRouter initialEntries={["/mentorship/events"]}>
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
        The "Catalog" tab uses prefix matching but is NOT active because the URL
        doesn't start with "/catalog".
      </Text>
    </Box>
  </MemoryRouter>
);
`,...x.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const PrefixMatchingDeepNesting = () => (
  <MemoryRouter initialEntries={["/catalog/users/john/details"]}>
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
        The "Catalog" tab is active because it uses prefix matching and the URL
        starts with "/catalog".
      </Text>
      <Text as="p">This works for any level of nesting under "/catalog".</Text>
    </Box>
  </MemoryRouter>
);
`,...p.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const MixedMatchingStrategies = () => (
  <MemoryRouter initialEntries={["/dashboard/analytics/reports"]}>
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
        • "Help" tab: exact matching, NOT active (doesn't exactly match "/help")
      </Text>
    </Box>
  </MemoryRouter>
);
`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const PrefixMatchingEdgeCases = () => (
  <MemoryRouter initialEntries={["/foobar"]}>
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
      <Text>• "Foobar" tab (exact): IS active - exactly matches "/foobar"</Text>
      <Text>
        • "Foo (exact)" tab: NOT active - doesn't exactly match "/foobar"
      </Text>
      <Text>
        This shows that prefix matching properly requires a "/" separator to
        prevent false matches.
      </Text>
    </Box>
  </MemoryRouter>
);
`,...g.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const PrefixMatchingWithSlash = () => (
  <MemoryRouter initialEntries={["/foo/bar"]}>
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
        • "Bar" tab (prefix): NOT active - "/foo/bar" doesn't start with "/bar"
      </Text>
      <Text>
        This demonstrates proper prefix matching with the "/" separator.
      </Text>
    </Box>
  </MemoryRouter>
);
`,...u.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{code:`const RootPathMatching = () => (
  <MemoryRouter initialEntries={["/"]}>
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
        • "Catalog" tab (prefix): NOT active - "/" doesn't start with "/catalog"
      </Text>
    </Box>
  </MemoryRouter>
);
`,...f.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{code:`const AutoSelectionOfTabs = () => (
  <MemoryRouter initialEntries={["/random-page"]}>
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Text style={{ fontSize: "16px", color: "#666" }}>
        Current URL: <strong>/random-page</strong>
      </Text>

      {/* Without hrefs */}
      <Text>
        {" "}
        <strong>Case 1: Without hrefs</strong>
      </Text>
      <Tabs>
        <TabList>
          <Tab id="settings">Settings</Tab>
          <Tab id="preferences">Preferences</Tab>
          <Tab id="advanced">Advanced</Tab>
        </TabList>
        <TabPanel id="settings">
          <Text>Settings content - React Aria manages this selection</Text>
        </TabPanel>
        <TabPanel id="preferences">
          <Text>Preferences content - works normally</Text>
        </TabPanel>
        <TabPanel id="advanced">
          <Text>Advanced content - local state only</Text>
        </TabPanel>
      </Tabs>

      {/* With hrefs */}
      <Text>
        {" "}
        <strong>Case 2: With hrefs</strong> By default no selection is shown
        because the URL doesn't match any tab's href.{" "}
      </Text>
      <Tabs>
        <TabList>
          <Tab id="catalog" href="/catalog">
            Catalog
          </Tab>
          <Tab id="create" href="/create">
            Create
          </Tab>
          <Tab id="docs" href="/docs">
            Docs
          </Tab>
        </TabList>
      </Tabs>
    </div>
  </MemoryRouter>
);
`,...y.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...h.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...b.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...d.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...T.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...l.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...x.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...p.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...g.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...f.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/random-page']}>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
        <Text style={{
        fontSize: '16px',
        color: '#666'
      }}>
          Current URL: <strong>/random-page</strong>
        </Text>

        {/* Without hrefs */}
        <Text>
          {' '}
          <strong>Case 1: Without hrefs</strong>
        </Text>
        <Tabs>
          <TabList>
            <Tab id="settings">Settings</Tab>
            <Tab id="preferences">Preferences</Tab>
            <Tab id="advanced">Advanced</Tab>
          </TabList>
          <TabPanel id="settings">
            <Text>Settings content - React Aria manages this selection</Text>
          </TabPanel>
          <TabPanel id="preferences">
            <Text>Preferences content - works normally</Text>
          </TabPanel>
          <TabPanel id="advanced">
            <Text>Advanced content - local state only</Text>
          </TabPanel>
        </Tabs>

        {/* With hrefs */}
        <Text>
          {' '}
          <strong>Case 2: With hrefs</strong> By default no selection is shown
          because the URL doesn't match any tab's href.{' '}
        </Text>
        <Tabs>
          <TabList>
            <Tab id="catalog" href="/catalog">
              Catalog
            </Tab>
            <Tab id="create" href="/create">
              Create
            </Tab>
            <Tab id="docs" href="/docs">
              Docs
            </Tab>
          </TabList>
        </Tabs>
      </div>
    </MemoryRouter>
})`,...y.input.parameters?.docs?.source}}};const Y=["Default","WithTabPanels","WithMockedURLTab2","WithMockedURLTab3","WithMockedURLNoMatch","ExactMatchingDefault","PrefixMatchingForNestedRoutes","PrefixMatchingDeepNesting","MixedMatchingStrategies","PrefixMatchingEdgeCases","PrefixMatchingWithSlash","RootPathMatching","AutoSelectionOfTabs"];export{y as AutoSelectionOfTabs,c as Default,l as ExactMatchingDefault,m as MixedMatchingStrategies,p as PrefixMatchingDeepNesting,g as PrefixMatchingEdgeCases,x as PrefixMatchingForNestedRoutes,u as PrefixMatchingWithSlash,f as RootPathMatching,T as WithMockedURLNoMatch,b as WithMockedURLTab2,d as WithMockedURLTab3,h as WithTabPanels,Y as __namedExportsOrder};
