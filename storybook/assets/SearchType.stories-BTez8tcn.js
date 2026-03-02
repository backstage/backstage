import{aF as v,aG as f,aH as h,aI as T,V,j as e,W as y,P as S}from"./iframe-CGY8RtMM.js";import{M as x}from"./MenuBook--Sr9MWTK.js";import{M as I}from"./Person-BiVDmP1C.js";import{S as s}from"./SearchType-_wADSDnN.js";import{s as g,M as j}from"./api-D-Yqlpwx.js";import{S as D}from"./SearchContext-opqB0z-1.js";import{S as u}from"./Grid-C7KzSS4F.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-Dmv7QB28.js";import"./useAsync-DeQC24J1.js";import"./useMountedState-CiwiE7kc.js";import"./translation-DCPnmFH2.js";import"./makeStyles-DsrsBIHr.js";import"./Box-CzermUI4.js";import"./styled-CKkmDcn6.js";import"./AccordionDetails-U1rx4U3Z.js";import"./index-B9sM2jn7.js";import"./Collapse-D-fg3clD.js";import"./List-BP8Bshto.js";import"./ListContext-CqJ372Q7.js";import"./Divider-Br8PYMzl.js";import"./ListItem-mZsObVR0.js";import"./ListItemIcon-D6gkUr9t.js";import"./ListItemText-CUaBPH5v.js";import"./Tabs-DcH1tcMC.js";import"./KeyboardArrowRight-DbxfU3j3.js";import"./FormLabel-CR5fGpjj.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DwH8W-_C.js";import"./InputLabel-DzeVmmuY.js";import"./Select-l4R_loA8.js";import"./Popover-DEBV3NVZ.js";import"./Modal-CjAaGIlL.js";import"./Portal-CPD4eQSx.js";import"./MenuItem-BBtigwgA.js";import"./Checkbox-DL7lPxja.js";import"./SwitchBase-CCgnxhYz.js";import"./Chip-BIoQ1eMT.js";import"./lodash-D5DB6SGB.js";import"./useAnalytics-DzkBVlTS.js";var t={},c;function _(){if(c)return t;c=1;var n=v(),i=f();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=i(h()),m=n(T()),d=(0,m.default)(p.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return t.default=d,t}var R=_();const P=V(R),fe={title:"Plugins/Search/SearchType",component:s,decorators:[n=>e.jsx(y,{apis:[[g,new j]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(n,{})})})})})],tags:["!manifest"]},l=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:l,defaultValue:l[0]})}),r=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(x,{})},{value:"value-2",name:"Value Two",icon:e.jsx(P,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),o=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
