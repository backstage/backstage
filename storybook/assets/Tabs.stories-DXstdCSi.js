import{bR as e,w as o,i as c,c7 as I,ca as P}from"./iframe-Bm5ba6Eo.js";import{c as r,a as s,T as a,b as h}from"./Tabs-BjoLDB9B.js";import{B as n}from"./BUIProvider-BToDF3TK.js";import{T as t}from"./Text-BSflCEKy.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-6JHcszxz.js";import"./useObjectRef--OGAdRX4.js";import"./useCollection-HldmDXHz.js";import"./useFocusRing-pVGFXoDo.js";import"./openLink-B3PKQziN.js";import"./Hidden-BsS8bYU7.js";import"./keyboard-CfEZ52uC.js";import"./FocusScope-CR1y382h.js";import"./useEvent-BsoZAZmF.js";import"./I18nProvider-Bs_Dburj.js";import"./usePress-CKNoHEcf.js";import"./textSelection-B3oHrBsf.js";import"./useControlledState-C1wfIORH.js";import"./useHasTabbableChild-CYOVVKvA.js";import"./useLabels-BjdHlKX9.js";import"./useListState-Dhevo4OT.js";import"./animation-BfQmUzHQ.js";import"./useHover-BTqfxkN_.js";import"./getNodeText-CnYVy7Xh.js";import"./useResolvedHref-DYKBvNag.js";const i=I.meta({title:"Backstage UI/Tabs",component:r}),U=S=>e.jsx(o,{children:e.jsx(n,{children:e.jsx(S,{})})}),d=i.story({args:{children:""},decorators:[U],render:()=>e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"tab1",children:"Tab 1"}),e.jsx(a,{id:"tab2",children:"Tab 2"}),e.jsx(a,{id:"tab3",children:"Tab 3 With long title"})]})})}),l=i.story({args:{children:""},decorators:[U],render:()=>e.jsxs(r,{children:[e.jsxs(s,{children:[e.jsx(a,{id:"tab1",children:"Settings"}),e.jsx(a,{id:"tab2",children:"Profile"}),e.jsx(a,{id:"tab3",children:"Preferences"})]}),e.jsx(h,{id:"tab1",children:e.jsx(t,{children:"Settings panel content goes here"})}),e.jsx(h,{id:"tab2",children:e.jsx(t,{children:"Profile panel content goes here"})}),e.jsx(h,{id:"tab3",children:e.jsx(t,{children:"Preferences panel content goes here"})})]})}),b=i.story({args:{children:""},render:()=>e.jsx(o,{initialEntries:["/tab2"],children:e.jsxs(n,{children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"tab1",href:"/tab1",children:"Tab 1"}),e.jsx(a,{id:"tab2",href:"/tab2",children:"Tab 2"}),e.jsx(a,{id:"tab3",href:"/tab3",children:"Tab 3 With long title"})]})}),e.jsxs(c,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/tab2"})]}),e.jsx(t,{as:"p",children:'Notice how the "Tab 2" tab is selected (highlighted) because it matches the current path.'})]})]})})}),x=i.story({args:{children:""},render:()=>e.jsx(o,{initialEntries:["/tab3"],children:e.jsxs(n,{children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"tab1",href:"/tab1",children:"Tab 1"}),e.jsx(a,{id:"tab2",href:"/tab2",children:"Tab 2"}),e.jsx(a,{id:"tab3",href:"/tab3",children:"Tab 3 With long title"})]})}),e.jsxs(c,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/tab3"})]}),e.jsx(t,{as:"p",children:'Notice how the "Tab 3 With long title" tab is selected (highlighted) because it matches the current path.'})]})]})})}),p=i.story({args:{children:""},render:()=>e.jsx(o,{initialEntries:["/some-other-page"],children:e.jsxs(n,{children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"tab1",href:"/tab1",children:"Tab 1"}),e.jsx(a,{id:"tab2",href:"/tab2",children:"Tab 2"}),e.jsx(a,{id:"tab3",href:"/tab3",children:"Tab 3 With long title"})]})}),e.jsxs(c,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL is mocked to be: ",e.jsx("strong",{children:"/some-other-page"})]}),e.jsx(t,{as:"p",children:"No tab is selected because the current path doesn't match any tab's href."}),e.jsx(t,{as:"p",children:`Tabs without href (like "Tab 1", "Tab 2", "Tab 3 With long title") fall back to React Aria's internal state.`})]})]})})}),T=i.story({args:{children:""},render:()=>e.jsx(o,{initialEntries:["/mentorship/events"],children:e.jsxs(n,{children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"mentorship",href:"/mentorship",children:"Mentorship"}),e.jsx(a,{id:"events",href:"/mentorship/events",children:"Events"}),e.jsx(a,{id:"catalog",href:"/catalog",children:"Catalog"})]})}),e.jsxs(c,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL: ",e.jsx("strong",{children:"/mentorship/events"})]}),e.jsx(t,{as:"p",children:'Using default exact matching, only the "Events" tab is active because it exactly matches the URL.'}),e.jsx(t,{as:"p",children:'The "Mentorship" tab is NOT active even though the URL contains "/mentorship".'})]})]})})}),m=i.story({args:{children:""},render:()=>e.jsx(o,{initialEntries:["/mentorship/events"],children:e.jsxs(n,{children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"mentorship",href:"/mentorship",matchStrategy:"prefix",children:"Mentorship"}),e.jsx(a,{id:"events",href:"/mentorship/events",children:"Events"}),e.jsx(a,{id:"catalog",href:"/catalog",matchStrategy:"prefix",children:"Catalog"})]})}),e.jsxs(c,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL: ",e.jsx("strong",{children:"/mentorship/events"})]}),e.jsx(t,{as:"p",children:'The "Mentorship" tab uses prefix matching and IS active because "/mentorship/events" starts with "/mentorship".'}),e.jsx(t,{as:"p",children:'The "Events" tab uses exact matching and is also active because it exactly matches.'}),e.jsx(t,{as:"p",children:`The "Catalog" tab uses prefix matching but is NOT active because the URL doesn't start with "/catalog".`})]})]})})}),g=i.story({args:{children:""},render:()=>e.jsx(o,{initialEntries:["/catalog/users/john/details"],children:e.jsxs(n,{children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"home",href:"/home",children:"Home"}),e.jsx(a,{id:"catalog",href:"/catalog",matchStrategy:"prefix",children:"Catalog"}),e.jsx(a,{id:"mentorship",href:"/mentorship",matchStrategy:"prefix",children:"Mentorship"})]})}),e.jsxs(c,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL: ",e.jsx("strong",{children:"/catalog/users/john/details"})]}),e.jsx(t,{as:"p",children:'The "Catalog" tab is active because it uses prefix matching and the URL starts with "/catalog".'}),e.jsx(t,{as:"p",children:'This works for any level of nesting under "/catalog".'})]})]})})}),u=i.story({args:{children:""},render:()=>e.jsx(o,{initialEntries:["/dashboard/analytics/reports"],children:e.jsxs(n,{children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"overview",href:"/dashboard",children:"Overview"}),e.jsx(a,{id:"analytics",href:"/dashboard/analytics",matchStrategy:"prefix",children:"Analytics"}),e.jsx(a,{id:"settings",href:"/dashboard/settings",matchStrategy:"prefix",children:"Settings"}),e.jsx(a,{id:"help",href:"/help",children:"Help"})]})}),e.jsxs(c,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL: ",e.jsx("strong",{children:"/dashboard/analytics/reports"})]}),e.jsx(t,{as:"p",children:`• "Overview" tab: exact matching, NOT active (doesn't exactly match "/dashboard")`}),e.jsx(t,{as:"p",children:'• "Analytics" tab: prefix matching, IS active (URL starts with "/dashboard/analytics")'}),e.jsx(t,{as:"p",children:`• "Settings" tab: prefix matching, NOT active (URL doesn't start with "/dashboard/settings")`}),e.jsx(t,{as:"p",children:`• "Help" tab: exact matching, NOT active (doesn't exactly match "/help")`})]})]})})}),f=i.story({args:{children:""},render:()=>e.jsx(o,{initialEntries:["/foobar"],children:e.jsxs(n,{children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"foo",href:"/foo",matchStrategy:"prefix",children:"Foo"}),e.jsx(a,{id:"foobar",href:"/foobar",children:"Foobar"}),e.jsx(a,{id:"foo-exact",href:"/foo",children:"Foo (exact)"})]})}),e.jsxs(c,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL: ",e.jsx("strong",{children:"/foobar"})]}),e.jsx(t,{as:"p",children:'• "Foo" tab (prefix): NOT active - prevents "/foo" from matching "/foobar"'}),e.jsx(t,{as:"p",children:'• "Foobar" tab (exact): IS active - exactly matches "/foobar"'}),e.jsx(t,{as:"p",children:`• "Foo (exact)" tab: NOT active - doesn't exactly match "/foobar"`}),e.jsx(t,{as:"p",children:'This shows that prefix matching properly requires a "/" separator to prevent false matches.'})]})]})})}),j=i.story({args:{children:""},render:()=>e.jsx(o,{initialEntries:["/foo/bar"],children:e.jsxs(n,{children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"foo",href:"/foo",matchStrategy:"prefix",children:"Foo"}),e.jsx(a,{id:"foobar",href:"/foobar",children:"Foobar"}),e.jsx(a,{id:"bar",href:"/bar",matchStrategy:"prefix",children:"Bar"})]})}),e.jsxs(c,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL: ",e.jsx("strong",{children:"/foo/bar"})]}),e.jsx(t,{as:"p",children:'• "Foo" tab (prefix): IS active - "/foo/bar" starts with "/foo/"'}),e.jsx(t,{as:"p",children:`• "Foobar" tab (exact): NOT active - doesn't exactly match "/foobar"`}),e.jsx(t,{as:"p",children:`• "Bar" tab (prefix): NOT active - "/foo/bar" doesn't start with "/bar"`}),e.jsx(t,{as:"p",children:'This demonstrates proper prefix matching with the "/" separator.'})]})]})})}),y=i.story({args:{children:""},render:()=>e.jsx(o,{initialEntries:["/"],children:e.jsxs(n,{children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"home",href:"/",children:"Home"}),e.jsx(a,{id:"home-prefix",href:"/",matchStrategy:"prefix",children:"Home (prefix)"}),e.jsx(a,{id:"catalog",href:"/catalog",matchStrategy:"prefix",children:"Catalog"})]})}),e.jsxs(c,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL: ",e.jsx("strong",{children:"/"})]}),e.jsx(t,{as:"p",children:'• "Home" tab (exact): IS active - exactly matches "/"'}),e.jsx(t,{as:"p",children:'• "Home (prefix)" tab: IS active - "/" matches "/"'}),e.jsx(t,{as:"p",children:`• "Catalog" tab (prefix): NOT active - "/" doesn't start with "/catalog"`})]})]})})}),v=i.story({args:{children:""},render:()=>e.jsx(o,{initialEntries:["/cost-insights/dashboard?group=bar"],children:e.jsxs(n,{children:[e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"dashboard",href:"/cost-insights/dashboard?group=foo",matchStrategy:"prefix",children:"Dashboard"}),e.jsx(a,{id:"alerts",href:"/cost-insights/alerts?group=foo",matchStrategy:"prefix",children:"Alerts"})]})}),e.jsxs(c,{mt:"6",pl:"2",children:[e.jsxs(t,{as:"p",children:["Current URL: ",e.jsx("strong",{children:"/cost-insights/dashboard?group=bar"})]}),e.jsx(t,{as:"p",children:"Tab hrefs include query params (e.g., ?group=foo) but the current URL has different query params (?group=bar)."}),e.jsx(t,{as:"p",children:'• "Dashboard" tab: IS active — matching ignores query params and compares only the pathname.'}),e.jsx(t,{as:"p",children:`• "Alerts" tab: NOT active — pathname /cost-insights/alerts doesn't match /cost-insights/dashboard.`})]})]})})}),M=["Short","A Medium Length Title","An Extremely Long Tab Title Here"];function E(){const[S,B]=P.useState(0);return P.useEffect(()=>{const C=setInterval(()=>B(w=>(w+1)%M.length),1e3);return()=>clearInterval(C)},[]),e.jsx(e.Fragment,{children:M[S]})}const L=i.story({args:{children:""},decorators:[U],render:()=>e.jsxs(r,{children:[e.jsxs(s,{children:[e.jsx(a,{id:"tab1",children:"First"}),e.jsx(a,{id:"tab2",children:e.jsx(E,{})}),e.jsx(a,{id:"tab3",children:"Last"})]}),e.jsx(h,{id:"tab1",children:e.jsx(t,{children:"First tab content"})}),e.jsx(h,{id:"tab2",children:e.jsx(t,{children:"Middle tab content — its title cycles every second"})}),e.jsx(h,{id:"tab3",children:e.jsx(t,{children:"Last tab content"})})]})}),R=i.story({args:{children:""},render:()=>e.jsx(o,{initialEntries:["/random-page"],children:e.jsx(n,{children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsxs(t,{style:{fontSize:"16px",color:"#666"},children:["Current URL: ",e.jsx("strong",{children:"/random-page"})]}),e.jsxs(t,{children:[" ",e.jsx("strong",{children:"Case 1: Without hrefs"})]}),e.jsxs(r,{children:[e.jsxs(s,{children:[e.jsx(a,{id:"settings",children:"Settings"}),e.jsx(a,{id:"preferences",children:"Preferences"}),e.jsx(a,{id:"advanced",children:"Advanced"})]}),e.jsx(h,{id:"settings",children:e.jsx(t,{children:"Settings content - React Aria manages this selection"})}),e.jsx(h,{id:"preferences",children:e.jsx(t,{children:"Preferences content - works normally"})}),e.jsx(h,{id:"advanced",children:e.jsx(t,{children:"Advanced content - local state only"})})]}),e.jsx(t,{as:"p",children:e.jsx("strong",{children:"Case 2: With hrefs"})}),e.jsx(t,{as:"p",children:"By default no selection is shown because the URL doesn't match any tab's href."}),e.jsx(r,{children:e.jsxs(s,{children:[e.jsx(a,{id:"catalog",href:"/catalog",children:"Catalog"}),e.jsx(a,{id:"create",href:"/create",children:"Create"}),e.jsx(a,{id:"docs",href:"/docs",children:"Docs"})]})})]})})})});d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...d.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...l.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/tab2']}>
      <BUIProvider>
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
      </BUIProvider>
    </MemoryRouter>
})`,...b.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/tab3']}>
      <BUIProvider>
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
            Current URL is mocked to be: <strong>/tab3</strong>
          </Text>
          <Text as="p">
            Notice how the "Tab 3 With long title" tab is selected (highlighted)
            because it matches the current path.
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
})`,...x.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/some-other-page']}>
      <BUIProvider>
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
            Current URL is mocked to be: <strong>/some-other-page</strong>
          </Text>
          <Text as="p">
            No tab is selected because the current path doesn't match any tab's
            href.
          </Text>
          <Text as="p">
            Tabs without href (like "Tab 1", "Tab 2", "Tab 3 With long title")
            fall back to React Aria's internal state.
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
})`,...p.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/mentorship/events']}>
      <BUIProvider>
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
          <Text as="p">
            Current URL: <strong>/mentorship/events</strong>
          </Text>
          <Text as="p">
            Using default exact matching, only the "Events" tab is active
            because it exactly matches the URL.
          </Text>
          <Text as="p">
            The "Mentorship" tab is NOT active even though the URL contains
            "/mentorship".
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
})`,...T.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/mentorship/events']}>
      <BUIProvider>
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
          <Text as="p">
            Current URL: <strong>/mentorship/events</strong>
          </Text>
          <Text as="p">
            The "Mentorship" tab uses prefix matching and IS active because
            "/mentorship/events" starts with "/mentorship".
          </Text>
          <Text as="p">
            The "Events" tab uses exact matching and is also active because it
            exactly matches.
          </Text>
          <Text as="p">
            The "Catalog" tab uses prefix matching but is NOT active because the
            URL doesn't start with "/catalog".
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
})`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/catalog/users/john/details']}>
      <BUIProvider>
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
      </BUIProvider>
    </MemoryRouter>
})`,...g.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/dashboard/analytics/reports']}>
      <BUIProvider>
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
          <Text as="p">
            Current URL: <strong>/dashboard/analytics/reports</strong>
          </Text>
          <Text as="p">
            • "Overview" tab: exact matching, NOT active (doesn't exactly match
            "/dashboard")
          </Text>
          <Text as="p">
            • "Analytics" tab: prefix matching, IS active (URL starts with
            "/dashboard/analytics")
          </Text>
          <Text as="p">
            • "Settings" tab: prefix matching, NOT active (URL doesn't start
            with "/dashboard/settings")
          </Text>
          <Text as="p">
            • "Help" tab: exact matching, NOT active (doesn't exactly match
            "/help")
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
})`,...u.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/foobar']}>
      <BUIProvider>
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
          <Text as="p">
            Current URL: <strong>/foobar</strong>
          </Text>
          <Text as="p">
            • "Foo" tab (prefix): NOT active - prevents "/foo" from matching
            "/foobar"
          </Text>
          <Text as="p">
            • "Foobar" tab (exact): IS active - exactly matches "/foobar"
          </Text>
          <Text as="p">
            • "Foo (exact)" tab: NOT active - doesn't exactly match "/foobar"
          </Text>
          <Text as="p">
            This shows that prefix matching properly requires a "/" separator to
            prevent false matches.
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
})`,...f.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/foo/bar']}>
      <BUIProvider>
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
          <Text as="p">
            Current URL: <strong>/foo/bar</strong>
          </Text>
          <Text as="p">
            • "Foo" tab (prefix): IS active - "/foo/bar" starts with "/foo/"
          </Text>
          <Text as="p">
            • "Foobar" tab (exact): NOT active - doesn't exactly match "/foobar"
          </Text>
          <Text as="p">
            • "Bar" tab (prefix): NOT active - "/foo/bar" doesn't start with
            "/bar"
          </Text>
          <Text as="p">
            This demonstrates proper prefix matching with the "/" separator.
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
})`,...j.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/']}>
      <BUIProvider>
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
          <Text as="p">
            Current URL: <strong>/</strong>
          </Text>
          <Text as="p">
            • "Home" tab (exact): IS active - exactly matches "/"
          </Text>
          <Text as="p">• "Home (prefix)" tab: IS active - "/" matches "/"</Text>
          <Text as="p">
            • "Catalog" tab (prefix): NOT active - "/" doesn't start with
            "/catalog"
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
})`,...y.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/cost-insights/dashboard?group=bar']}>
      <BUIProvider>
        <Tabs>
          <TabList>
            <Tab id="dashboard" href="/cost-insights/dashboard?group=foo" matchStrategy="prefix">
              Dashboard
            </Tab>
            <Tab id="alerts" href="/cost-insights/alerts?group=foo" matchStrategy="prefix">
              Alerts
            </Tab>
          </TabList>
        </Tabs>
        <Box mt="6" pl="2">
          <Text as="p">
            Current URL: <strong>/cost-insights/dashboard?group=bar</strong>
          </Text>
          <Text as="p">
            Tab hrefs include query params (e.g., ?group=foo) but the current
            URL has different query params (?group=bar).
          </Text>
          <Text as="p">
            • "Dashboard" tab: IS active — matching ignores query params and
            compares only the pathname.
          </Text>
          <Text as="p">
            • "Alerts" tab: NOT active — pathname /cost-insights/alerts doesn't
            match /cost-insights/dashboard.
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
})`,...v.input.parameters?.docs?.source}}};L.input.parameters={...L.input.parameters,docs:{...L.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  decorators: [withRouter],
  render: () => <Tabs>
      <TabList>
        <Tab id="tab1">First</Tab>
        <Tab id="tab2">
          <CyclingTab />
        </Tab>
        <Tab id="tab3">Last</Tab>
      </TabList>
      <TabPanel id="tab1">
        <Text>First tab content</Text>
      </TabPanel>
      <TabPanel id="tab2">
        <Text>Middle tab content — its title cycles every second</Text>
      </TabPanel>
      <TabPanel id="tab3">
        <Text>Last tab content</Text>
      </TabPanel>
    </Tabs>
})`,...L.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: ''
  },
  render: () => <MemoryRouter initialEntries={['/random-page']}>
      <BUIProvider>
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
          <Text as="p">
            <strong>Case 2: With hrefs</strong>
          </Text>
          <Text as="p">
            By default no selection is shown because the URL doesn't match any
            tab's href.
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
      </BUIProvider>
    </MemoryRouter>
})`,...R.input.parameters?.docs?.source}}};const ie=["Default","WithTabPanels","WithMockedURLTab2","WithMockedURLTab3","WithMockedURLNoMatch","ExactMatchingDefault","PrefixMatchingForNestedRoutes","PrefixMatchingDeepNesting","MixedMatchingStrategies","PrefixMatchingEdgeCases","PrefixMatchingWithSlash","RootPathMatching","HrefWithQueryParams","DynamicTabWidth","AutoSelectionOfTabs"];export{R as AutoSelectionOfTabs,d as Default,L as DynamicTabWidth,T as ExactMatchingDefault,v as HrefWithQueryParams,u as MixedMatchingStrategies,g as PrefixMatchingDeepNesting,f as PrefixMatchingEdgeCases,m as PrefixMatchingForNestedRoutes,j as PrefixMatchingWithSlash,y as RootPathMatching,p as WithMockedURLNoMatch,b as WithMockedURLTab2,x as WithMockedURLTab3,l as WithTabPanels,ie as __namedExportsOrder};
