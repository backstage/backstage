import{aF as h,aG as T,aH as y,aI as V,V as S,j as e,W as x,P as _}from"./iframe-B7rMUZLI.js";import{M as I}from"./MenuBook-Cx3EtRTm.js";import{S as u}from"./SearchType-ChXbstil.js";import{s as g,M as j}from"./api-etO2Y8jF.js";import{S as P}from"./SearchContext-Di6lPCma.js";import{S as m}from"./Grid-ChmRa1xb.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DzZiZ1ed.js";import"./useAsync-BRfV-jtK.js";import"./useMountedState-DOMzvQnC.js";import"./translation-BrLn9P1W.js";import"./makeStyles-BbDOaNwq.js";import"./Box-DE3k0g2W.js";import"./styled-rHipxG34.js";import"./AccordionDetails-BQq5yz58.js";import"./index-B9sM2jn7.js";import"./Collapse-Dg7I3X8s.js";import"./List-NlkzeZDP.js";import"./ListContext-2sTnrhYf.js";import"./Divider-fyxZ8qXv.js";import"./ListItem-DUvIrbAd.js";import"./ListItemIcon-DsUV2Ms8.js";import"./ListItemText-C1Ml3ojI.js";import"./Tabs-CCEzxq0k.js";import"./KeyboardArrowRight-CMkV_v6v.js";import"./FormLabel-RrwRY4RP.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DSKSapn-.js";import"./InputLabel-iYXI3wLC.js";import"./Select-2c4XyF4s.js";import"./Popover-QJoOcoVv.js";import"./Modal-BTIfo08e.js";import"./Portal-Gi_4ezMI.js";import"./MenuItem-D6nyI-Un.js";import"./Checkbox-B5d0gLRa.js";import"./SwitchBase-BcNLhgYQ.js";import"./Chip-CQHFAwl4.js";import"./lodash-DMrnViDb.js";import"./useAnalytics-KiNG90-s.js";var n={},d;function D(){if(d)return n;d=1;var t=h(),c=T();Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var l=c(y()),i=t(V()),p=(0,i.default)(l.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return n.default=p,n}var R=D();const q=S(R);var s={},v;function A(){if(v)return s;v=1;var t=h(),c=T();Object.defineProperty(s,"__esModule",{value:!0}),s.default=void 0;var l=c(y()),i=t(V()),p=(0,i.default)(l.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return s.default=p,s}var M=A();const b=S(M),ye={title:"Plugins/Search/SearchType",component:u,decorators:[t=>e.jsx(x,{apis:[[g,new j]],children:e.jsx(P,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(t,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],a=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),r=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(I,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(q,{})}]}),o=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Accordion"};o.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
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
}`,...o.parameters?.docs?.source}}};const Ve=["Default","Accordion","Tabs"];export{r as Accordion,a as Default,o as Tabs,Ve as __namedExportsOrder,ye as default};
