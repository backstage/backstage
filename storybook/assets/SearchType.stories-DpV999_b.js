import{aA as v,aB as f,aC as h,aD as T,V,j as e,W as y,P as S}from"./iframe-BWaAozhM.js";import{M as x}from"./MenuBook-D4_VJ2Y-.js";import{M as g}from"./Person-B7nE2lgI.js";import{S as s}from"./SearchType-DVmQc0ha.js";import{s as j,M as D}from"./api-BbfIOoSU.js";import{S as I}from"./SearchContext-BqA84v2x.js";import{S as u}from"./Grid-Bpm_oOGo.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-B6NFdm12.js";import"./useAsync-Cwpml34y.js";import"./useMountedState-BlQS3tzi.js";import"./translation-r5aS_655.js";import"./makeStyles-BXQqwRxM.js";import"./Box-B9d7t8SV.js";import"./styled-BFyqjI4T.js";import"./AccordionDetails-BO1bPuht.js";import"./index-B9sM2jn7.js";import"./Collapse-PQIWvWXL.js";import"./List-d_1gDOpt.js";import"./ListContext-KZtCLGQU.js";import"./Divider-DKWgzE0b.js";import"./ListItem-CwaI1EQV.js";import"./ListItemIcon-Dmk9Y__O.js";import"./ListItemText-j6Wkxdaj.js";import"./Tabs-Dq07xJV_.js";import"./KeyboardArrowRight-CBjkn45j.js";import"./FormLabel-CHl2HXHP.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DNJmyzsM.js";import"./InputLabel-BxGo0aOj.js";import"./Select-q370X4Hr.js";import"./Popover-GnSZHMUP.js";import"./Modal-DSMNGChR.js";import"./Portal-CeZ7D8j3.js";import"./MenuItem-CWY30vWU.js";import"./Checkbox-opBu3oCg.js";import"./SwitchBase-CwOu7BV2.js";import"./Chip-vzBxutYj.js";import"./lodash-C-lPDFyh.js";import"./useAnalytics-CGFkzRxT.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const A=V(R),fe={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(y,{apis:[[j,new D]],children:e.jsx(I,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
