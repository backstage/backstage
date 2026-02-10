import{aC as v,aD as f,aE as h,aF as T,a1 as y,j as e,U as V,P as S}from"./iframe-DLcIH_b-.js";import{M as x}from"./MenuBook-BX61cdfz.js";import{U as g}from"./Person-BSm1aXGI.js";import{S as s}from"./SearchType-Dlher0YZ.js";import{s as j,M as D}from"./api-DkwNX4It.js";import{S as I}from"./SearchContext-zR3MpwzH.js";import{S as u}from"./Grid-CHWXErYD.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-C68SGr3c.js";import"./useAsync-Dzs_Z8Sa.js";import"./useMountedState-CJM5rP6v.js";import"./translation-D6Qs7K8B.js";import"./Box-DaYdGGLQ.js";import"./styled-CJB3T-Oh.js";import"./AccordionDetails-tL39bQia.js";import"./index-B9sM2jn7.js";import"./Collapse-BJd8DAV0.js";import"./List-DgCkyPF-.js";import"./ListContext-C-a3EO19.js";import"./Divider-fjKwa6Mv.js";import"./ListItem-BtxOUJ8W.js";import"./ListItemIcon-BEyypNaA.js";import"./ListItemText-C61nqRKy.js";import"./Tabs-DSMbnArp.js";import"./KeyboardArrowRight-DUtyBy6Z.js";import"./FormLabel-lfFIv-fQ.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BpQOuyS3.js";import"./InputLabel-C3T0rSQI.js";import"./Select-pav2cxO6.js";import"./Popover-C_GbUgIX.js";import"./Modal-DqSKD8Sk.js";import"./Portal-D2sb6xU7.js";import"./MenuItem-BUYUm_bi.js";import"./Checkbox-D9UkaZD3.js";import"./SwitchBase-C5WUqKwt.js";import"./Chip-DN67F2sn.js";import"./lodash-rxUtCtQt.js";import"./useAnalytics-DDULU5MS.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(V,{apis:[[j,new D]],children:e.jsx(I,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
