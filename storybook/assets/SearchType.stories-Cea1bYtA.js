import{aA as v,aB as f,aC as h,aD as T,V,j as e,W as y,P as S}from"./iframe-DBsVXRYe.js";import{M as x}from"./MenuBook-Dbus6IRf.js";import{M as g}from"./Person-DIKg0fvM.js";import{S as s}from"./SearchType-DP9RJ60w.js";import{s as j,M as D}from"./api-DsxXV-qP.js";import{S as I}from"./SearchContext-Bmxfx14E.js";import{S as u}from"./Grid-BdpucV2E.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-X1Sw9hIC.js";import"./useAsync-CBnGfjig.js";import"./useMountedState-D8yjF72b.js";import"./translation-DCN-qCzN.js";import"./makeStyles-u8aTytdp.js";import"./Box-DM8WpBiE.js";import"./styled-CtO3CIMm.js";import"./AccordionDetails-NV6-MnS3.js";import"./index-B9sM2jn7.js";import"./Collapse-DWkyhCos.js";import"./List-CIVoJXzy.js";import"./ListContext-DUSKHWgB.js";import"./Divider-DEXssYkW.js";import"./ListItem-DQ9bn4c-.js";import"./ListItemIcon-DrBKcuO8.js";import"./ListItemText-Udvvf9eP.js";import"./Tabs-BH8rs-Pq.js";import"./KeyboardArrowRight-CSkWkiyd.js";import"./FormLabel-BDMi2SjX.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-uih_F7xd.js";import"./InputLabel-DyH2lMcA.js";import"./Select-yW0Lhu1K.js";import"./Popover-CizZCG4E.js";import"./Modal-Ds3oc-YR.js";import"./Portal-9OHpjUEk.js";import"./MenuItem-CaWLJ_Iy.js";import"./Checkbox-DcJ65tI_.js";import"./SwitchBase-DUYfRYuV.js";import"./Chip-BhYQb-0b.js";import"./lodash-DArDi9rF.js";import"./useAnalytics-BiDIJzMW.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const A=V(R),fe={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(y,{apis:[[j,new D]],children:e.jsx(I,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
