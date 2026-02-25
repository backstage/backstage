import{aK as v,aL as f,aM as h,aN as T,Y as y,j as e,Z as V,P as S}from"./iframe-DhudO7cT.js";import{M as x}from"./MenuBook-CMDIJTkK.js";import{M as g}from"./Person-QGUYlJWQ.js";import{S as s}from"./SearchType-B_N-Xnm5.js";import{s as j,M as I}from"./api-rLiZlmmd.js";import{S as D}from"./SearchContext-Ci6cvaR5.js";import{S as u}from"./Grid-jH0iynLg.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-Dzyb0v5N.js";import"./useAsync-CTFC4gS_.js";import"./useMountedState-Cnm9VAPO.js";import"./translation-zkjNy0g3.js";import"./makeStyles-DirKP-uM.js";import"./Box-Dfq4Rk_q.js";import"./styled-Bb0qtC6P.js";import"./AccordionDetails-DA1Ac_9j.js";import"./index-B9sM2jn7.js";import"./Collapse-Si3YYgpF.js";import"./List-CETIUmeh.js";import"./ListContext-DXxn2Iso.js";import"./Divider-RGA0wFT4.js";import"./ListItem--o6-pCQj.js";import"./ListItemIcon-B92s_sX7.js";import"./ListItemText-BSb4Izlr.js";import"./Tabs-Bac8NjfU.js";import"./KeyboardArrowRight-BmEx88-C.js";import"./FormLabel-BunYcRsf.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BjKsPsRM.js";import"./InputLabel-BzpyGJFz.js";import"./Select-SVF-WZGg.js";import"./Popover-Co_U8rXS.js";import"./Modal-D-bP3iV-.js";import"./Portal-DHDPWTL1.js";import"./MenuItem-D36xk1oN.js";import"./Checkbox-Bwz0Bue4.js";import"./SwitchBase-BE2UYCnQ.js";import"./Chip-DWqAK_m6.js";import"./lodash-D50Mv8ds.js";import"./useAnalytics-CJ0Sk0Lg.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const P=y(R),fe={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(V,{apis:[[j,new I]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(P,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
}`,...o.parameters?.docs?.source}}};const he=["Default","Accordion","Tabs"];export{r as Accordion,a as Default,o as Tabs,he as __namedExportsOrder,fe as default};
