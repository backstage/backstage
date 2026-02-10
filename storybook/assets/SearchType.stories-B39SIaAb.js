import{aC as v,aD as f,aE as h,aF as T,a1 as y,j as e,U as V,P as S}from"./iframe-CDQkRPtg.js";import{M as x}from"./MenuBook-DirdRLxv.js";import{U as g}from"./Person-BkdUROYI.js";import{S as s}from"./SearchType-B7BMiOqS.js";import{s as j,M as D}from"./api-BzNEOoum.js";import{S as I}from"./SearchContext-DOtDp9Sx.js";import{S as u}from"./Grid-CLxLLrBH.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-Bwto4mGt.js";import"./useAsync-BT3fPnna.js";import"./useMountedState-C2nQ5XSq.js";import"./translation-BWL_O6Kw.js";import"./Box-CFWJqO9C.js";import"./styled-CcM8fDvt.js";import"./AccordionDetails-Cp5Nx1Lx.js";import"./index-B9sM2jn7.js";import"./Collapse-DIN7Ymif.js";import"./List-Ciyy1sk9.js";import"./ListContext-C9VfLDtj.js";import"./Divider-o218nSC0.js";import"./ListItem-CsL3oSDi.js";import"./ListItemIcon-DllUceRQ.js";import"./ListItemText-DHloRduP.js";import"./Tabs-DTiyaeV4.js";import"./KeyboardArrowRight-BfabCNpX.js";import"./FormLabel-BjdOaYPS.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B7ZD3Dgb.js";import"./InputLabel-BnA620d6.js";import"./Select-Bb02LF0r.js";import"./Popover-CXspRPX5.js";import"./Modal-BVCBWYhk.js";import"./Portal-uMAxVVb4.js";import"./MenuItem-CnoKRoPF.js";import"./Checkbox-DjShVqi-.js";import"./SwitchBase-DNXe7Qi6.js";import"./Chip-CNKQIOOg.js";import"./lodash-m4O8l6WS.js";import"./useAnalytics-SrifWrGy.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(V,{apis:[[j,new D]],children:e.jsx(I,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>
  );
};
`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Accordion = () => {
  return (
    <SearchType.Accordion
      name="Result Types"
      defaultValue="value-1"
      types={[
        { value: "value-1", name: "Value One", icon: <CatalogIcon /> },
        { value: "value-2", name: "Value Two", icon: <DocsIcon /> },
        { value: "value-3", name: "Value Three", icon: <UsersGroupsIcon /> },
      ]}
    />
  );
};
`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const Tabs = () => {
  return (
    <SearchType.Tabs
      defaultValue="value-1"
      types={[
        { value: "value-1", name: "Value One" },
        { value: "value-2", name: "Value Two" },
        { value: "value-3", name: "Value Three" },
      ]}
    />
  );
};
`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <SearchType.Accordion name="Result Types" defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One',
    icon: <CatalogIcon />
  }, {
    value: 'value-2',
    name: 'Value Two',
    icon: <DocsIcon />
  }, {
    value: 'value-3',
    name: 'Value Three',
    icon: <UsersGroupsIcon />
  }]} />;
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  return <SearchType.Tabs defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One'
  }, {
    value: 'value-2',
    name: 'Value Two'
  }, {
    value: 'value-3',
    name: 'Value Three'
  }]} />;
}`,...o.parameters?.docs?.source}}};const fe=["Default","Accordion","Tabs"];export{r as Accordion,a as Default,o as Tabs,fe as __namedExportsOrder,ve as default};
