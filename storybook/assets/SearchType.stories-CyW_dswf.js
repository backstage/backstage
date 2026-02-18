import{aA as v,aB as f,aC as h,aD as T,V,j as e,W as y,P as S}from"./iframe-DHcBEgBH.js";import{M as x}from"./MenuBook-CPj5emtN.js";import{M as g}from"./Person-DFYXoTBl.js";import{S as s}from"./SearchType-DQa8-6LB.js";import{s as j,M as D}from"./api-C0xzS8jB.js";import{S as I}from"./SearchContext-CYSqSGHN.js";import{S as u}from"./Grid-BgyCT4VC.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-acgofFN2.js";import"./useAsync-Cocbz1wK.js";import"./useMountedState-f5Qy4kw8.js";import"./translation-JyalhL5f.js";import"./makeStyles-pGUaJr24.js";import"./Box-CbZQ1U2e.js";import"./styled-DMPIvYo_.js";import"./AccordionDetails-79ol80ql.js";import"./index-B9sM2jn7.js";import"./Collapse-CvYPW26f.js";import"./List-CzJs69wv.js";import"./ListContext-bUUGMd0s.js";import"./Divider-Du8vAg9L.js";import"./ListItem-CTYXOgij.js";import"./ListItemIcon-B6FYriHS.js";import"./ListItemText-Dm3_nGas.js";import"./Tabs-CHsVHDpA.js";import"./KeyboardArrowRight-D1qfzcfH.js";import"./FormLabel-CzXlMnOV.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C4x-N1af.js";import"./InputLabel-DGNrG_ha.js";import"./Select-Bsf1NO_T.js";import"./Popover-DBNCOFt-.js";import"./Modal-D6JI9uWD.js";import"./Portal-4pR_an9W.js";import"./MenuItem-C4EUiQPv.js";import"./Checkbox-Ce8tMBOL.js";import"./SwitchBase-lXDOIQBI.js";import"./Chip-z9xt1GeX.js";import"./lodash-BO6khM8p.js";import"./useAnalytics-DzmCXJiR.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const A=V(R),fe={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(y,{apis:[[j,new D]],children:e.jsx(I,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(g,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
